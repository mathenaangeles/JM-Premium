from flask import Flask
from flask_cors import CORS
from config import Configuration
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from models.base import db

migrate = Migrate()

def create_app():
    app = Flask(__name__)
   
    app.config.from_object(Configuration)
    CORS(app, supports_credentials=True, origins='*')
    
    JWTManager(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from routes.cart import cart_blueprint
    from routes.user import user_blueprint
    from routes.order import order_blueprint
    from routes.review import review_blueprint
    from routes.address import address_blueprint
    from routes.product import product_blueprint
    from routes.payment import payment_blueprint
    from routes.category import category_blueprint

    app.register_blueprint(cart_blueprint)
    app.register_blueprint(user_blueprint)
    app.register_blueprint(order_blueprint)
    app.register_blueprint(review_blueprint)
    app.register_blueprint(address_blueprint)
    app.register_blueprint(product_blueprint)
    app.register_blueprint(payment_blueprint)
    app.register_blueprint(category_blueprint)

    return app