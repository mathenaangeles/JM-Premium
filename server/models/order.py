from typing import List, Optional, Dict, Any
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import ForeignKey, String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin

class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    shipping_address_id: Mapped[int] = mapped_column(ForeignKey("addresses.id"))
    billing_address_id: Mapped[Optional[int]] = mapped_column(ForeignKey("addresses.id"))
    payment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("payments.id")) 

    session_id: Mapped[Optional[str]] = mapped_column(String(255))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    first_name: Mapped[Optional[str]] = mapped_column(String(255))
    last_name: Mapped[Optional[str]] = mapped_column(String(255))
    country_code: Mapped[Optional[str]] = mapped_column(String(5))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))

    status: Mapped[str] = mapped_column(String(20), default='pending', nullable=False)
    shipping_method: Mapped[str] = mapped_column(String(20), default='standard', nullable=False)
    total: Mapped[float] = mapped_column(Numeric(10, 2), default=0, nullable=False)
    subtotal: Mapped[float] = mapped_column(Numeric(10, 2), default=0, nullable=False)
    tax: Mapped[float] = mapped_column(Numeric(10, 2), default=0, nullable=False)
    shipping_cost: Mapped[float] = mapped_column(Numeric(10, 2), default=0, nullable=False)
    discount: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0)
    tracking_number: Mapped[Optional[str]] = mapped_column(String(255))

    user: Mapped["User"] = relationship(back_populates="orders")
    shipping_address: Mapped["Address"] = relationship(foreign_keys=[shipping_address_id])
    billing_address: Mapped["Address"] = relationship(foreign_keys=[billing_address_id])
    payment: Mapped[Optional["Payment"]] = relationship()
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    def set_totals(self):
        self.subtotal = sum(item.subtotal for item in self.items)
        self.total = (self.subtotal + self.tax + self.shipping_cost - (self.discount or 0))
        
    def __repr__(self) -> str:
        return f'<Order {self.id}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "shipping_address_id": self.shipping_address_id,
            "billing_address_id": self.billing_address_id,
            "payment_id": self.payment_id,
            "status": self.status,
            "shipping_method": self.shipping_method,
            "total": float(self.total),
            "subtotal": float(self.subtotal),
            "tax": float(self.tax),
            "shipping_cost": float(self.shipping_cost),
            "discount": float(self.discount or 0),
            "tracking_number": self.tracking_number,
            "items": [item.to_dict() for item in self.items],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user": self.user.to_dict() if self.user else None,
            "shipping_address": self.shipping_address.to_dict() if self.shipping_address else None,
            "billing_address": self.billing_address.to_dict() if self.billing_address else None,
            "payment": self.payment.to_dict() if self.payment else None,
        }

class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"), nullable=True)

    quantity: Mapped[int] = mapped_column(Integer, default=1)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    
    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
    variant: Mapped["ProductVariant"] = relationship()
        
    @hybrid_property
    def subtotal(self) -> float:
        return self.price * self.quantity
    
    def __repr__(self) -> str:
        return f'<OrderItem {self.product.name} ({self.quantity})>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "variant_id": self.variant_id,
            "quantity": self.quantity,
            "price": float(self.price),
            "subtotal": float(self.subtotal),
            "product": self.product.to_dict() if self.product else None,
            "variant": self.variant.to_dict() if self.variant else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }