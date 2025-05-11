from typing import List, Optional, Dict, Any
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from sqlalchemy import ForeignKey, String, Text, Boolean, Numeric, Integer, func, select, case, UniqueConstraint

from models.base import Base, TimestampMixin

class Product(Base, TimestampMixin):
    __tablename__ = "products"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    benefits: Mapped[Optional[str]] = mapped_column(Text)
    ingredients: Mapped[Optional[str]] = mapped_column(Text)
    instructions: Mapped[Optional[str]] = mapped_column(Text)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    meta_title: Mapped[Optional[str]] = mapped_column(String(255))
    meta_description: Mapped[Optional[str]] = mapped_column(Text)

    weight: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0)
    width: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0) 
    height: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0)
    length: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0) 

    option1_name: Mapped[Optional[str]] = mapped_column(String(255))
    option2_name: Mapped[Optional[str]] = mapped_column(String(255))
    option3_name: Mapped[Optional[str]] = mapped_column(String(255))

    base_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0)
    sale_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), default=0)
    stock: Mapped[Optional[int]] = mapped_column(Integer, default=0)

    category: Mapped["Category"] = relationship(back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship(back_populates="product", cascade="all, delete-orphan")
        
    @hybrid_property
    def average_rating(self) -> float:
        return sum(review.rating for review in self.reviews) / len(self.reviews) if self.reviews else 0
    
    @average_rating.expression
    def average_rating(cls):
        return (
            select(func.coalesce(func.avg(Review.rating), 0))
            .where(Review.product_id == cls.id)
            .correlate(cls)
            .scalar_subquery()
        )
    
    @hybrid_property
    def total_stock(self) -> int:
        if self.variants:
            return sum(variant.stock for variant in self.variants)
        return self.stock or 0
    
    @total_stock.expression
    def total_stock(cls):
        return case(
            [
                (
                    select(func.count(ProductVariant.id))
                    .where(ProductVariant.product_id == cls.id)
                    .correlate(cls)
                    .scalar_subquery() > 0,
                    select(func.coalesce(func.sum(ProductVariant.stock), 0))
                    .where(ProductVariant.product_id == cls.id)
                    .correlate(cls)
                    .scalar_subquery()
                )
            ],
            else_=func.coalesce(cls.stock, 0)
        )
        
    @hybrid_property
    def display_price(self) -> float:
        if self.variants:
            return self.variants[0].price
        if self.sale_price > 0:
            return self.sale_price 
        return self.base_price or 0

    @display_price.expression
    def display_price(cls):
        lowest_variant_price = (
            select(func.min(
                func.coalesce(ProductVariant.sale_price, ProductVariant.base_price)
            ))
            .where(ProductVariant.product_id == cls.id)
            .correlate(cls)
            .scalar_subquery()
        )
        return case(
            [
                (
                    select(func.count(ProductVariant.id))
                    .where(ProductVariant.product_id == cls.id)
                    .correlate(cls)
                    .scalar_subquery() > 0,
                    lowest_variant_price
                )
            ],
            else_=func.coalesce(cls.sale_price, cls.base_price, 0)
        )
    
    def get_product_options(self) -> Dict[str, List[str]]:
        options = {}
        for i in range(1, 4):
            option_name = getattr(self, f'option{i}_name')
            if option_name:
                values = set()
                for variant in self.variants:
                    value = getattr(variant, f'option{i}_value')
                    if value:
                        values.add(value)
                options[option_name] = sorted(list(values))
        return options

    def find_variant_by_options(self, option_values: Dict[str, str]) -> Optional["ProductVariant"]:
        option_positions = {}
        for i in range(1, 4):
            option_name = getattr(self, f'option{i}_name')
            if option_name:
                option_positions[option_name] = i
        required_matches = set()
        for option_name, option_value in option_values.items():
            if option_name in option_positions:
                position = option_positions[option_name]
                required_matches.add((position, option_value))
        for variant in self.variants:
            variant_options = set()
            for pos in range(1, 4):
                value = getattr(variant, f'option{pos}_value')
                if value:
                    variant_options.add((pos, value))
            if required_matches.issubset(variant_options):
                return variant
        return None
    
    def __repr__(self) -> str:
        return f'<Product {self.name}>'
    
    def to_dict(self, include_variants=True, include_images=True, include_reviews=True) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "benefits": self.benefits,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
            "is_active": self.is_active,
            "is_featured": self.is_featured,
            "meta_title": self.meta_title,
            "meta_description": self.meta_description,
            "weight": float(self.weight) if self.weight else None,
            "dimensions": {
                "width": float(self.width) if self.width else None,
                "height": float(self.height) if self.height else None,
                "length": float(self.length) if self.length else None,
            } if self.width or self.height or self.length else None,
            "option1_name": self.option1_name,
            "option2_name": self.option2_name,
            "option3_name": self.option3_name,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None,
            "category_slug": self.category.slug if self.category else None,
            "average_rating": self.average_rating,
            "total_stock": float(self.total_stock),
            "display_price": float(self.display_price),
            "base_price": float(self.base_price),
            "sale_price": float(self.sale_price),
            "stock": float(self.stock),
            "variants": [variant.to_dict() for variant in self.variants] if include_variants else None,
            "images": [img.to_dict() for img in self.images] if include_images else None,
            "reviews": [review.to_dict() for review in self.reviews] if include_reviews else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class ProductVariant(Base, TimestampMixin):
    __tablename__ = "product_variants"
    __table_args__ = (
        UniqueConstraint('product_id', 'option1_value', 'option2_value', 'option3_value', 
                        name='uq_product_variant_options'),
    )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    sale_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)    

    option1_value: Mapped[Optional[str]] = mapped_column(String(255))
    option2_value: Mapped[Optional[str]] = mapped_column(String(255))
    option3_value: Mapped[Optional[str]] = mapped_column(String(255))

    product: Mapped["Product"] = relationship(back_populates="variants")
    images: Mapped[List["ProductImage"]] = relationship(back_populates="variant", cascade="all, delete-orphan")

    @hybrid_property
    def price(self) -> float:
        return self.sale_price if self.sale_price else self.base_price
    
    @price.expression
    def price(cls):
        return case(
            (cls.sale_price != None, cls.sale_price),
            else_=cls.base_price
        )

    @validates('sale_price')
    def validate_sale_price(self, key, sale_price):
        if sale_price is not None and hasattr(self, 'base_price') and self.base_price is not None:
            if sale_price >= self.base_price:
                raise ValueError("Sale price must be less than the base price.")
        return sale_price
    
    @validates('stock')
    def validate_stock(self, key, stock):
        if stock < 0:
            raise ValueError("Stock cannot be negative.")
        return stock
    
    def __repr__(self) -> str:
        return f'<ProductVariant {self.name}>'
    
    def to_dict(self, include_images=True) -> Dict[str, Any]:
        return {
            "id": self.id,
            "product_id": self.product_id,
            "name": self.name,
            "base_price": float(self.base_price),
            "sale_price": float(self.sale_price) if self.sale_price else None,
            "stock": self.stock,
            "price": self.price,
            "option1_value": self.option1_value,
            "option2_value": self.option2_value,
            "option3_value": self.option3_value,
            "images": [img.to_dict() for img in self.images] if include_images else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
    
class ProductImage(Base, TimestampMixin):
    __tablename__ = "product_images"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    variant_id: Mapped[Optional[int]] = mapped_column(ForeignKey("product_variants.id"))

    url: Mapped[str] = mapped_column(String(255), nullable=False)

    product: Mapped["Product"] = relationship(back_populates="images")
    variant: Mapped[Optional["ProductVariant"]] = relationship(back_populates="images")
    
    def __repr__(self) -> str:
        return f'<ProductImage {self.url}>'
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "product_id": self.product_id,
            "variant_id": self.variant_id,
            "url": self.url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
