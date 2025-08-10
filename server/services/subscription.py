from typing import Dict, List, Optional, Any

from app import db
from models.subscription import Subscription

class SubscriptionService:    
    def subscribe(self, email: str) -> Subscription:
        try:
            email = email.lower().strip()
            existing_subscription = db.session.query(Subscription).filter(Subscription.email == email).first()
            if existing_subscription:
                if existing_subscription.is_active:
                    return None
                else:
                    existing_subscription.is_active = True
                    db.session.commit()
                    return existing_subscription
            subscription = Subscription(email=email)
            db.session.add(subscription)
            db.session.commit()
            db.session.refresh(subscription)
            return subscription
        except Exception as e:
            db.session.rollback()
            return None

    def unsubscribe(self, email: str) -> Subscription:
        try:
            email = email.lower().strip()
            subscription = db.session.query(Subscription).filter(Subscription.email == email).first()
            if not subscription:
                return None
            subscription.is_active = False
            db.session.commit()
            return subscription
        except Exception as e:
            db.session.rollback()
            return None

    def get_subscription_by_email(self, email: str) -> Optional[Subscription]:
        email = email.lower().strip()
        return db.session.query(Subscription).filter(Subscription.email == email).first()

    def get_all_subscriptions(self) -> List[Subscription]:
        return db.session.query(Subscription).filter(Subscription.is_active == True).all()

    def delete_subscription(self, email: str) -> bool:
        try:
            email = email.lower().strip()
            subscription = self.get_subscription_by_email(email)
            if not subscription:
                return False
            db.session.delete(subscription)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    def serialize_subscription(self, subscription: Subscription) -> Dict[str, Any]:
        return subscription.to_dict()
    