import base64
import requests
from enum import Enum
from typing import Dict
from flask import current_app
from dataclasses import dataclass

class PaymentMethod(Enum):
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    EWALLET = "EWALLET"
    RETAIL_OUTLET = "RETAIL_OUTLET"
    QR_CODE = "QR_CODE"


class PaymentStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PAID = "paid"
    FAILED = "failed"
    EXPIRED = "expired"


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
    def __init__(self, message: str, code: str = None, status_code: int = None):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)


class XenditClient:
    def __init__(self, config: XenditConfig):
        self.config = config
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Basic {self._encode_api_key()}'
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
                timeout=30
            )

            if response.status_code >= 400:
                error_data = response.json() if response.content else {}
                raise XenditError(
                    message=error_data.get('message', 'Unknown error'),
                    code=error_data.get('error_code'),
                    status_code=response.status_code
                )

            return response.json()

        except requests.exceptions.RequestException as e:
            raise XenditError(f"Request failed: {str(e)}")

    def create_invoice(self, invoice_data: Dict) -> Dict:
        return self._make_request('POST', '/v2/invoices', invoice_data)

    def get_invoice(self, invoice_id: str) -> Dict:
        return self._make_request('GET', f'/v2/invoices/{invoice_id}')

    def create_payment_request(self, payment_data: Dict) -> Dict:
        return self._make_request('POST', '/payment_requests', payment_data)

    def get_payment_request(self, payment_request_id: str) -> Dict:
        return self._make_request('GET', f'/payment_requests/{payment_request_id}')

    def create_virtual_account(self, va_data: Dict) -> Dict:
        return self._make_request('POST', '/callback_virtual_accounts', va_data)
