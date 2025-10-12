from datetime import datetime
from flask import Blueprint, Response

from app import db
from models.product import Product
from models.category import Category

seo_blueprint = Blueprint('seo', __name__)

@seo_blueprint.route('/robots.txt')
def robots_txt():
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Sitemap: https://jmpremium.shop/sitemap.xml\n"
    )
    return Response(content, mimetype='text/plain')

@seo_blueprint.route('/sitemap.xml')
def sitemap():
    pages = []

    static_urls = [
        '/',
        '/shop',
        '/privacy-policy',
        '/terms-of-service'
    ]
    today = datetime.utcnow().date().isoformat()
    for path in static_urls:
        pages.append({'loc': f'https://jmpremium.shop{path}', 'lastmod': today})

    products = db.session.query(Product).filter(Product.is_active == True).all()
    for product in products:
        pages.append({
            'loc': f'https://jmpremium.shop/products/{product.slug}',
            'lastmod': (product.updated_at or product.created_at).date().isoformat()
        })

    categories = db.session.query(Category).all()
    for category in categories:
        pages.append({
            'loc': f'https://jmpremium.shop/categories/{category.slug}',
            'lastmod': today
        })

    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for page in pages:
        xml.append(
            f"<url><loc>{page['loc']}</loc><lastmod>{page['lastmod']}</lastmod></url>"
        )
    xml.append('</urlset>')

    return Response('\n'.join(xml), mimetype='application/xml')
