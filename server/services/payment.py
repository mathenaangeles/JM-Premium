from datetime import datetime
from flask import current_app
from typing import Dict, List, Optional, Any, Tuple

from app import db
from models.user import User
from models.payment import Payment
from xendit_config import XenditConfig, XenditClient, XenditError, PaymentStatus


class PaymentService:
    def __init__(self):
        self.xendit_config = XenditConfig.from_flask_config(current_app.config)
        self.xendit_client = XenditClient(self.xendit_config)

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

    def create_xendit_invoice(self, user_id: int, amount: float, currency: str = "PHP", description: str = "Order Payment", payment_methods: List[str] = None) -> Dict[str, Any]:
        try:
            user = db.session.get(User, user_id)
            if not user:
                raise ValueError(f"User {user_id} not found.")
            external_id = f"invoice_{user_id}_{int(datetime.now().timestamp())}"
            if not payment_methods:
                payment_methods = ["BANK_TRANSFER", "CREDIT_CARD", "EWALLET"]
            frontend_url = current_app.config["FRONTEND_URL"]
            invoice_data = {
                "external_id": external_id,
                "amount": amount,
                "currency": currency,
                "description": description,
                "invoice_duration": 86400,  # 24 hours
                "payment_methods": payment_methods,
                "success_redirect_url": f"{frontend_url}/payment/success",
                "failure_redirect_url": f"{frontend_url}/payment/failed",
                "customer": {
                    "given_names": (user.first_name + " " + user.last_name) or user_id,
                    "email": user.email,
                }
            }
            xendit_response = self.xendit_client.create_invoice(invoice_data)
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
                expires_at=xendit_response.get('expiry_date')
            )
            db.session.add(payment)
            db.session.commit()
            return {
                "success": True,
                "payment_id": payment.id,
                "xendit_invoice_id": payment.xendit_invoice_id,
                "invoice_url": payment.invoice_url,
                "external_id": external_id,
                "expires_at": payment.expires_at
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
                "error": f"Unexpected Error: {str(e)}"
            }
    
    def create_virtual_account_payment(self, user_id: int, amount: float, bank_code: str = "BCA", currency: str = "PHP") -> Dict[str, Any]:
        try:
            external_id = f"virtual_account_{user_id}_{int(datetime.now().timestamp())}"
            virtual_account_data = {
                "external_id": external_id,
                "bank_code": bank_code,
                "name": user_id,
                "expected_amount": amount,
                "currency": currency,
                "is_closed": True,
                "expiration_date": datetime.now().isoformat() + "Z"
            }
            xendit_response = self.xendit_client.create_virtual_account(virtual_account_data)
            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=PaymentStatus.PENDING.value,
                payment_method=f"virtual_account_{bank_code}",
                transaction_id=xendit_response['id'],
                payment_date=None
            )
            db.session.add(payment)
            db.session.commit()
            return {
                "success": True,
                "payment_id": payment.id,
                "account_number": xendit_response['account_number'],
                "bank_code": bank_code,
                "external_id": external_id,
                "expires_at": xendit_response['expiration_date']
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
                "error": f"Unexpected Error: {str(e)}"
            }
    
    def handle_xendit_webhook(self, webhook_data: Dict) -> Dict[str, Any]:
        try:
            # Verify webhook token (you should implement proper verification)
            webhook_token = webhook_data.get('webhook_token')
            if webhook_token != self.xendit_config.webhook_token:
                return {"success": False, "error": "Invalid webhook token"}
            
            # Get payment by transaction ID
            transaction_id = webhook_data.get('id')
            payment = db.session.query(Payment).filter_by(transaction_id=transaction_id).first()
            
            if not payment:
                return {"success": False, "error": "Payment not found"}
            
            # Update payment status based on webhook event
            event_type = webhook_data.get('status')
            
            if event_type == 'PAID':
                payment.status = PaymentStatus.COMPLETED.value
                payment.payment_date = datetime.now()
            elif event_type == 'EXPIRED':
                payment.status = PaymentStatus.EXPIRED.value
            elif event_type == 'FAILED':
                payment.status = PaymentStatus.FAILED.value
            
            db.session.commit()
            
            return {
                "success": True,
                "payment_id": payment.id,
                "status": payment.status
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Webhook processing failed: {str(e)}"
            }
    
    def check_payment_status(self, payment_id: int) -> Dict[str, Any]:
        """Check payment status with Xendit API"""
        try:
            payment = self.get_payment_by_id(payment_id)
            if not payment:
                return {"success": False, "error": "Payment not found"}
            
            # Check with Xendit API
            if payment.payment_method == "xendit_invoice":
                xendit_response = self.xendit_client.get_invoice(payment.transaction_id)
            else:
                # For other payment methods, you might need different API calls
                return {"success": True, "status": payment.status}
            
            # Update local payment status if needed
            xendit_status = xendit_response.get('status')
            if xendit_status == 'PAID' and payment.status != PaymentStatus.COMPLETED.value:
                payment.status = PaymentStatus.COMPLETED.value
                payment.payment_date = datetime.now()
                db.session.commit()
            elif xendit_status == 'EXPIRED' and payment.status != PaymentStatus.EXPIRED.value:
                payment.status = PaymentStatus.EXPIRED.value
                db.session.commit()
            
            return {
                "success": True,
                "payment_id": payment.id,
                "status": payment.status,
                "xendit_status": xendit_status
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Status check failed: {str(e)}"
            }

    def process_payment(self, user_id: int, data: Dict[str, Any]) -> Optional[Payment]:
        try:
            status = data.get('status', 'pending')
            payment = Payment(
                user_id=user_id,
                amount=data.get('amount'),
                currency=data.get('currency'),
                status=status,
                payment_method=data.get('payment_method'),
                transaction_id=data.get('transaction_id'),
                payment_date=datetime.now() if status == 'completed' else None
            )
            db.session.add(payment)
            db.session.commit()
            return payment
        except Exception:
            db.session.rollback()
            return None

    def serialize_payment(self, payment: Payment) -> Dict[str, Any]:
        return payment.to_dict()
