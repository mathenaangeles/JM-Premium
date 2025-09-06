import uuid
from flask import current_app
from datetime import datetime, timezone
from typing import Dict, Optional, Any, Tuple, List

from app import db
from models.order import Order
from models.payment import Payment
from xendit import XenditClient, XenditError, PaymentStatus, PaymentMethod, EWalletType

class PaymentService:
    def __init__(self):
        self._xendit_client = None

    def _get_client(self):
        if self._xendit_client is None:
            self._xendit_client = XenditClient(
                secret_key = current_app.config.get("XENDIT_API_KEY"),
            )
        return self._xendit_client

    def _get_payment_method_config(self, payment_method: str, **kwargs) -> Tuple[str, Dict[str, Any]]:
        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        order_id = kwargs.get("order_id")
        return_url = f"{frontend_url}/orders/{order_id}"
        payment_method = payment_method.strip().upper()
        if payment_method == PaymentMethod.CREDIT_CARD.value:
            token_id = kwargs.get("token_id")
            payment_method_id = kwargs.get("payment_method_id")
            if not token_id and not payment_method_id:
                raise ValueError("Missing token_id or payment_method_id for credit card payment.")
            channel_code = "CARDS"
            channel_properties = {
                "success_return_url": return_url,
                "failure_return_url": return_url,
                "card": {
                    "token_id": token_id,
                    "is_multiple_use": False
                }
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
    
    def create_payment(self, amount: float, currency: str = "PHP", payment_method: str = "CARDS", user_id: Optional[int] = None, **kwargs) -> Dict[str, Any]:
        if payment_method.upper() == "CREDIT_CARD":
            return self.create_payment_session(amount, currency, user_id, **kwargs)
        else:
            return self.create_payment_request(amount, currency, payment_method, user_id, **kwargs)

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
            xendit_response = client.create_payment_request(payment_request_data)
            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=self._map_xendit_status_to_internal(xendit_response.get('status')),
                payment_method=payment_method,
                payment_date=None,
                reference_id=reference_id,
                xendit_id=xendit_response.get('payment_id'),
                payment_request_id=xendit_response.get('id'),
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
    
    def create_payment_session(
        self,
        amount: float,
        currency: str = "PHP",
        user_id: Optional[int] = None,
        **kwargs
    ) -> Dict[str, Any]:
        try:
            client = self._get_client()
            order_id = kwargs.get("order_id")
            frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
            return_url = f"{frontend_url}/orders/{order_id}"
            reference_id = f"session_{user_id or 'guest'}_{uuid.uuid4().hex[:8]}_{int(datetime.now().timestamp())}"
            session_data = {
                "reference_id": reference_id,
                "session_type": "PAY",
                "mode": "CARDS_SESSION_JS",
                "amount": int(amount),
                "currency": currency,
                "country": "PH",
                "customer": {
                    "reference_id": f"{user_id or 'guest'}_{uuid.uuid4().hex[:8]}",
                    "type": "INDIVIDUAL",
                    "email": kwargs.get("cardholder_email", ""),
                    "mobile_number": kwargs.get("cardholder_phone_number", "+63"),
                    "individual_detail": {
                        "given_names": kwargs.get("cardholder_first_name", "Guest"),
                        "surname": kwargs.get("cardholder_last_name", "User")
                    }
                },
                "cards_session_js": {
                    "success_return_url": 'https://4bf4b6a9f0ea.ngrok-free.app',
                    "failure_return_url": 'https://4bf4b6a9f0ea.ngrok-free.app',
                }
            }
            xendit_response = client.create_payment_session(session_data)
            payment = Payment(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status=PaymentStatus.PENDING.value,
                payment_method="CREDIT_CARD",
                payment_date=None,
                reference_id=reference_id,
                session_data=xendit_response,
                xendit_id=xendit_response.get('payment_id'), 
            )
            db.session.add(payment)
            db.session.commit()
            return {
                "success": True,
                "payment": payment,
                "session_response": xendit_response,
                "payment_session_id": xendit_response.get('payment_session_id')
            }
        except XenditError as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Xendit API Error: {str(e)}"
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Payment Session Creation Failed: {str(e)}"
            }
        
    def handle_payment_webhook(self, webhook_data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        try:
            expected_token = current_app.config.get("XENDIT_WEBHOOK_TOKEN")
            received_token = headers.get('x-callback-token') or headers.get("X-Callback-Token")
            if received_token != expected_token:
                return {"success": False, "error": "Invalid Webhook Token"}, 403
            event_type = webhook_data.get('event')
            data = webhook_data.get('data', {})
            print("WEBHOOK DATA:", webhook_data)
            if event_type.startswith("payment_session."):
                return self._handle_payment_session_webhook(data, event_type)
            elif event_type.startswith("payment."):
                return self._handle_payment_object_webhook(data, event_type)
            elif 'reference_id' in data and 'id' in data:
                return self._handle_payment_request_webhook(data, event_type)
            else:
                return {"success": False, "error": "Unknown Webhook Format", "status_code": 400}
        except Exception as e:
            db.session.rollback()
            return {"success": False, "error": str(e), "status_code": 500}

    def _handle_payment_session_webhook(self, data: Dict[str, Any], event_type: str) -> Dict[str, Any]:
        reference_id = data.get('reference_id')
        if not reference_id:
            return {"success": False, "error": "Missing reference_id in session webhook."}, 400
        payment = db.session.query(Payment).filter_by(reference_id=reference_id).first()
        if not payment:
            return {"success": False, "error": "Payment not found for session webhook."}, 404
        payment.session_data = data
        session_payment_id = data.get('payment_id')
        if session_payment_id and not payment.xendit_id:
            payment.xendit_id = session_payment_id
        db.session.commit()
        return {"success": True, "event_type": event_type, "status_code": 200}

    def _handle_payment_object_webhook(self, data: Dict[str, Any], event_type: str) -> Dict[str, Any]:
        payment_id = data.get('payment_id')
        reference_id = data.get('reference_id')
        payment_request_id = data.get('payment_request_id')
        payment = None
        if payment_id:
            payment = db.session.query(Payment).filter_by(xendit_id=payment_id).first()
        if not payment and payment_request_id:
            payment = db.session.query(Payment).filter_by(payment_request_id=payment_request_id).first()
        if not payment and reference_id:
            payment = db.session.query(Payment).filter_by(reference_id=reference_id).first()
        if not payment:
            return {"success": False, "error": "Payment not found for session webhook.", "status_code": 404}
        status = data.get('status')
        payment.status = self._map_xendit_status_to_internal(status)
        payment.payment_request_id = payment_request_id
        payment.payment_details = data.get('payment_details')
        if payment_id and not payment.xendit_id:
            payment.xendit_id = payment_id
        if payment_request_id and not payment.payment_request_id:
            payment.payment_request_id = payment_request_id
        if status == "SUCCEEDED":
            payment.payment_date = datetime.now(timezone.utc)
            order = db.session.query(Order).filter_by(payment_id=payment.id).first()
            if order:
                order.status = 'processing'
        db.session.commit()
        return {"success": True, "event_type": event_type, "status_code": 200}

    def _handle_payment_request_webhook(self, data: Dict[str, Any], event_type: str) -> Dict[str, Any]:
        reference_id = data.get('reference_id')
        payment_request_id = data.get('id')
        if not reference_id or not payment_request_id:
            return {"success": False, "error": "Missing payment reference or ID.", "status_code": 400}
        payment = db.session.query(Payment).filter_by(
            reference_id=reference_id, 
            payment_request_id=payment_request_id
        ).first()
        if not payment:
            return {"success": False, "error": "Payment not found for request webhook.", "status_code": 404}
        status = data.get('status')
        payment.status = self._map_xendit_status_to_internal(status)
        if status == "SUCCEEDED":
            payment.payment_date = datetime.now(timezone.utc)
        db.session.commit()
        return {"success": True, "event_type": event_type, "status_code": 200}
        
    def check_payment_status(self, payment_id: int) -> Dict[str, Any]:
        try:
            payment = self.get_payment_by_id(payment_id)
            if not payment:
                return {"success": False, "error": "Payment not found"}
            if not payment.xendit_id:
                return {"success": False, "error": "Missing Xendit payment ID"}
            if payment.payment_request_id:
                response = self._get_client().get_payment_request(payment.payment_request_id)
            elif payment.xendit_id:
                response = self._get_client().get_payment(payment.xendit_id)
            else:
                return {"success": False, "error": "Missing Xendit payment IDs."}
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
            "CANCELLED": PaymentStatus.CANCELLED.value
        }.get(xendit_status, PaymentStatus.PENDING.value)

    def serialize_payment(self, payment: Payment) -> Dict[str, Any]:
        return payment.to_dict()
