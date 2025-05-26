import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  FormControlLabel, 
  Checkbox, 
  Paper, 
  Divider,
  Chip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { 
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  AdminPanelSettings as AdminIcon,
  RateReview as ReviewIcon
} from '@mui/icons-material';

import { createReview, updateReview } from '../../slices/reviewSlice';

const ReviewForm = ({ reviewId = null, productId, onReviewSubmit }) => {
  const theme = useTheme();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      });
    } else {
      setIsEditing(false);
    }
  }, [reviewId, review, user]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setReviewData({ 
      ...reviewData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleRatingChange = (event, newValue) => {
    setReviewData({ ...reviewData, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        await dispatch(updateReview({ reviewId: reviewId, reviewData: reviewData }));
      } else {
        await dispatch(createReview({ productId: productId, reviewData: reviewData }));
      }
      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating) => {
    const labels = {
      0.5: 'Terrible',
      1: 'Poor',
      1.5: 'Poor+',
      2: 'Fair',
      2.5: 'Fair+',
      3: 'Good',
      3.5: 'Good+',
      4: 'Very Good',
      4.5: 'Excellent',
      5: 'Outstanding'
    };
    return labels[rating] || '';
  };

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit} 
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        mb: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <ReviewIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            color="text.primary" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {isEditing ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
          {isEditing && (
            <Chip 
              label="Editing" 
              size="small" 
              color="info" 
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Share your experience and help others make informed decisions
        </Typography>
      </Box>

      {/* Rating Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="subtitle1" 
          color="text.primary" 
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Your Rating *
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Rating
            name="rating"
            value={reviewData.rating}
            onChange={handleRatingChange}
            precision={0.5}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            sx={{ 
              '& .MuiRating-iconFilled': {
                color: '#FFB400',
                filter: 'drop-shadow(0 2px 4px rgba(255, 180, 0, 0.3))',
              },
              '& .MuiRating-iconHover': {
                color: '#FFCD3C',
                transform: 'scale(1.1)',
                transition: 'transform 0.2s ease-in-out',
              },
              '& .MuiRating-iconEmpty': {
                color: alpha('#FFB400', 0.3),
              }
            }}
            required
          />
          {reviewData.rating > 0 && (
            <Chip 
              label={getRatingLabel(reviewData.rating)}
              variant="outlined"
              size="small"
              sx={{ 
                bgcolor: alpha('#FFB400', 0.1),
                borderColor: alpha('#FFB400', 0.3),
                color: 'text.primary'
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Review Title */}
      <TextField
        fullWidth
        name="title"
        label="Review Title"
        value={reviewData.title}
        onChange={handleChange}
        variant="outlined"
        required
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            }
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          }
        }}
        placeholder="Summarize your experience in a few words"
      />

      {/* Review Content */}
      <TextField
        fullWidth
        name="content"
        label="Your Detailed Review"
        multiline
        rows={5}
        value={reviewData.content}
        onChange={handleChange}
        variant="outlined"
        required
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            }
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          }
        }}
        placeholder="What did you like or dislike? How was your overall experience with this product? Be specific and helpful to other customers."
      />

      {/* Admin Controls */}
      {user?.is_admin && (
        <Box sx={{ mb: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <AdminIcon sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography 
              variant="subtitle1" 
              color="warning.main" 
              sx={{ fontWeight: 600 }}
            >
              Admin Controls
            </Typography>
          </Stack>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              borderRadius: 2
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="is_approved"
                    checked={reviewData.is_approved}
                    onChange={handleChange}
                    color="success"
                    sx={{
                      '&.Mui-checked': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Approved for Display
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    name="is_verified"
                    checked={reviewData.is_verified}
                    onChange={handleChange}
                    color="info"
                    sx={{
                      '&.Mui-checked': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Verified Purchase
                  </Typography>
                }
              />
            </Stack>
          </Paper>
        </Box>
      )}

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting || reviewData.rating === 0}
          sx={{ 
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 160,
            height: 48,
            borderRadius: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: alpha(theme.palette.action.disabled, 0.12),
              color: theme.palette.action.disabled,
              boxShadow: 'none',
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;