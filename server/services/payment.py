import uuid
from flask import current_app
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Any, Tuple

from app import db
from models.user import User
from models.payment import Payment
from xendit import XenditConfig, XenditClient, XenditError, PaymentStatus, PaymentMethod


class PaymentService:
    def __init__(self):
        self._xendit_client = None

    def _get_client(self) -> XenditClient:
        if not self._xendit_client:
            config = XenditConfig.from_flask_config(current_app.config)
            self._xendit_client = XenditClient(config)
        return self._xendit_client

    def get_payment_by_id(self, payment_id: int) -> Optional[Payment]:
        return db.session.get(Payment, payment_id)

    def get_payments(self, page: int = 1, per_page: int = 10, filters: Optional[Dict[str, Any]] = None) -> Tuple[List[Payment], int, int]:
        payment_query = db.session.query(Payment)
        if filters:
            for key, value in filters.items():
                if hasattr(Payment, key):
                    payment_query = payment_query.filter(getattr(Payment, key) == value)
        count = payment_query.count()
        total_pages = (count + per_page - 1) // per_page
        payments = payment_query.order_by(Payment.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
        return payments, count, total_pages

    def create_xendit_invoice(
        self,
        amount: float,
        currency: str = "PHP",
        description: str = "Order Payment",
        payment_methods: List[str] = None,
        user_id: Optional[int] = None,
        customer_email: Optional[str] = None,
        customer_name: Optional[str] = None
    ) -> Dict[str, Any]:
        try:
            client = self._get_client()
            user = db.session.get(User, user_id) if user_id else None
            external_id = f"invoice_{user_id or 'guest'}_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}"
            if not payment_methods:
                payment_methods = [method.value for method in PaymentMethod]
            frontend_url = current_app.config["FRONTEND_URL"]
            customer_data = {
                "given_names": (f"{user.first_name} {user.last_name}".strip() if user else customer_name or "Guest Customer"),
                "email": user.email if user else customer_email or "guest@example.com"
            }
            invoice_data = {
                "external_id": external_id,
                "amount": amount,
                "currency": currency,
                "description": description,
                "invoice_duration": 86400,
                "payment_methods": payment_methods,
                "success_redirect_url": f"{frontend_url}/payment/success",
                "failure_redirect_url": f"{frontend_url}/payment/failed",
                "customer": customer_data
            }
            print(invoice_data)
            xendit_response = client.create_invoice(invoice_data)
            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=PaymentStatus.PENDING.value,
                payment_method="xendit_invoice",
                transaction_id=xendit_response['id'],
                payment_date=None,
                external_id=external_id,
                xendit_invoice_id=xendit_response.get('id'),
                invoice_url=xendit_response.get('invoice_url'),
                expires_at=datetime.fromisoformat(xendit_response.get('expiry_date').replace("Z", "+00:00"))
            )
            db.session.add(payment)
            db.session.commit()
            return {
                "success": True,
                "payment": payment,
            }
        except XenditError as e:
            print(f"Xendit Error: {e.message} (Code: {e.code})")
            db.session.rollback()
            return {
                "success": False,
                "error": f"Xendit Error: {e.message}",
                "error_code": e.code
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Payment Processing Failed: {str(e)}"
            }

    def create_virtual_account_payment(
        self,
        amount: float,
        bank_code: str = "BDO",
        currency: str = "PHP",
        user_id: Optional[int] = None,
        customer_name: Optional[str] = None
    ) -> Dict[str, Any]:
        try:
            client = self._get_client()
            external_id = f"invoice_{user_id or 'guest'}_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}"
            account_name = customer_name or f"User {user_id}" if user_id else "Guest Customer"

            virtual_account_data = {
                "external_id": external_id,
                "bank_code": bank_code,
                "name": account_name,
                "expected_amount": amount,
                "currency": currency,
                "is_closed": True,
                "expiration_date": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat().replace("+00:00", "Z")
            }

            xendit_response = client.create_virtual_account(virtual_account_data)

            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=PaymentStatus.PENDING.value,
                payment_method=f"virtual_account_{bank_code}",
                transaction_id=xendit_response['id'],
                payment_date=None,
                external_id=external_id,
                expires_at=datetime.fromisoformat(xendit_response['expiration_date'].replace("Z", "+00:00"))
            )

            db.session.add(payment)
            db.session.commit()

            return {
                "success": True,
                "payment": payment,
                "account_number": xendit_response['account_number'],
                "bank_code": bank_code,
            }

        except XenditError as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Xendit Error: {e.message}",
                "error_code": e.code
            }

        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Payment Processing Failed: {str(e)}"
            }

    def handle_xendit_webhook(self, webhook_data: Dict, headers: Dict[str, str]) -> Dict[str, Any]:
        try:
            expected_token = self._get_client().config.webhook_token
            received_token = headers.get('x-callback-token')

            if received_token != expected_token:
                return {"success": False, "error": "Invalid Webhook Token", "status_code": 403}

            transaction_id = webhook_data.get('id')
            status = webhook_data.get('status')
            external_id = webhook_data.get('external_id')

            if not transaction_id or not external_id:
                return {"success": False, "error": "Missing Invoice Identifiers", "status_code": 400}

            payment = db.session.query(Payment).filter_by(
                transaction_id=transaction_id,
                external_id=external_id
            ).first()

            if not payment:
                return {"success": False, "error": "Payment Not Found", "status_code": 404}

            if status == "PAID":
                payment.status = PaymentStatus.PAID.value
                payment.payment_date = datetime.now(timezone.utc)
            elif status == "EXPIRED":
                payment.status = PaymentStatus.EXPIRED.value
            elif status == "FAILED":
                payment.status = PaymentStatus.FAILED.value
            else:
                return {"success": False, "error": f"Unhandled Status: {status}", "status_code": 422}

            db.session.commit()

            return {
                "success": True,
                "payment_id": payment.id,
                "status": payment.status,
                "status_code": 200
            }

        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Webhook Processing Failed: {str(e)}",
                "status_code": 500
            }

    def check_payment_status(self, payment_id: int) -> Dict[str, Any]:
        try:
            payment = self.get_payment_by_id(payment_id)
            if not payment:
                return {"success": False, "error": "Payment Not Found"}

            if payment.payment_method == "xendit_invoice":
                response = self._get_client().get_invoice(payment.transaction_id)
                status = response.get('status')

                if status == "PAID" and payment.status != PaymentStatus.PAID.value:
                    payment.status = PaymentStatus.PAID.value
                    payment.payment_date = datetime.now(timezone.utc)
                    db.session.commit()
                elif status == "EXPIRED" and payment.status != PaymentStatus.EXPIRED.value:
                    payment.status = PaymentStatus.EXPIRED.value
                    db.session.commit()

            return {
                "success": True,
                "payment": payment
            }

        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Status Check Failed: {str(e)}"
            }

    def serialize_payment(self, payment: Payment) -> Dict[str, Any]:
        return payment.to_dict()
