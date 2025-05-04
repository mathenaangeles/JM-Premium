import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';

import { getReviews } from '../../slices/reviewSlice'; 

const ReviewList = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); 
  const { reviews, loading, error, totalPages, currentPage, count } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.user); 

  const [perPage, _] = useState(10);
  const isAdmin = user?.is_admin;

  const loadReviews = useCallback((page, perPage, userId) => {
    const params = { page, perPage, userId };
    dispatch(getReviews(params));
  }, [dispatch]);

  useEffect(() => {
    loadReviews(currentPage, perPage, userId || (isAdmin ? null : user?.id));
  }, [loadReviews, currentPage, perPage, userId, isAdmin, user]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      loadReviews(newPage, perPage, userId || (isAdmin ? null : user?.id));
    }
  };

  if (loading && reviews.length === 0) {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {userId ? 'User Reviews' : isAdmin ? 'All Reviews' : 'My Reviews'}
      </h1>

      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-500 mb-4">No reviews found</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Review ID</th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Approved</th>
                  <th className="py-3 px-4 text-left">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                    <Link
                        to={`/reviews/${review.id}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        {review.id}
                    </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{review.product?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-gray-600">{review.user?.email || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{review.rating}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600">{review.is_approved ? (<span>Approved</span>) : (<span>Not Approved</span>)}</td>
                    <td className="py-3 px-4 text-gray-600">{review.is_verified ? (<span>Verified</span>) : (<span>Not Verified</span>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {reviews.length} of {count} reviews
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
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

export default ReviewList;
