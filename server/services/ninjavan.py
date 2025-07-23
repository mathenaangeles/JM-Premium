import requests
from datetime import date
from typing import Dict, Any
from flask import current_app
from datetime import datetime, timedelta

class NinjaVanService:
    def __init__(self):
        self.base_url =  current_app.config.get("NINJAVAN_BASE_URL")
        self.client_id = current_app.config.get("NINJAVAN_CLIENT_ID")
        self.client_secret = current_app.config.get("NINJAVAN_CLIENT_SECRET")
        self.access_token = None
        self.token_expires_at = None
        
    def _get_access_token(self) -> str:
        if self.access_token and self.token_expires_at and datetime.now() < self.token_expires_at:
            return self.access_token
        url = f"{self.base_url}/2.0/oauth/access_token"
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            token_data = response.json()
            self.access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 3600)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in - 60)
            return self.access_token
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get access token: {str(e)}")
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None, stream: bool = False) -> Any:
        token = self._get_access_token()
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, params=params, stream=stream)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers)
            else:
                response = requests.request(method, url, headers=headers, json=data)
            response.raise_for_status()
            if stream:
                return response.content
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to raise a request: {str(e)}")
    
    def create_delivery_order(self, delivery_order: Dict[str, Any], **kwargs) -> Dict:
        order_id = kwargs.get("order_id")
        delivery_start_date = date.today().isoformat()
        shipment_data = {
            'service_type': 'Parcel',
            'service_level': delivery_order.get('service_level', 'Standard'),
            'requested_tracking_number': f"ORD-{order_id:06d}",
            'from': {
                "name": "JM Premium",
                "phone_number": "+60138201527",
                "email": "jmpremium.official@gmail.com",
                "address": {
                    "address1": "L3B2 Francisca Compound Road 23 Project 8",
                    "city": "Quezon City",
                    "state": "Metro Manila",
                    "country": "PH",
                    "postcode": "1106"
                }
            },
            'to': delivery_order.get('to', {}),
            'parcel_job': {
                "is_pickup_required": True,
                "delivery_start_date": delivery_start_date,
                "delivery_timeslot": {
                    "start_time": "09:00",
                    "end_time": "18:00",
                    "timezone": "Asia/Manila"
                },
                "dimensions": {
                    "weight": delivery_order.get('weight', 1),
                    "length": delivery_order.get('length', 5),
                    "width": delivery_order.get('width', 5),
                    "height": delivery_order.get('height', 5),
                },
            }
        }
        return self._make_request('POST', '/4.2/orders', shipment_data)
    
    def generate_waybill(self, tracking_number: str, hide_shipper_details: bool = True, orientation: str = "portrait") -> bytes:
        params = {
            "tid": tracking_number,
            "hide_shipper_details": str(hide_shipper_details).lower(),
            "orientation": orientation
        }
        return self._make_request('GET', '/2.0/reports/waybill', params=params, stream=True)

    def cancel_order(self, tracking_number: str) -> Dict[str, Any]:
        return self._make_request('DELETE', f'/2.2/orders/{tracking_number}')