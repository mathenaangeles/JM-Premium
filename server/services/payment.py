import uuid
from flask import current_app
from datetime import datetime, timezone
from typing import Dict, Optional, Any, Tuple, List

from app import db
from models.payment import Payment
from xendit import XenditClient, XenditError, PaymentStatus, PaymentMethod, EWalletType

class PaymentService:
    def __init__(self):
        self._xendit_client = None

    def _get_client(self):
        if self._xendit_client is None:
            self._xendit_client = XenditClient(
                secret_key = current_app.config.get("XENDIT_SECRET_KEY"),
            )
        return self._xendit_client

    def _get_payment_method_config(self, payment_method: str, **kwargs) -> Tuple[str, Dict[str, Any]]:
        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        order_id = kwargs.get("order_id")
        return_url = f"{frontend_url}/order/{order_id}"

        payment_method = payment_method.strip().upper()

        if payment_method == PaymentMethod.CREDIT_CARD.value:
            channel_code = "CARDS"
            channel_properties = {
                "card_number": kwargs.get("card_number"),
                "expiry_year": kwargs.get("expiry_year"),
                "expiry_month": kwargs.get("expiry_month"),
                "cvn": kwargs.get("cvn"),
                "cardholder_name": kwargs.get("cardholder_name"),
                "cardholder_email": kwargs.get("cardholder_email"),
                "success_return_url": return_url,
                "failure_return_url": return_url,
                "skip_three_ds": kwargs.get("skip_three_ds", False),
                "card_on_file_type": kwargs.get("card_on_file_type", "MERCHANT_UNSCHEDULED")
            }
            return channel_code, channel_properties

        elif payment_method == PaymentMethod.EWALLET.value:
            ewallet_mapping = {
                "gcash": "GCASH",
                "paymaya": "PAYMAYA",
                "grabpay": "GRABPAY",
                "shopeepay": "SHOPEEPAY"
            }

            ewallet_type = kwargs.get("ewallet_type", EWalletType.GCASH.value).strip().lower()
            if ewallet_type not in ewallet_mapping:
                raise ValueError(f"Unsupported e-wallet type: {ewallet_type}")

            channel_code = ewallet_mapping[ewallet_type]
            channel_properties = {
                "success_return_url": return_url,
                "failure_return_url": return_url
            }
            return channel_code, channel_properties

        raise ValueError(f"Unsupported payment method: {payment_method}")

    
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

    def create_payment_request(
        self,
        amount: float,
        currency: str = "PHP",
        payment_method: str = "CARDS",
        user_id: Optional[int] = None,
        description: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        try:
            client = self._get_client()
            reference_id = f"payment_{user_id or 'guest'}_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}"
            channel_code, channel_properties = self._get_payment_method_config(payment_method, **kwargs)
            payment_request_data = {
                "reference_id": reference_id,
                "type": "PAY",
                "country": "PH",
                "currency": currency,
                "request_amount": amount,
                "capture_method": "AUTOMATIC",
                "channel_code": channel_code,
                "channel_properties": channel_properties,
                "description": description or f"Payment for order {kwargs.get('order_id', 'N/A')}",
                "metadata": {
                    "user_id": str(user_id) if user_id else None,
                    "order_id": kwargs.get("order_id")
                }
            }
            print(payment_request_data)
            xendit_response = client.create_payment_request(payment_request_data)
            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=self._map_xendit_status_to_internal(xendit_response.get('status')),
                payment_method=payment_method,
                payment_date=None,
                reference_id=reference_id,
                xendit_id=xendit_response.get('id')
            )
            db.session.add(payment)
            db.session.commit()
            return {
                "success": True,
                "payment": payment,
                "xendit_response": xendit_response,
                "actions": xendit_response.get('actions', []),
                "status": xendit_response.get('status')
            }
        except (XenditError, ValueError) as e:
            db.session.rollback()
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Payment Processing Failed: {str(e)}"
            }

    def handle_payment_request_webhook(self, webhook_data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        try:
            expected_token = self._get_client().config.webhook_token
            received_token = headers.get('x-callback-token')
            if received_token != expected_token:
                return {"success": False, "error": "Invalid Webhook Token", "status_code": 403}
            event_type = webhook_data.get('event')
            data = webhook_data.get('data', {})
            reference_id = data.get('reference_id')
            payment_request_id = data.get('id')
            if not reference_id or not payment_request_id:
                return {"success": False, "error": "Missing payment reference or ID", "status_code": 400}
            payment = db.session.query(Payment).filter_by(reference_id=reference_id, xendit_id=payment_request_id).first()
            if not payment:
                return {"success": False, "error": "Payment not found", "status_code": 404}
            status = data.get('status')
            payment.status = self._map_xendit_status_to_internal(status)
            if status == "SUCCEEDED":
                payment.payment_date = datetime.now(timezone.utc)
            if "payments" in data:
                payment.payment_details = data["payments"][0]
            if "actions" in data:
                payment.required_actions = data["actions"]
            db.session.commit()
            return {"success": True, "event_type": event_type, "status_code": 200}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e), "status_code": 500}

    def check_payment_status(self, payment_id: int) -> Dict[str, Any]:
        try:
            payment = self.get_payment_by_id(payment_id)
            if not payment:
                return {"success": False, "error": "Payment not found"}
            if not payment.xendit_id:
                return {"success": False, "error": "Missing Xendit payment ID"}
            response = self._get_client().get_payment_request(payment.xendit_id)
            status = response.get('status')
            internal_status = self._map_xendit_status_to_internal(status)
            if payment.status != internal_status:
                payment.status = internal_status
                if status == "SUCCEEDED" and not payment.payment_date:
                    payment.payment_date = datetime.now(timezone.utc)
                db.session.commit()
            return {
                "success": True,
                "xendit_status": status,
                "payment": payment,
                "response": response
            }

        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e)}

    def _map_xendit_status_to_internal(self, xendit_status: str) -> str:
        return {
            "REQUIRES_ACTION": PaymentStatus.PENDING.value,
            "PENDING": PaymentStatus.PENDING.value,
            "SUCCEEDED": PaymentStatus.PAID.value,
            "FAILED": PaymentStatus.FAILED.value,
            "EXPIRED": PaymentStatus.EXPIRED.value,
            "CANCELLED": PaymentStatus.FAILED.value
        }.get(xendit_status, PaymentStatus.PENDING.value)

    def get_payment_by_id(self, payment_id: int) -> Optional[Payment]:
        return db.session.get(Payment, payment_id)

    def serialize_payment(self, payment: Payment) -> Dict[str, Any]:
        return payment.to_dict()
