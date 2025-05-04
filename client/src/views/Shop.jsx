import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiFilter, FiSearch, FiShoppingBag, FiStar, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';

import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';
import { getCategories, getCategoryBreadcrumbs } from '../slices/categorySlice';

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialSearch = queryParams.get('search') || '';
  const initialCategoryIds = queryParams.get('category_ids') ? 
    queryParams.get('category_ids').split(',').map(id => parseInt(id)) : [];
  
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialCategoryIds);
  const [perPage] = useState(12);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const { products, totalProducts, loading: productsLoading } = useSelector(state => state.product);
  const { categories, loading: categoriesLoading } = useSelector(state => state.category);
  const { breadcrumbs } = useSelector(state => state.category);
  
  useEffect(() => {
    dispatch(getCategories({ tree: false }));
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(getProducts({ 
      page, 
      perPage, 
      search, 
      categoryIds: selectedCategoryIds,
      isActive: true 
    }));
    
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (search) params.set('search', search);
    if (selectedCategoryIds.length > 0) params.set('category_ids', selectedCategoryIds.join(','));
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
  }, [dispatch, page, perPage, search, selectedCategoryIds, navigate, location.pathname]);
  
  useEffect(() => {
    if (selectedCategoryIds.length === 1) {
      dispatch(getCategoryBreadcrumbs({ categoryId: selectedCategoryIds[0] }));
    }
  }, [dispatch, selectedCategoryIds]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };
  
  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
    setPage(1);
  };
  
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    });
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); 
  };
  
  const totalPages = Math.ceil(totalProducts / perPage) || 1;
  
  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    return (
      <nav className="flex mb-4 text-sm">
        <Link to="/shop" className="text-gray-500 hover:text-gray-700">
          Shop
        </Link>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.id}>
            <span className="mx-2 text-gray-500">
              <FiChevronRight className="inline" />
            </span>
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{item.name}</span>
            ) : (
              <Link 
                to={`/shop?category_ids=${item.id}`}
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategoryIds([item.id]);
                }}
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };
  
  const renderCategories = (categoryList, level = 0) => {
    if (!categoryList || categoryList.length === 0) return null;
    
    return categoryList.map(category => (
      <div key={category.id} className={`ml-${level * 4}`}>
        <div className="flex items-center py-1">
          {category.children && category.children.length > 0 && (
            <button 
              onClick={() => toggleCategoryExpansion(category.id)}
              className="mr-1 p-1 rounded-md hover:bg-gray-100"
            >
              {expandedCategories[category.id] ? 
                <FiChevronUp size={16} /> : 
                <FiChevronDown size={16} />
              }
            </button>
          )}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 rounded"
              checked={selectedCategoryIds.includes(category.id)}
              onChange={() => handleCategorySelect(category.id)}
            />
            <span className="text-sm">{category.name}</span>
            {category.product_count && (
              <span className="ml-1 text-xs text-gray-500">({category.product_count})</span>
            )}
          </label>
        </div>
        
        {category.children && category.children.length > 0 && expandedCategories[category.id] && (
          <div className="mt-1 mb-2">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };
    
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pagesToShow = [];
    const ellipsis = <span key="ellipsis" className="px-2">...</span>;
    
    pagesToShow.push(1);
    
    let rangeStart = Math.max(2, page - 1);
    let rangeEnd = Math.min(totalPages - 1, page + 1);
    
    if (rangeStart > 2) {
      pagesToShow.push(ellipsis);
    }
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagesToShow.push(i);
    }
    
    if (rangeEnd < totalPages - 1) {
      pagesToShow.push(ellipsis);
    }
    
    if (totalPages > 1) {
      pagesToShow.push(totalPages);
    }
    
    return (
      <div className="flex justify-center mt-8 space-x-1">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${
            page === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Prev
        </button>
        
        {pagesToShow.map((pageNum, index) => (
          typeof pageNum === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded ${
                pageNum === page
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ) : (
            pageNum // This is the ellipsis
          )
        ))}
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded ${
            page === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        {selectedCategoryIds.length === 1 && breadcrumbs && (
          renderBreadcrumbs()
        )}
      </div>
      
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center bg-gray-100 p-3 rounded-md"
        >
          <FiFilter className="mr-2" />
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button 
              type="submit"
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="max-h-80 overflow-y-auto">
              {categoriesLoading ? (
                <div className="py-2 text-gray-500">Loading categories...</div>
              ) : categories?.length > 0 ? (
                renderCategories(categories)
              ) : (
                <div className="py-2 text-gray-500">No categories found</div>
              )}
            </div>
          </div>
          
          {(search || selectedCategoryIds.length > 0) && (
            <button 
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              onClick={() => {
                setSearch('');
                setSearchInput('');
                setSelectedCategoryIds([]);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        
        <div className="flex-1">
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No products found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              {(search || selectedCategoryIds.length > 0) && (
                <button 
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setSelectedCategoryIds([]);
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;