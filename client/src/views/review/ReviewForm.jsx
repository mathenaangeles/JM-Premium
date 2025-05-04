import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createReview, updateReview } from '../../slices/reviewSlice';

const ReviewForm = ({ reviewId = null, productId }) => {
  const dispatch = useDispatch();
  const { review } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.user);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [approved, setApproved] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (reviewId && review) {
      const canEdit = user?.is_admin || user?.id === review.user_id;

      if (!canEdit) {
        setIsEditing(false);
        return;
      }

      setIsEditing(true);
      setRating(review.rating || 0);
      setTitle(review.title || '');
      setContent(review.content || '');

      if (user?.is_admin) {
        setApproved(review.is_approved || false);
        setVerified(review.is_verified || false);
      }
    } else {
      setIsEditing(false);
    }
  }, [reviewId, review, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = { rating, title, content };

    if (user?.is_admin) {
      reviewData.is_approved = approved;
      reviewData.is_verified = verified;
    }

    if (isEditing) {
      dispatch(updateReview({ reviewId, reviewData }));
    } else {
      dispatch(createReview({ productId, reviewData }));
      setTitle('');
      setRating(1);
      setContent('');
      setApproved(false);
      setVerified(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Review' : 'Add a Review'}
      </h2>

      <div className="mb-4">
        <label htmlFor="rating" className="block text-gray-600 font-medium mb-2">
          Rating (1–5)
        </label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-600 font-medium mb-2">
          Review Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-600 font-medium mb-2">
          Review Content
        </label>
        <textarea
          id="content"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
      </div>

      {user?.is_admin && (
        <>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Approved</label>
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Verified</label>
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {isEditing ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
