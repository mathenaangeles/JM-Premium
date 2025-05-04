import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  if (!product) {
    return null; 
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative pb-[100%]">
        <img
          src={product.primary_image?.url || 'https://via.placeholder.com/300'} // Use primary image or a placeholder
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">
            ${product.display_price?.toFixed(2)} 
          </span>
          {product.sale_price !== null && product.sale_price < product.base_price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.base_price?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;