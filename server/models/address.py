from typing import Optional, Dict, Any
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin

class Address(Base, TimestampMixin):
    __tablename__ = "addresses"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    type: Mapped[str] = mapped_column(String(255), default='shipping', nullable=False)
    line_1: Mapped[str] = mapped_column(String(255), nullable=False)
    line_2: Mapped[Optional[str]] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(255), nullable=False) 
    zip_code: Mapped[str] = mapped_column(String(20), nullable=False) 
    country: Mapped[str] = mapped_column(String(56), nullable=False)

    user: Mapped["User"] = relationship(back_populates="addresses")

    def __repr__(self) -> str:
        return f'<Address {self.id}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'type': self.type,
            'line_1': self.line_1,
            'line_2': self.line_2,
            'city': self.city,
            'zip_code': self.zip_code,
            'country': self.country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }