from sqlalchemy import String, Boolean
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

from models.base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(255))
    last_name: Mapped[Optional[str]] = mapped_column(String(255))
    country_code: Mapped[Optional[str]] = mapped_column(String(5))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    addresses: Mapped[List["Address"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship(back_populates="user")
    cart: Mapped[Optional["Cart"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship(back_populates="user")
    
    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self) -> str:
        return f'<User {self.email}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'country_code': self.country_code,
            'phone_number': self.phone_number,
            'is_admin': self.is_admin,
            "addresses": [address.to_dict() for address in self.addresses],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

