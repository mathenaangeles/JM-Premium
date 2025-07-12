import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star as StarIcon, AdminPanelSettings as AdminIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box, Typography, TextField, Button, Rating, FormControlLabel, Checkbox, Paper, Divider, Stack, useTheme, Dialog, DialogTitle, DialogContent, IconButton, DialogActions, FormHelperText, FormGroup } from '@mui/material';

import { createReview, updateReview } from '../../slices/reviewSlice';
const ReviewForm = ({  productId, review, onReviewSubmit, open = false, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

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
    if (!open) {
      setReviewData({
        title: '',
        rating: 0,
        content: '',
        is_approved: false,
        is_verified: false
      });
      setIsEditing(false);
    }
  }, [open]);

  useEffect(() => {
    if (review && open) {
      const canEdit = user?.is_admin || user?.id === review.user_id;
      if (canEdit) {
        setIsEditing(true);
        setReviewData({
          title: review.title || '',
          rating: review.rating || 0,
          content: review.content || '',
          is_approved: review.is_approved || false,
          is_verified: review.is_verified || false,
        });
      }
    }
  }, [review, user, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setReviewData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleRatingChange = (_, newValue) => {
    setReviewData(prev => ({ ...prev, rating: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.rating === 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing && review) {
        await dispatch(updateReview({ 
          reviewId: review.id,
          reviewData 
        })).unwrap();
      } else {
        await dispatch(createReview({ 
          productId, 
          reviewData 
        })).unwrap();
      }
      if (onReviewSubmit) {
        onReviewSubmit();
      }
      onClose();
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'common.grey' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider/>
      <DialogContent sx={{ px: 4, py: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Your Rating *
          </Typography>
          <Rating
              name="rating"
              value={reviewData.rating}
              onChange={handleRatingChange}
              precision={1}
              size="large"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{ 
                '& .MuiRating-iconEmpty': {
                  color: theme.palette.grey[300],
                },
                mb: 2
              }}
            />
          <TextField
            fullWidth
            name="title"
            label="Review Title"
            value={reviewData.title}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="content"
            label="Review Content"
            multiline
            rows={5}
            value={reviewData.content}
            onChange={handleChange}
            required
            sx={{ 
              mb: 2,
            }}
          />
          {user?.is_admin && (
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AdminIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography 
                  variant="subtitle1" 
                  color="secondary.main" 
                  sx={{ fontWeight: 600 }}
                >
                  Admin Controls
                </Typography>
              </Stack>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  bgcolor: theme.palette.primary.light,
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 2
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                  <FormGroup>
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
                          Approved
                        </Typography>
                      }
                    />
                    <FormHelperText>
                      Approved reviews are visible to other users.
                    </FormHelperText>
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          name="is_verified"
                          checked={reviewData.is_verified}
                          onChange={handleChange}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Verified
                        </Typography>
                      }
                    />
                     <FormHelperText>
                      Verified means the reviewer has purchased this product.
                    </FormHelperText>
                  </FormGroup>
                </Stack>
              </Paper>
            </Box>
          )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
         <Button
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || reviewData.rating === 0}
          >
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;