import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Refresh as RefreshIcon, Payment as PaymentIcon, CreditCard as CreditCardIcon, AccountBalanceWallet as PayPalIcon } from '@mui/icons-material';
import { Select, FormControl, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Pagination, Alert, Chip, Grid, LinearProgress } from '@mui/material';

import PaymentDetailModal from './PaymentDetail';
import { getPayments, clearPaymentMessages } from '../../slices/paymentSlice';

const PaymentList = () => {
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [userId] = useState(null);
  const [status, setStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  const { payments, loading, error, count, totalPages } = useSelector((state) => state.payment);

  const loadPayments = useCallback(() => {
    dispatch(getPayments({ 
      page, 
      perPage, 
      userId, 
      status, 
      paymentMethod,
    }));
  }, [dispatch, page, perPage, userId, status, paymentMethod]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value === 'all' ? null : e.target.value);
    setPage(1);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value === 'all' ? null : e.target.value);
    setPage(1);
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'fulfilled':
        return { backgroundColor: 'primary.light', color: 'secondary.main' };
      case 'pending':
        return { backgroundColor: 'grey.100', color: 'common.grey' };
      case 'failed':
        return { backgroundColor: 'error.main', color: 'white' };
      default:
        return { backgroundColor: 'grey.100', color: 'common.grey' };
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return <CreditCardIcon fontSize="small" />;
      case 'paypal':
        return <PayPalIcon fontSize="small" />;
      default:
        return <PaymentIcon fontSize="small" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatPaymentMethod = (method) => {
    return method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const handlePaymentClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setShowPaymentDetail(true);
  };

  const handleClosePaymentDetail = () => {
    setShowPaymentDetail(false);
    setSelectedPaymentId(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearPaymentMessages())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" fontWeight={600} mb={3}>
        Manage Payments
      </Typography>
      <Grid container spacing={2} alignItems="flex-start" sx={{ my: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth size="small">
            <Select
              value={status || 'all'}
              onChange={handleStatusChange}
              displayEmpty
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="fulfilled">Fulfilled</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth size="small">
            <Select
              value={paymentMethod || 'all'}
              onChange={handlePaymentMethodChange}
              displayEmpty
            >
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{
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
            onClick={() => {
              setStatus(null);
              setPaymentMethod(null);
              setPage(1);
              setPerPage(10);
              setTimeout(() => loadPayments(), 0);
            }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0, pb: 2 }}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : ( payments?.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      onClick={() => handlePaymentClick(payment.id)}
                      style={{ 
                        fontWeight: 600,
                        color: 'inherit',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      {payment.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {payment.user ? (
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {payment.user.first_name || payment.user.last_name 
                            ? `${payment.user.first_name} ${payment.user.last_name}`
                            : 'Anonymous'
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.user.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Guest
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      size="small"
                      sx={{ 
                        fontWeight: 600, 
                        textTransform: 'capitalize',
                        backgroundColor: getStatusStyles(payment.status).backgroundColor,
                        color: getStatusStyles(payment.status).color,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPaymentMethodIcon(payment.payment_method)}
                      <Typography variant="body2">
                        {formatPaymentMethod(payment.payment_method)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(payment.created_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Typography variant="h6" color="text.primary" fontWeight={500}>
                      No payments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {status || paymentMethod 
                        ? 'Try adjusting your search or filters' 
                        : 'If this is not the expected result, please try refreshing the page.'
                      }
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 4 }}>
            {count > 0 
              ? `Showing ${(page - 1) * perPage + 1}-${Math.min(page * perPage, count)} of ${count}` 
              : 'No results found'
            }
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
      <PaymentDetailModal
        open={showPaymentDetail}
        onClose={handleClosePaymentDetail}
        paymentId={selectedPaymentId}
      />
    </Box>
  );
};

export default PaymentList;