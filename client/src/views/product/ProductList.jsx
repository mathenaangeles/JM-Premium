import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../slices/productSlice';
import DeleteConfirmationModal from '../../components/DeleteConfirmation';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector((state) => state.product);
  const [search, setSearch] = useState('');
  const [selectedCategories, _] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [dispatch, page, perPage, showFeaturedOnly, search, selectedCategories]); // Include search and categories in dependency array

  const loadProducts = () => {
    dispatch(getProducts({
      page: page,
      perPage,
      search: search.trim(),
      categoryIds: selectedCategories,
      isFeatured: showFeaturedOnly ? true : undefined,
      isActive: true
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete.id)).then(() => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        loadProducts(); // Reload products after deletion
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            page === i ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/manage/products/form/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredOnly"
              checked={showFeaturedOnly}
              onChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="mr-2"
            />
            <label htmlFor="featuredOnly">Featured Only</label>
          </div>
          <div>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="p-2 border rounded"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Total Stock</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="py-3 px-4">
                        <div className="w-16 h-16 relative">
                          {product.primary_image ? (
                            <img
                              src={product.primary_image.url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                          {product.is_featured && (
                            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-1 rounded">
                              ⭐
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium">${product.display_price?.toFixed(2)}</span>
                          {product.sale_price !== null && product.sale_price < product.base_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.base_price?.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.total_stock}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            product.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/manage/products/form/${product.id}`}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && renderPagination()}
        </>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          message={`Are you sure you want to delete ${productToDelete?.name}?`}
        />
      )}
    </div>
  );
};

export default ProductList;