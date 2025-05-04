from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple

from app import db
from models.payment import Payment

class PaymentService:
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
    
    def process_payment(self, user_id: int, data: Dict[str, Any]) -> Optional[Payment]: # TO DO: Integrate with a payment processor (i.e., Stripe, etc.)
        try:
            status = data.get('status', 'pending')
            payment = Payment(
                user_id=user_id,
                amount=data.get('amount'),
                currency=data.get('currency'),
                status=status,
                payment_method=data.get('payment_method'),
                transaction_id=data.get('transaction_id'),
                payment_date=datetime.now() if status=='completed' else None
            )
            db.session.add(payment)
            db.session.commit()
            return payment
        except Exception as e:
            db.session.rollback()
            return None
    
    def serialize_payment(self, payment: Payment) -> Dict[str, Any]:
        return payment.to_dict()