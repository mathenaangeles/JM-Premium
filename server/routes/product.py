from flask import Blueprint, request, jsonify

from services.product import ProductService
from middlewares.user import admin_required

product_blueprint = Blueprint('product', __name__, url_prefix='/products')
product_service = ProductService()

@product_blueprint.route('/', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', type=str)
    category_ids_str = request.args.get('category_ids', '')
    category_ids = [int(cid) for cid in category_ids_str.split(',') if cid.strip()] if category_ids_str else []
    is_featured = request.args.get('is_featured', type=bool)
    is_active = request.args.get('is_active', True, type=bool)
    filters = {'is_active': is_active}
    if is_featured is not None:
        filters['is_featured'] = is_featured
    try:
        products, count, total_pages = product_service.get_all_products(page, per_page, category_ids, filters, search)
        return jsonify({
            'products': [product_service.serialize_product(product) for product in products],
            'count': count,
            'total_pages': total_pages,
            'page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Products Fetch Failed: {str(e)}'}), 500


@product_blueprint.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = product_service.get_product_by_id(product_id)
        if not product:
            return jsonify({'message': 'Product could not be found.'}), 404
        return jsonify({
            'product': product_service.serialize_product(product)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Product Fetch Failed: {str(e)}'}), 500

@product_blueprint.route('/slug/<string:slug>', methods=['GET'])
def get_product_by_slug(slug):
    try:
        product = product_service.get_product_by_slug(slug)
        if not product:
            return jsonify({'message': 'Product could not be found.'}), 404
        return jsonify({
            'product': product_service.serialize_product(product)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Product Fetch Failed: {str(e)}'}), 500

@product_blueprint.route('/', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    try:
        product = product_service.create_product(data)
        return jsonify({
            'message': 'Product was created successfully.',
            'product': product_service.serialize_product(product)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Product Creation Failed: {str(e)}'}), 500

@product_blueprint.route('/<int:product_id>', methods=['PUT', 'DELETE'])
@admin_required
def manage_product(product_id):
    product = product_service.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product could not be found.'}), 404
    if request.method == 'PUT':
        data = request.get_json()
        try:
            updated_product = product_service.update_product(product_id, data)
            return jsonify({
                'message': 'Product was updated successfully.',
                'product': product_service.serialize_product(updated_product)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Product Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            product_service.delete_product(product_id)
            return jsonify({
                'id': product_id,
                'message': 'Product was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'Product Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405

@product_blueprint.route('/<int:product_id>/variants', methods=['POST'])
@admin_required
def create_product_variant(product_id):
    product = product_service.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product could not be found.'}), 404
    data = request.get_json()
    try:
        variant = product_service.create_product_variant(product_id, data)
        return jsonify({
            'message': 'Product variant was created successfully.',
            'product': product_service.serialize_product(product),
            'variant': product_service.serialize_product_variant(variant)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Product Variant Creation Failed: {str(e)}'}), 500
    
@product_blueprint.route('/<int:product_id>/variants/<int:variant_id>', methods=['PUT', 'DELETE'])
@admin_required
def manage_product_variant(product_id, variant_id):
    product = product_service.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product could not be found.'}), 404
    variant = product_service.get_product_variant_by_id(variant_id)
    if not variant:
        return jsonify({'message': 'Product variant could not be found.'}), 404
    if request.method == 'PUT':
        try:
            data = request.get_json()
            updated_variant = product_service.update_product_variant(variant_id, data)
            return jsonify({
                'message': 'Product variant was updated successfully.',
                'product': product_service.serialize_product(product),
                'variant': product_service.serialize_product_variant(updated_variant)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Product Variant Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            product_service.delete_product_variant(variant_id)
            return jsonify({
                'id': variant_id,
                'product': product_service.serialize_product(product),
                'message': 'Product variant was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'Product Variant Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405

@product_blueprint.route('/<int:product_id>/images', methods=['POST'])
@admin_required
def create_product_image(product_id):
    product = product_service.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product could not be found.'}), 404
    try:
        data = request.form.to_dict()
        file = request.files.get('file')
        if file:
            data['file'] = file 
        variant_id = data.get('variant_id')
        image = product_service.create_product_image(product_id, data, variant_id)
        if not image:
            return jsonify({'message': 'Image could not be created.'}), 400
        return jsonify({
            'message': 'Product image was added successfully.',
            'product': product_service.serialize_product(product),
            'image': product_service.serialize_product_image(image)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Product Image Creation Failed: {str(e)}'}), 500
   
@product_blueprint.route('/<int:product_id>/images/<int:image_id>', methods=['DELETE'])
@admin_required
def delete_product_image(product_id, image_id):
    product = product_service.get_product_by_id(product_id)
    if not product:
        return jsonify({'message': 'Product could not be found.'}), 404
    try:
        success = product_service.delete_product_image(image_id)
        if not success:
            return jsonify({'message': 'Image could not be found.'}), 404
        return jsonify({
            'id': image_id,
            'product': product_service.serialize_product(product),
            'message': 'Product image was deleted successfully.'
        }), 200
    except Exception as e:
        return jsonify({'message': f'Product Image Deletion Failed: {str(e)}'}), 500