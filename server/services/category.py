from sqlalchemy.orm import joinedload
from typing import Dict, List, Optional, Any

from app import db
from utils import generate_slug
from models.category import Category

class CategoryService:
    def get_category_by_id(self, category_id: int) -> Optional[Category]:
        return db.session.get(Category, category_id)
    
    def get_category_by_slug(self, slug: str) -> Optional[Category]:
        return db.session.query(Category).filter(Category.slug == slug).first()
    
    def get_category_with_subcategories(self, category_id: int) -> Optional[Dict[str, Any]]:
        category = self.get_category_by_id(category_id)
        if not category:
            return None
        return self.serialize_category_tree(category)

    def get_all_categories(self, filters: Optional[Dict[str, Any]] = None) -> List[Category]:
        category_query = db.session.query(Category).options(
            joinedload(Category.subcategories)
        )
        if filters:
            for key, value in filters.items():
                if hasattr(Category, key):
                    column_attr = getattr(Category, key)
                    if value is None:
                        category_query = category_query.filter(column_attr.is_(None))
                    else:
                        category_query = category_query.filter(column_attr == value)
        return category_query.all()
    
    def get_category_tree(self) -> List[Dict[str, Any]]:
        parent_categories = self.get_all_categories(filters={"parent_category_id": None})
        return [self.serialize_category_tree(category) for category in parent_categories]
    
    def create_category(self, data: Dict[str, Any]) -> Category:
        category = Category(
            name=data.get('name'),
            slug=generate_slug(data.get('name')),
            description=data.get('description'),
            parent_category_id=data.get('parent_category_id')
        )
        db.session.add(category)
        db.session.commit()
        return category
    
    def update_category(self, category_id: int, data: Dict[str, Any]) -> Optional[Category]:
        category = self.get_category_by_id(category_id)
        if not category:
            return None
        for field in ['name', 'description', 'parent_category_id']:
            if field in data:
                if field == 'parent_category_id' and data[field] == category_id:
                    continue
                setattr(category, field, data[field])
        if 'name' in data:
            category.slug = generate_slug(data['name'])
        db.session.commit()
        return category
    
    def delete_category(self, category_id: int) -> bool:
        category = self.get_category_by_id(category_id)
        if not category:
            return False
        if category.subcategories:
            for subcategory in category.subcategories:
                subcategory.parent_category_id = category.parent_category_id
        db.session.flush()
        db.session.delete(category)
        db.session.commit()
        return True
    
    def serialize_category(self, category: Category) -> Dict[str, Any]:
        return category.to_dict(include_subcategories=False)
    
    def serialize_category_tree(self, category: Category) -> Dict[str, Any]:
        return category.to_dict(include_subcategories=True)
    
    def get_category_breadcrumbs(self, category_id: int) -> List[Dict[str, Any]]:
        category = self.get_category_by_id(category_id)
        if not category:
            return []
        breadcrumbs = []
        current = category
        while current:
            breadcrumbs.insert(0, {
                'id': current.id,
                'name': current.name,
                'slug': current.slug
            })
            if current.parent_category_id:
                current = self.get_category_by_id(current.parent_category_id)
            else:
                current = None
        return breadcrumbs