import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Chip, Divider, Grid, Paper, Alert, IconButton, LinearProgress } from '@mui/material';
import { Close as CloseIcon, Payment as PaymentIcon, Person as PersonIcon, CalendarToday as CalendarIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';

import { getPayment } from '../../slices/paymentSlice';

const PaymentDetail = ({ open, onClose, paymentId }) => {
  const dispatch = useDispatch();
  const { payment, loading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (open && paymentId) {
      dispatch(getPayment(paymentId));
    }
  }, [dispatch, paymentId, open]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatPaymentMethod = (method) => {
    return method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps= {{
        paper: {    
          sx: {
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 8,
          }
        }
      }}
    >
       <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Payment Details
            </Typography>
          </Box>
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
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <LinearProgress/>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Box>
        ) : !payment ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="warning">
              Payment could not be found.
            </Alert>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <MoneyIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    Payment Information
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                    Payment ID
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {payment.id}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                    Amount
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(payment.amount)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={payment.status}
                    size="medium"
                    sx={{ 
                      fontWeight: 600, 
                      textTransform: 'capitalize',
                      backgroundColor: getStatusStyles(payment.status).backgroundColor,
                      color: getStatusStyles(payment.status).color,
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {formatPaymentMethod(payment.payment_method)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    Customer Information
                  </Typography>
                </Box>
                {payment.user ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2"  color="secondary.main" fontWeight={600} gutterBottom>
                        Customer Name
                      </Typography>
                      <Typography variant="body1">
                        {payment.user.first_name || payment.user.last_name 
                          ? `${payment.user.first_name} ${payment.user.last_name}`
                          : 'Anonymous'
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {payment.user.email}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        +{payment.user.country_code} {payment.user.phone_number}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600} gutterBottom>
                        User ID
                      </Typography>
                      <Typography variant="body1">
                        {payment.user.id}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: { xs: 4, sm: 5 },
                      px: { xs: 2, sm: 3 },
                      backgroundColor: 'grey.100',
                      borderRadius: 3,
                      border: '1px dashed #CCCCCC',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      This purchase was made by a guest user.
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                      There are no use details associated with this payment.
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" color="secondary" />
                    <Typography variant="body2" color="secondary.main" fontWeight={600}>
                      Transaction Timeline
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="common.grey">
                      Created
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(payment.created_at)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="common.grey">
                      Last Updated
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(payment.updated_at)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetail;