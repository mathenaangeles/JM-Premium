from typing import  List, Optional, Dict, Any
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, TimestampMixin

class Category(Base, TimestampMixin):
    __tablename__ = "categories"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    parent_category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) 

    products: Mapped[List["Product"]] = relationship(back_populates="category")
    subcategories: Mapped[List["Category"]] = relationship(back_populates="parent_category")
    parent_category: Mapped[Optional["Category"]] = relationship(back_populates="subcategories", remote_side=[id])

    def __repr__(self) -> str:
        return f'<Category {self.name}>'
    
    def to_dict(self, include_subcategories=False) -> Dict[str, Any]:
        data = {
            'id': self.id,
            'parent_category_id': self.parent_category_id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
        }
        if include_subcategories:
            subcategories = self.subcategories if self.subcategories is not None else []
            data['subcategories'] = [subcategory.to_dict(True) for subcategory in subcategories]
        return data
