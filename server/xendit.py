import base64
import requests
from enum import Enum
from flask import current_app
from typing import Dict, Optional
from dataclasses import dataclass

class PaymentMethod(Enum):
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    EWALLET = "EWALLET"
    RETAIL_OUTLET = "RETAIL_OUTLET"
    QR_CODE = "QR_CODE"

class EWalletType(Enum):
    GCASH = "GCASH"
    PAYMAYA = "PAYMAYA"
    GRABPAY = "GRABPAY"
    SHOPEEPAY = "SHOPEEPAY"

class PaymentStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PAID = "paid"
    FAILED = "failed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

@dataclass
class XenditConfig:
    api_key: str
    webhook_token: str
    base_url: str = "https://api.xendit.co"

    @classmethod
    def from_flask_config(cls, config):
        return cls(
            api_key=config["XENDIT_API_KEY"],
            webhook_token=config["XENDIT_WEBHOOK_TOKEN"],
            base_url=config.get("XENDIT_BASE_URL", "https://api.xendit.co")
        )

    @classmethod
    def from_current_app(cls):
        return cls.from_flask_config(current_app.config)


class XenditError(Exception):
    def __init__(self, message: str, code: Optional[str] = None, status_code: Optional[int] = None):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)


class XenditClient:
    def __init__(self, secret_key: str, webhook_token: Optional[str] = None, base_url: str = "https://api.xendit.co"):
        self.config = XenditConfig(
            api_key=secret_key,
            webhook_token=webhook_token or "",
            base_url=base_url
        )
        self.timeout = 30
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Basic {self._encode_api_key()}',
            'api-version': '2024-11-11'
        }

    def _encode_api_key(self) -> str:
        credentials = f"{self.config.api_key}:"
        return base64.b64encode(credentials.encode()).decode()

    def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
        url = f"{self.config.base_url}{endpoint}"
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                timeout=self.timeout
            )
            if response.status_code >= 400:
                error_data = response.json() if response.content else {}
                raise XenditError(
                    message=error_data.get('message', 'Unknown Error'),
                    code=error_data.get('error_code'),
                    status_code=response.status_code
                )
            return response.json()
        except requests.exceptions.RequestException as e:
            raise XenditError(f"Request Failed: {str(e)}")
        
    def create_payment_session(self, session_data: Dict) -> Dict:
        return self._make_request('POST', '/sessions', session_data)

    def get_payment_session(self, payment_session_id: str) -> Dict:
        return self._make_request('GET', f'/sessions/{payment_session_id}')

    def create_payment_request(self, payment_data: Dict) -> Dict:
        return self._make_request('POST', '/v3/payment_requests', payment_data)

    def get_payment_request(self, payment_request_id: str) -> Dict:
        return self._make_request('GET', f'/v3/payment_requests/{payment_request_id}')
