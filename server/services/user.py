from sqlalchemy import or_
from typing import Dict, Optional, Any, List

from app import db
from models.user import User

class UserService:
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return db.session.get(User, user_id)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        return db.session.query(User).filter(User.email == email).first()
    
    def get_all_users(self, page: int = 1, per_page: int = 10, filters: Optional[Dict[str, Any]] = None, search: Optional[str] = None) -> List[User]:
        user_query = db.session.query(User)
        if filters:
            for key, value in filters.items():
                if hasattr(User, key):
                    user_query = user_query.filter(getattr(User, key) == value)
        if search:
            search_term = f"%{search}%"
            user_query = user_query.filter(
                or_(
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term),
                    User.email.ilike(search_term),
                )
            )
        count = user_query.count()
        total_pages = (count + per_page - 1) // per_page
        users = user_query.order_by(User.id).offset((page - 1) * per_page).limit(per_page).all()
        return users, count, total_pages
    
    def create_user(self, email: str, password: str, **kwargs) -> User:
        user = User(email=email, **kwargs)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user
    
    def update_user(self, user_id: int, data: Dict[str, Any]) -> Optional[User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None 
        for field in ['first_name', 'last_name', 'country_code', 'phone_number']:
            if field in data:
                setattr(user, field, data[field])
        db.session.commit()
        return user
    
    def update_password(self, user_id: int, new_password: str) -> Optional[User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None 
        user.set_password(new_password)
        db.session.commit()
        return user
    
    def update_is_admin(self, user_id: int, is_admin: bool) -> Optional[User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None 
        user.is_admin = is_admin
        db.session.commit()
        return user
    
    def delete_user(self, user_id: int) -> None:
        user = self.get_user_by_id(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()

    def serialize_user(self, user: User) -> Dict[str, Any]:
        return user.to_dict()