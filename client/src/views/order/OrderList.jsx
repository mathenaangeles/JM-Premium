import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserOrders, getOrders, resetCurrentPage } from '../../slices/orderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { orders, loading, error, totalPages, currentPage, count } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  const [statusFilter, setStatusFilter] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const isAdmin = user?.is_admin;

  const loadOrders = useCallback((page, perPage, status) => {
    const params = { page, perPage, status };
    if (userId) {
      dispatch(getUserOrders(params));
    } else if (isAdmin) {
      dispatch(getOrders(params));
    }
  }, [dispatch, userId, isAdmin]);

  useEffect(() => {
    loadOrders(currentPage, perPage, statusFilter);
  }, [loadOrders, currentPage, perPage, statusFilter]);

  useEffect(() => {
    dispatch(resetCurrentPage());
  }, [dispatch, userId, isAdmin]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      loadOrders(newPage, perPage, statusFilter);
    }
  };

  const handleFilterChange = (e) => {
    const status = e.target.value === 'all' ? null : e.target.value;
    setStatusFilter(status);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          {isAdmin ? 'All Orders' : 'My Orders'}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <label htmlFor="perPage" className="mr-2 text-sm text-gray-600">Show:</label>
            <select
              id="perPage"
              value={perPage}
              onChange={handlePerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <select
              value={statusFilter || 'all'}
              onChange={handleFilterChange}
              className="border rounded px-3 py-1 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-500 mb-4">No orders found</div>
          <Link to="/shop" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  {isAdmin && <th className="py-3 px-4 text-left">User</th>}
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">#{order.id}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-gray-600">
                        {order.user?.email || 'N/A'}
                      </td>
                    )}
                    <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {orders.length} of {count} orders
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-3 py-1 text-gray-500">...</span>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                      
                      {showEllipsisAfter && (
                        <span className="px-3 py-1 text-gray-500">...</span>
                      )}
                    </React.Fragment>
                  );
                })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;