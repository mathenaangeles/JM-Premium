import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Configuration(object):
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
    SQLALCHEMY_ECHO = os.getenv('SQLALCHEMY_ECHO')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG')
    FLASK_ENV = os.getenv('FLASK_ENV')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE')
    JWT_ACCESS_COOKIE_NAME = os.getenv('JWT_ACCESS_COOKIE_NAME')
    JWT_REFRESH_COOKIE_NAME = os.getenv('JWT_REFRESH_COOKIE_NAME')
    JWT_COOKIE_CSRF_PROTECT = os.getenv('JWT_COOKIE_CSRF_PROTECT')
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    XENDIT_API_KEY = os.getenv("XENDIT_API_KEY")
    XENDIT_WEBHOOK_TOKEN = os.getenv("XENDIT_WEBHOOK_TOKEN")
    XENDIT_BASE_URL = os.getenv("XENDIT_BASE_URL", "https://api.xendit.co")
    NINJAVAN_BASE_URL = os.getenv("NINJAVAN_BASE_URL")
    NINJAVAN_CLIENT_ID = os.getenv("NINJAVAN_CLIENT_ID")
    NINJAVAN_CLIENT_SECRET = os.getenv("NINJAVAN_CLIENT_SECRET")
    NINJAVAN_WEBHOOK_SECRET = os.getenv("NINJAVAN_WEBHOOK_SECRET")
    