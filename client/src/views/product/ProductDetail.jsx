import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import ReviewForm from '../review/ReviewForm';
import { addToCart } from '../../slices/cartSlice';
import { getReviews } from '../../slices/reviewSlice';
import { getProductBySlug } from '../../slices/productSlice';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { product, loading, error } = useSelector((state) => state.product);
  const { reviews } = useSelector((state) => state.review);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
  }, [dispatch, slug]);
  
  useEffect(() => {
    if (product && product.id) {
      dispatch(getReviews({
        productId: product.id
      }));
    }
  }, [dispatch, product]); 

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const handleAddToCart = () => {
    const productToAdd = selectedVariant ? selectedVariant : product;

    dispatch(addToCart({
      product_id: productToAdd.id,
      variant_id: selectedVariant ? selectedVariant.id : null,
      quantity,
    }));
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleReviewSubmit = () => {
    dispatch(getReviews({
      productId: product.id
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/shop" className="text-blue-600 hover:underline">
          ← Back to Shop
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative pb-[100%]">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              {product.is_featured && (
                <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 space-x-2">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(index)}
                    className={`w-16 h-16 flex-shrink-0 cursor-pointer border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-baseline mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-2">
                ${selectedVariant ? selectedVariant.price : product.price}
              </span>
              {(selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price) && (
                <span className="text-lg text-gray-500 line-through">
                  ${selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price}
                </span>
              )}
            </div>

            <div className="mb-6">
              <div
                className="prose prose-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant.id)}
                      className={`px-3 py-1 rounded border ${
                        selectedVariant && selectedVariant.id === variant.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-gray-300 rounded-l px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border-t border-b border-gray-300 text-center w-16 py-2"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border border-gray-300 rounded-r px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-6">
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  (selectedVariant ? selectedVariant.quantity > 0 : product.quantity > 0)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {(selectedVariant ? selectedVariant.quantity > 0 : product.quantity > 0)
                  ? 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={(selectedVariant ? selectedVariant.quantity <= 0 : product.quantity <= 0)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <ReviewForm productId={product.id} onReviewSubmit={handleReviewSubmit}/>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 mb-4">
              <h4 className="font-semibold text-lg">{review.title}</h4>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
              </div>
              <p>{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;