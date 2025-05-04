from flask import Blueprint, request, jsonify

from middlewares.user import admin_required
from services.category import CategoryService

category_blueprint = Blueprint('category', __name__, url_prefix='/categories')
category_service = CategoryService()

@category_blueprint.route('/', methods=['GET'])
def get_categories():
    try:
        tree_format = request.args.get('tree', 'false').lower() == 'true'
        print(tree_format)
        if tree_format:
            categories = category_service.get_category_tree()
        else:
            categories = [
                category_service.serialize_category(category) for category in category_service.get_all_categories()
            ]
        return jsonify({
            'categories': categories
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Categories Fetch Failed: {str(e)}'}), 500

@category_blueprint.route('/root', methods=['GET'])
def get_root_categories():
    try:
        categories = [category_service.serialize_category(category) for category in category_service.get_all_categories(filters={"parent_category_id": None})]
        return jsonify({
            'categories': categories
        }), 200
    except Exception as e:
         return jsonify({'message': f'Root Categories Fetch Failed: {str(e)}'}), 500

@category_blueprint.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        include_subcategories = request.args.get('include_subcategories', 'false').lower() == 'true'
        if include_subcategories:
            category = category_service.get_category_with_subcategories(category_id)
        else:
            category = category_service.get_category_by_id(category_id)
            category = category_service.serialize_category(category) if category else None
        if not category:
            return jsonify({'message': 'Category could not be found.'}), 404
        return jsonify({
            'category': category
        }), 200
    except Exception as e:
        return jsonify({'message': f'Category Fetch Failed: {str(e)}'}), 500
    
@category_blueprint.route('/slug/<slug>', methods=['GET'])
def get_category_by_slug(slug):
    category = category_service.get_category_by_slug(slug)
    if not category:
        return jsonify({'message': 'Category could not be found.'}), 404
    try:
        include_subcategories = request.args.get('include_subcategories', 'false').lower() == 'true'
        if include_subcategories:
            category = category_service.get_category_with_subcategories(category.id)
        else:
            category = category_service.serialize_category(category)
        return jsonify({
            'category': category
        }), 200
    except Exception as e:
        return jsonify({'message': f'Category Fetch Failed: {str(e)}'}), 500
    
@category_blueprint.route('/<int:category_id>/breadcrumbs', methods=['GET'])
def get_breadcrumbs(category_id):
    try:
        breadcrumbs = category_service.get_category_breadcrumbs(category_id)
        if not breadcrumbs:
            return jsonify({'message': 'Category breadcrumbs could not be found.'}), 404
        return jsonify({
            'breadcrumbs': breadcrumbs
        }), 200
    except Exception as e:
        return jsonify({'message': f'Category Breadcrumbs Fetch Failed: {str(e)}'}), 500

@category_blueprint.route('/', methods=['POST'])
@admin_required
def create_category():
    try:
        data = request.get_json()
        category = category_service.create_category(data)
        return jsonify({
            'message': 'Category was created successfully.',
            'category': category_service.serialize_category(category)
        }), 201
    except Exception as e:
        return jsonify({'message': f'Category Creation Failed: {str(e)}'}), 500
    
@category_blueprint.route('/<int:category_id>', methods=['PUT', 'DELETE'])
@admin_required
def manage_category(category_id):
    category = category_service.get_category_by_id(category_id)
    if not category:
        return jsonify({'message': 'Category could not be found.'}), 404
    if request.method == 'PUT':
        try:
            data = request.get_json()
            updated_category = category_service.update_category(category_id, data)
            return jsonify({
                'message': 'Category was updated successfully.',
                'category': category_service.serialize_category(updated_category)
            }), 200
        except Exception as e:
            return jsonify({'message': f'Category Update Failed: {str(e)}'}), 500
    elif request.method == 'DELETE':
        try:
            category_service.delete_category(category_id)
            return jsonify({
                'id': category_id,
                'message': 'Category was deleted successfully.'
            }), 200
        except Exception as e:
            return jsonify({'message': f'Category Deletion Failed: {str(e)}'}), 500
    return jsonify({'message': 'Invalid Request Method'}), 405
