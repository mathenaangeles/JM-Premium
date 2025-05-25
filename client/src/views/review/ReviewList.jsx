import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { RateReview as ReviewIcon, Refresh as RefreshIcon, CheckCircle as ApprovedIcon, Cancel as NotApprovedIcon, Verified as VerifiedIcon, Close as NotVerifiedIcon } from '@mui/icons-material';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert, Chip, Grid, LinearProgress, Pagination, FormControl, Select, MenuItem, Rating, Avatar } from '@mui/material';

import { getReviews, clearReviewMessages } from '../../slices/reviewSlice'; 

const ReviewList = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); 
  const { reviews, loading, error, totalPages, currentPage, count } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.user); 

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [approvalFilter, setApprovalFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  
  const isAdmin = user?.is_admin;

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

  const handleApprovalFilterChange = (e) => {
    setApprovalFilter(e.target.value);
  };

  const handleVerificationFilterChange = (e) => {
    setVerificationFilter(e.target.value);
  };

  const resetFilters = () => {
    setApprovalFilter('');
    setVerificationFilter('');
    setPage(1);
    loadReviews(1, perPage, userId || (isAdmin ? null : user?.id));
  };

  const getStatusColor = (isApproved) => {
    return isApproved ? 'success' : 'warning';
  };

  const getVerificationColor = (isVerified) => {
    return isVerified ? 'primary' : 'default';
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
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ minWidth: 200 }}
              >
                <Select
                  value={approvalFilter}
                  onChange={handleApprovalFilterChange}
                  displayEmpty
                  placeholder="Approval Status"
                >
                  <MenuItem value="">All Reviews</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending Approval</MenuItem>
                </Select>
              </FormControl>
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ minWidth: 200 }}
              >
                <Select
                  value={verificationFilter}
                  onChange={handleVerificationFilterChange}
                  displayEmpty
                  placeholder="Verification Status"
                >
                  <MenuItem value="">All Reviews</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="unverified">Unverified</MenuItem>
                </Select>
              </FormControl>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0, pb: 2 }}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : reviews?.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/reviews/${review.id}`}
                      variant="body2"
                      fontWeight={600}
                      color="inherit"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      {review.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/reviews/${review.product?.slug}`}
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
                        icon={review.is_approved ? <ApprovedIcon /> : <NotApprovedIcon />}
                        label={review.is_approved ? 'Approved' : 'Pending'}
                        size="small"
                        color={getStatusColor(review.is_approved)}
                        variant={review.is_approved ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell>
                      <Chip
                        icon={review.is_verified ? <VerifiedIcon /> : <NotVerifiedIcon />}
                        label={review.is_verified ? 'Verified' : 'Unverified'}
                        size="small"
                        color={getVerificationColor(review.is_verified)}
                        variant={review.is_verified ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 500 }}
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
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
    </Box>
  );
};

export default ReviewList;