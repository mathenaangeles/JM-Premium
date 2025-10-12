from sqlalchemy import or_, asc, desc
from typing import Dict, List, Optional, Any, Tuple

from app import db
from models.product import Product, ProductVariant, ProductImage
from utils import generate_slug, generate_variant_name, upload_image_to_gcs, delete_image_from_gcs

class ProductService:
    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        return db.session.get(Product, product_id)
    
    def get_product_by_slug(self, slug: str) -> Optional[Product]:
        return db.session.query(Product).filter(Product.slug == slug).first()
    
    def get_all_products(self, page: int = 1, per_page: int = 10, category_ids: Optional[List[int]] = [], filters: Optional[Dict[str, Any]] = None, search: Optional[str] = None, sort: Optional[str] = None) -> Tuple[List[Product], int, int]:
        product_query = db.session.query(Product)
        if len(category_ids) > 0:
            product_query = product_query.filter(Product.category_id.in_(category_ids))
        if filters:
            for key, value in filters.items():
                if hasattr(Product, key) and key != 'category_id':
                    product_query = product_query.filter(getattr(Product, key) == value)
        if search:
            search_term = f"%{search}%"
            product_query = product_query.filter(
                or_(
                    Product.name.ilike(search_term),
                )
            )
        if sort == 'price_low':
            product_query = product_query.order_by(asc(Product.display_price))
        elif sort == 'price_high':
            product_query = product_query.order_by(desc(Product.display_price))
        elif sort == 'oldest':
            product_query = product_query.order_by(asc(Product.created_at))
        else:
            product_query = product_query.order_by(desc(Product.created_at))
        count = product_query.count()
        total_pages = (count + per_page - 1) // per_page
        products = product_query.offset((page - 1) * per_page).limit(per_page).all()
        return products, count, total_pages
    
    def create_product(self, data: Dict[str, Any]) -> Product:
        try:
            product = Product(
                name=data.get('name'),
                slug=generate_slug(data.get('name')),
                category_id=data.get('category_id'),
                description=data.get('description'),
                benefits=data.get('benefits'),
                ingredients=data.get('ingredients'),
                instructions=data.get('instructions'),
                is_active=data.get('is_active', False),
                is_featured=data.get('is_featured', False),
                meta_title=data.get('meta_title'),
                meta_description=data.get('meta_description'),
                weight=data.get('weight'),
                width=data.get('width'),
                height=data.get('height'),
                length=data.get('length'),
                option1_name=data.get('option1_name'),
                option2_name=data.get('option2_name'),
                option3_name=data.get('option3_name'),
                base_price=data.get('base_price'),
                sale_price=data.get('sale_price'),
                stock=data.get('stock'),
            )
            db.session.add(product)
            db.session.commit()
            if 'variants' in data and isinstance(data['variants'], list):
                for variant_data in data['variants']:
                    self.create_product_variant(product.id, variant_data)
            if 'images' in data and isinstance(data['images'], list):
                for image_data in data['images']:
                    self.create_product_image(product.id, image_data)
            db.session.refresh(product)
            return product
        except Exception as e:
            db.session.rollback()
            raise e
        
    def update_product(self, product_id: int, data: Dict[str, Any]) -> Optional[Product]:
        product = self.get_product_by_id(product_id)
        if not product:
            return None
        try:
            for field in ['name', 'description', 'benefits', 'ingredients', 'instructions', 'category_id', 'is_active', 'is_featured', 'meta_title', 'meta_description', 'weight', 'width', 'height', 'length', 'option1_name', 'option2_name', 'option3_name', 'base_price', 'sale_price', 'stock']:
                if field in data:
                    setattr(product, field, data[field])
            if 'name' in data:
                product.slug = generate_slug(product.name)
                for variant in product.variants:
                    variant.name = generate_variant_name(
                        product.name, 
                        variant.option1_value, 
                        variant.option2_value, 
                        variant.option3_value
                    )
            db.session.commit()
            return product
        except Exception as e:
            db.session.rollback()
            raise e
    
    def delete_product(self, product_id: int) -> bool:
        product = self.get_product_by_id(product_id)
        if not product:
            return False
        try:
            db.session.delete(product)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    def serialize_product(self, product: Product) -> Dict[str, Any]:
        return product.to_dict()
    
    def get_product_variant_by_id(self, variant_id: int) -> Optional[ProductVariant]:
        return db.session.get(ProductVariant, variant_id)
    
    def create_product_variant(self, product_id: int, data: Dict[str, Any]) -> Optional[ProductVariant]:
        product = self.get_product_by_id(product_id)
        if not product:
            return None
        try:
            option1_value = data.get('option1_value')
            option2_value = data.get('option2_value')
            option3_value = data.get('option3_value')
            variant_name = data.get('name')
            if not variant_name:
                variant_name = generate_variant_name(product.name, option1_value, option2_value, option3_value)
            variant = ProductVariant(
                product_id=product_id,
                name=variant_name,
                base_price=data.get('base_price'),
                sale_price=data.get('sale_price'),
                stock=data.get('stock', 0),
                option1_value=option1_value,
                option2_value=option2_value,
                option3_value=option3_value
            )
            db.session.add(variant)
            db.session.commit()
            return variant
        except Exception as e:
            db.session.rollback()
            raise e
    
    def update_product_variant(self, variant_id: int, data: Dict[str, Any]) -> Optional[ProductVariant]:
        variant = self.get_product_variant_by_id(variant_id)
        if not variant:
            return None
        try:
            for field in ['base_price', 'sale_price', 'stock']:
                if field in data:
                    setattr(variant, field, data[field])
            option_changed = False
            for field in ['option1_value', 'option2_value', 'option3_value']:
                if field in data:
                    old_value = getattr(variant, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(variant, field, new_value)
                        option_changed = True
            product = variant.product
            if 'name' in data:
                variant.name = data['name']
            elif option_changed:
                variant.name = self._generate_variant_name(
                    product.name, 
                    variant.option1_value, 
                    variant.option2_value, 
                    variant.option3_value
                )
            db.session.commit()
            return variant
        except Exception as e:
            db.session.rollback()
            raise e
    
    def delete_product_variant(self, variant_id: int) -> bool:
        variant = self.get_product_variant_by_id(variant_id)
        if not variant:
            return False
        try:
            variant_count = db.session.query(ProductVariant).filter(
                ProductVariant.product_id == variant.product_id
            ).count()
            if variant_count <= 1:
                return False
            db.session.delete(variant)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    def serialize_product_variant(self, variant: ProductVariant) -> Dict[str, Any]:
        return variant.to_dict()

    def get_recommended_products(self, product_id: int, limit: int = 4) -> List[Product]:
        product = self.get_product_by_id(product_id)
        if not product:
            return []
        try:
            recommended = db.session.query(Product).filter(
                Product.category_id == product.category_id,
                Product.id != product_id,
                Product.is_active == True
            ).order_by(desc(Product.average_rating)).limit(limit).all()
            if len(recommended) < limit:
                additional = db.session.query(Product).filter(
                    Product.id != product_id,
                    Product.is_active == True,
                    Product.id.notin_([p.id for p in recommended])
                ).order_by(desc(Product.average_rating)).limit(limit - len(recommended)).all()
                recommended.extend(additional)
            return recommended
        except Exception as e:
            print(e)
            return []
    
    def get_product_image_by_id(self, image_id: int) -> Optional[ProductImage]:
        return db.session.get(ProductImage, image_id)
    
    def create_product_image(self, product_id: int, data: Dict[str, Any], variant_id: Optional[int] = None) -> Optional[ProductImage]:
        try:
            if 'file' in data:
                image_url = upload_image_to_gcs(data['file'], folder="products")
            else:
                raise ValueError("No Image Provided")
            image = ProductImage(
                product_id=product_id,
                variant_id=variant_id,
                url=image_url,
            )
            db.session.add(image)
            db.session.commit()
            return image
        except Exception as e:
            db.session.rollback()
            raise e
    
    def delete_product_image(self, image_id: int) -> bool:
        image = self.get_product_image_by_id(image_id)
        if not image:
            return False
        try:
            delete_image_from_gcs(image.url)
            db.session.delete(image)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    def serialize_product_image(self, image: ProductImage) -> Dict[str, Any]:
        return image.to_dict()    
   