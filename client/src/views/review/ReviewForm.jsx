import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Rating, FormControlLabel, Checkbox, Paper, Divider } from '@mui/material';

import { createReview, updateReview } from '../../slices/reviewSlice';

const ReviewForm = ({ reviewId = null, productId, onReviewSubmit }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { review } = useSelector((state) => state.review);

  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 0,
    content: '',
    is_approved: false,
    is_verified: false
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (review && reviewId) {
      const canEdit = user?.is_admin || user?.id === review.user_id;
      if (!canEdit) {
        setIsEditing(false);
        return;
      }
      setIsEditing(true);
      setReviewData({
        title: review.title || '',
        rating: review.rating || 0,
        content: review.content || '',
        is_approved: review.is_approved || false,
        is_verified: review.is_verified || false,
      })
    } else {
      setIsEditing(false);
    }
  }, [reviewId, review, user]);

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateReview({ reviewId: reviewId, reviewData: reviewData }));
    } else {
      dispatch(createReview({ productId: productId, reviewData: reviewData }));
    }
    if (onReviewSubmit) {
      onReviewSubmit();
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3
      }}
    >
      <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Your Rating*
        </Typography>
        <Rating
          name="rating"
          value={reviewData.rating}
          onChange={handleChange}
          precision={1}
          size="large"
          sx={{ 
            '& .MuiRating-iconFilled': {
              color: 'warning.main',
            },
            '& .MuiRating-iconHover': {
              color: 'warning.light',
            },
          }}
          required
        />
      </Box>

      <TextField
        fullWidth
        id="title"
        label="Review Title"
        value={reviewData.title}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        id="content"
        label="Your Review"
        multiline
        rows={4}
        value={reviewData.content}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        required
        sx={{ mb: 3 }}
        placeholder="What did you like or dislike? How was your experience with this product?"
      />

      {user?.is_admin && (
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Admin Controls
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={reviewData.is_approved}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Approved"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={reviewData.is_verified}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Verified Purchase"
            />
          </Box>
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ 
          mt: 1,
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 150
        }}
      >
        {isEditing ? 'Update Review' : 'Submit Review'}
      </Button>
    </Paper>
  );
};

export default ReviewForm;