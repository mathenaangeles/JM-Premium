import React, { useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../product/ProductCard';
import { getProducts } from '../../slices/productSlice';
import { getCategoryBySlug, getCategoryBreadcrumbs } from '../../slices/categorySlice';

const CategoryDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { category, breadcrumbs, loading, error } = useSelector(state => state.category);
  const { products, totalPages, currentPage, loading: productsLoading } = useSelector(state => state.product);

  const [showSubcategories, setShowSubcategories] = useState(true);

  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    if (slug) {
      dispatch(getCategoryBySlug({ slug, includeSubcategories: true }));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (category?.id) {
      dispatch(getCategoryBreadcrumbs({ categoryId: category.id }));
      const categoryIds = [category.id];
      if (category.subcategories && category.subcategories.length > 0) {
        categoryIds.push(...category.subcategories.map(sub => sub.id));
      }
      dispatch(getProducts({ categoryIds, page: 1, perPage }));
    }
  }, [dispatch, category?.id, category?.subcategories, perPage]);

  const handlePageChange = (page) => {
    const categoryIds = [category.id];
    if (category.subcategories && category.subcategories.length > 0) {
      categoryIds.push(...category.subcategories.map(sub => sub.id));
    }
    dispatch(getProducts({ categoryIds, page, perPage }));
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
  };

  if (loading && !category) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Category not found</h2>
        <p className="text-gray-600 mt-4">The category you're looking for doesn't exist or has been removed.</p>
        <Link to="/manage/categories" className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-md">
          Browse All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm mb-6">
          <ol className="flex flex-wrap">
            <li className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
              <span className="mx-2 text-gray-500">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/manage/categories" className="text-blue-600 hover:text-blue-800">Categories</Link>
              <span className="mx-2 text-gray-500">/</span>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={item.id} className="flex items-center">
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link to={`/categories/${item.slug}`} className="text-blue-600 hover:text-blue-800">
                      {item.name}
                    </Link>
                    <span className="mx-2 text-gray-500">/</span>
                  </>
                ) : (
                  <span className="text-gray-600">{item.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mb-8">
        {/* {category.image_url && (
          <div className="mb-4">
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/800/320';
              }}
            />
          </div>
        )} */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Subcategories</h2>
            <button 
              onClick={() => setShowSubcategories(!showSubcategories)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showSubcategories ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSubcategories && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.subcategories.map(subcat => (
                <Link 
                  key={subcat.id}
                  to={`/categories/${subcat.slug}`} 
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-medium text-gray-800">{subcat.name}</h3>
                  {subcat.product_count !== undefined && (
                    <p className="text-sm text-gray-500 mt-1">{subcat.product_count} Products</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <div className="flex items-center">
            <label htmlFor="perPage" className="mr-2 text-sm text-gray-600">Per Page:</label>
            <select 
              id="perPage" 
              value={perPage}
              onChange={handlePerPageChange}
              className="border rounded p-1"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-300 rounded-l-md ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border-t border-b border-r border-gray-300 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="px-4 py-2 border-t border-b border-r border-gray-300 bg-white text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border-t border-b border-r border-gray-300 rounded-r-md ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;