import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

def str_to_bool(value):
    return str(value).lower() in ("true", "1", "yes")

class Configuration(object):
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = str_to_bool(os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', "false"))
    SQLALCHEMY_ECHO = str_to_bool(os.getenv('SQLALCHEMY_ECHO', "false"))
    FLASK_DEBUG = str_to_bool(os.getenv('FLASK_DEBUG', "false"))
    FLASK_ENV = os.getenv('FLASK_ENV', "production")

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = str_to_bool(os.getenv('JWT_COOKIE_SECURE', "false"))
    JWT_ACCESS_COOKIE_NAME = os.getenv('JWT_ACCESS_COOKIE_NAME', "access_token_cookie")
    JWT_REFRESH_COOKIE_NAME = os.getenv('JWT_REFRESH_COOKIE_NAME', "refresh_token_cookie")
    JWT_COOKIE_SAMESITE = os.getenv('JWT_COOKIE_SAMESITE', "Lax")
    JWT_COOKIE_DOMAIN = os.getenv('JWT_COOKIE_DOMAIN', None)
    JWT_COOKIE_CSRF_PROTECT = str_to_bool(os.getenv('JWT_COOKIE_CSRF_PROTECT', "true"))
    JWT_CSRF_IN_COOKIES = str_to_bool(os.getenv('JWT_CSRF_IN_COOKIES', "true"))
    JWT_CSRF_CHECK_FORM = str_to_bool(os.getenv('JWT_CSRF_CHECK_FORM', "false"))
    JWT_CSRF_COOKIE_HTTPONLY = str_to_bool(os.getenv('JWT_CSRF_COOKIE_HTTPONLY', "false"))

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    XENDIT_API_KEY = os.getenv("XENDIT_API_KEY")
    XENDIT_WEBHOOK_TOKEN = os.getenv("XENDIT_WEBHOOK_TOKEN")
    XENDIT_BASE_URL = os.getenv("XENDIT_BASE_URL", "https://api.xendit.co")

    NINJAVAN_BASE_URL = os.getenv("NINJAVAN_BASE_URL")
    NINJAVAN_CLIENT_ID = os.getenv("NINJAVAN_CLIENT_ID")
    NINJAVAN_CLIENT_SECRET = os.getenv("NINJAVAN_CLIENT_SECRET")
    NINJAVAN_WEBHOOK_SECRET = os.getenv("NINJAVAN_WEBHOOK_SECRET")
