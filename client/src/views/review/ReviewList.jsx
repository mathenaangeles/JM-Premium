import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Delete as DeleteIcon, RateReview as ReviewIcon, Refresh as RefreshIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Verified as VerifiedIcon } from '@mui/icons-material';
import { FormControlLabel, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert, Chip, Grid, LinearProgress, Pagination, FormControl, Select, MenuItem, Rating, Switch, IconButton } from '@mui/material';

import ReviewForm from './ReviewForm';
import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getReviews, clearReviewMessages, deleteReview } from '../../slices/reviewSlice'; 

const ReviewList = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); 
  const { reviews, loading, error, totalPages, currentPage, count } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.user); 

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [approvalFilter, setApprovalFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const isAdmin = user?.is_admin;
  const editingReview = reviews.find((r) => r.id === editingReviewId);

  const loadReviews = useCallback((page, perPage, userId) => {
    const params = { 
      page, 
      perPage, 
      userId,
      approved: approvalFilter !== '' ? approvalFilter === 'true' : null,
      verified: verificationFilter !== '' ? verificationFilter === 'true' : null,
    };
    dispatch(getReviews(params));
  }, [dispatch, approvalFilter, verificationFilter]);

  useEffect(() => {
    loadReviews(currentPage, perPage, userId || (isAdmin ? null : user?.id));
  }, [loadReviews, currentPage, perPage, userId, isAdmin, user, approvalFilter, verificationFilter]);

  const handlePageChange = (_, value) => {
    setPage(value);
    if (value > 0 && value <= totalPages) {
      loadReviews(value, perPage, userId || (isAdmin ? null : user?.id));
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
    setPage(1);
    loadReviews(1, e.target.value, userId || (isAdmin ? null : user?.id));
  };

  const openDeleteModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedReviewId(null);
  };

  const handleDelete = () => {
    dispatch(deleteReview(selectedReviewId)).then(() => {
      closeDeleteModal();
      loadReviews(page, perPage, userId || (isAdmin ? null : user?.id));
    });
  };

  const resetFilters = () => {
    setApprovalFilter('');
    setVerificationFilter('');
    setPage(1);
    loadReviews(1, perPage, userId || (isAdmin ? null : user?.id));
  };

  const handleOpenEdit = (id) => {
    setEditingReviewId(id);
  };

  const handleCloseEdit = () => {
    setEditingReviewId(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearReviewMessages())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" fontWeight={600} mb={3}>
        {userId ? 'My Reviews' : isAdmin ? 'Manage Reviews' : 'My Reviews'}
      </Typography>
      {isAdmin && (
        <Grid container spacing={1} justifyContent="space-between" alignItems="center" sx={{ my: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={approvalFilter === 'true'}
                    onChange={(e) => setApprovalFilter(e.target.checked ? 'true' : '')}
                    color="primary"
                  />
                }
                label="Show Approved Only"
                sx={{ m: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={verificationFilter === 'true'}
                    onChange={(e) => setVerificationFilter(e.target.checked ? 'true' : '')}
                    color="primary"
                  />
                }
                label="Show Verified Only"
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{
            display: 'flex',
            justifyContent: {
              xs: 'flex-start',
              md: 'flex-end',
            },
            alignItems: 'center',
          }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      )}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Review ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Date</TableCell>
              {isAdmin && (<TableCell>Status</TableCell>)}
              {isAdmin && (<TableCell>Verification</TableCell>)}
              {isAdmin && (<TableCell>User</TableCell>)}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0, pb: 2 }}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : reviews?.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                      <Typography
                        component="button"
                        onClick={() => handleOpenEdit(review.id)}
                        fontWeight={600}
                        sx={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                        }}
                      >
                        {review.id}
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/products/${review.product?.slug}`}
                      variant="body2"
                      fontWeight={600}
                      color="inherit"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      {review.product?.name || 'Unknown Product'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        size="small" 
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({review.rating})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Chip
                        label={review.is_approved ? 'Approved' : 'Pending'}
                        size="small"
                        variant={review.is_approved ? 'filled' : 'outlined'}
                        color={review.is_approved ? 'default' : 'error'}
                        sx={{
                          backgroundColor: review.is_approved ? 'primary.light' : 'transparent',
                          color: review.is_approved ? 'secondary.main' : 'error.main',
                          borderColor: !review.is_approved ? 'error.main' : 'transparent',
                          fontWeight: 600,
                          p: 1,
                        }}
                      />
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell>
                      <Chip
                        icon={review.is_verified ? <VerifiedIcon /> : <></>}
                        label={review.is_verified ? 'Verified' : 'Unverified'}
                        size="small"
                        sx={{
                          backgroundColor: review.is_verified ? 'primary.light' : 'grey.100',
                          color: review.is_verified ? 'secondary.main' : 'common.grey',
                          fontWeight: 600,
                          p: 1,
                        }}
                      />
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {review.user?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDeleteModal(review.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>                
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <ReviewIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="h6" color="text.primary" fontWeight={500}>
                      No reviews found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userId ? 'This user has not written any reviews yet.' : 
                       isAdmin ? 'No reviews have been submitted yet.' : 
                       'You have not written any reviews yet.'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              displayEmpty
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 4 }}>
            {count > 0 ? `Showing ${(page - 1) * perPage + 1}-${Math.min(page * perPage, count)} of ${count}` : 'No results found'}
          </Typography>
        </Box>
        <Pagination 
          count={totalPages || 1} 
          page={page} 
          onChange={handlePageChange} 
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
      <DeleteConfirmationModal
        open={isModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this review? This action cannot be undone."
      />
      {editingReview && (
        <ReviewForm
          open={!!editingReviewId}
          reviewId={editingReviewId}
          review={editingReview}
          onClose={handleCloseEdit}
          onReviewSubmit={() => {
            handleCloseEdit();
            loadReviews(page, perPage, userId || (isAdmin ? null : user?.id));
          }}
        />
      )}
    </Box>
  );
};

export default ReviewList;