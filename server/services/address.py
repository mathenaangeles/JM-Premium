from typing import Dict, Optional, Any, List

from app import db
from models.address import Address

class AddressService:
    def get_address_by_id(self, address_id: int) -> Optional[Address]:
        return db.session.get(Address, address_id)
    
    def get_user_addresses(self, user_id: int) -> List[Address]:
        return db.session.query(Address).filter(Address.user_id == user_id).all()
    
    def create_address(self, data: Dict[str, Any], user_id: Optional[int] = None) -> Address:
        address = Address(
            user_id=user_id,
            type=data.get('type'),
            line_1=data.get('line_1'),
            line_2=data.get('line_2'),
            city=data.get('city'),
            zip_code=data.get('zip_code'),
            country=data.get('country'),
        )
        db.session.add(address)
        db.session.commit()
        return address
    
    def update_address(self, address_id: int, data: Dict[str, Any]) -> Optional[Address]:
        address = self.get_address_by_id(address_id)
        if not address:
            return None 
        for field in ['type', 'line_1', 'line_2', 'city', 'zip_code', 'country']:
            if field in data:
                setattr(address, field, data[field])
        db.session.commit()
        return address
    
    def delete_address(self, address_id: int) -> None:
        address = self.get_address_by_id(address_id)
        if address:
            db.session.delete(address)
            db.session.commit()
    
    def serialize_address(self, address: Address) -> Dict[str, Any]:
        return address.to_dict()