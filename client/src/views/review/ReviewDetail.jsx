import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 

import ReviewForm from './ReviewForm';
import { getReview, deleteReview } from '../../slices/reviewSlice';
import DeleteConfirmationModal from '../../components/DeleteConfirmation'; 


const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const { review, loading, error } = useSelector((state) => state.review); 

  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    dispatch(getReview(reviewId));
  }, [dispatch, reviewId]);

  const handleDelete = () => {
    dispatch(deleteReview(reviewId))
      .then(() => {
        navigate('/reviews');
      })
      .catch((err) => console.error('Error deleting review:', err));
  };

  const openDeleteModal = () => setIsModalOpen(true);

  const closeDeleteModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600">
          Go Back
        </button>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Review not found</p>
        <button onClick={() => navigate(-1)} className="text-blue-600">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Review Details</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Review ID: #{review.id}</h2>
        <p className="text-sm text-gray-600">Rating: {review.rating}</p>
        <p className="text-gray-700">{review.title}</p>
        <p className="text-gray-600">{review.content}</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <p className="text-sm text-gray-600">Product Name: {review.product.name}</p>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={openDeleteModal}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Review
        </button>
      </div>
      <ReviewForm reviewId={reviewId} productId={review.product_id} />
      {isModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          message="Are you sure you want to delete this review?"
        />
      )}
    </div>
  );
};

export default ReviewDetail;
