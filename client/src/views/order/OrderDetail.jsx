import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Close as CloseIcon, Edit as EditIcon, Cancel as CancelIcon, ReceiptLong as ReceiptLongIcon, LocalShipping as LocalShippingIcon} from '@mui/icons-material';
import { IconButton, Divider, MenuItem, TextField, Collapse, Stepper, Step, StepLabel, FormControl, Alert, InputLabel, Select, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Chip, Grid, LinearProgress } from '@mui/material';

import { getOrder, cancelOrder, updateOrder, getGuestOrder, clearOrderMessages } from '../../slices/orderSlice';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { order, loading, error, success } = useSelector((state) => state.order);

    const [adminPanelOpen, setAdminPanelOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [editStatus, setEditStatus] = useState(order?.status || '');
    const [trackingNumber, setTrackingNumber] = useState(order?.tracking_number || '');

    useEffect(() => {
    if (orderId) {
        if (user) {
            dispatch(getOrder(orderId));
        } else {
            const email = localStorage.getItem('guestEmail');
            if (email) {
                dispatch(getGuestOrder({ orderId, email }));
            }
        }
    }
    }, [dispatch, orderId, navigate, user]);

    useEffect(() => {
        if (order) {
          setEditStatus(order.status || '');
          setTrackingNumber(order.tracking_number || '');
        }
    }, [order]);

    useEffect(() => {
        if (success) {
        setShowConfirmation(false);
        }
    }, [success]);

    const handleCancelOrder = () => {
        dispatch(cancelOrder(orderId));
        setShowConfirmation(false);
    };

    const handleUpdateOrder = () => {
        dispatch(updateOrder({
        orderId: order.id,
        orderData: {
            status: editStatus,
            tracking_number: trackingNumber || undefined,
        }
        }));
    };

    const getOrderStep = (status) => {
        switch (status) {
        case 'awaiting_payment': return 0;
        case 'processing': return 1;
        case 'shipped': return 2;
        case 'delivered': return 3;
        case 'completed': return 4;
        case 'cancelled': return -1;
        default: return 0;
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            awaiting_payment: { color: 'primary', label: 'Awaiting Payment' },
            processing: { color: 'primary', label: 'Processing' },
            shipped: {  color: 'primary', label: 'Shipped' },
            delivered: { color: 'primary', label: 'Delivered' },
            completed: { color: 'primary', label: 'Completed' },
            cancelled: { color: 'error', label: 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig.awaiting_payment;
    return (
      <Chip 
        icon={config.icon} 
        label={config.label} 
        color={config.color} 
        sx={{ fontWeight: 700, p: 0.5, color: 'common.white' }} 
      />
    );
  };

  if (loading) {
    return (
        <LinearProgress />
    );
  }

  if (!order && !loading) {
    return (
      <Box sx={{ bgcolor: 'common.white', minHeight: '100vh', py: 8, px: 2 }} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Order Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The order you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          component={Link}
          to="/shop"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Shop Now
        </Button>
      </Box>
    );
  }

  const canCancelOrder = user && user.is_admin === true && order && order.status === 'pending';
  const canEditOrder = user && user.is_admin === true;
  const activeStep = getOrderStep(order.status);

  return (
    <Box sx={{ minHeight: '100vh', p: 3, backgroundColor: 'secondary.main' }}>
        {error && (
            <Alert severity="error" onClose={() => dispatch(clearOrderMessages())} sx={{ mb: 3 }}>
            {error}
            </Alert>
        )}
        {success && (
        <Alert severity="success" onClose={() => dispatch(clearOrderMessages())} sx={{ mb: 3 }}>
            {success}
        </Alert>
        )}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  Order #{order.id}
              </Typography>
              <Box>
                  {getStatusChip(order.status)}
              </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" my={0.5}>
            Last Updated on {new Date(order.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          {order.status !== 'cancelled' && (
              <Box sx={{ my: 4, display: order.status === 'cancelled' ? 'none' : 'block' }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                  <Step>
                      <StepLabel>Awaiting Payment</StepLabel>
                  </Step>
                  <Step>
                      <StepLabel>Processing</StepLabel>
                  </Step>
                  <Step>
                      <StepLabel>Shipped</StepLabel>
                  </Step>
                  <Step>
                      <StepLabel>Delivered</StepLabel>
                  </Step>
                  </Stepper>
              </Box>
          )}
          {order.status === 'cancelled' && (
              <Alert severity="error" sx={{ my: 4 }}>This order has been cancelled.</Alert>
          )}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12}} >
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">Order Summary</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600}>Order Date</Typography>
                      <Typography variant="body1">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600}>Order Status</Typography>
                      <Typography variant="body1">
                        {order.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600}>Shipping Method</Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{order.shipping_method || 'Standard'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600}>Payment Method</Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{order.payment_method || 'Credit Card'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">Shipping Details</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    {order.user?.first_name} {order.user?.last_name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shipping_address?.line_1}
                    {order.shipping_address?.line_2 && <>, {order.shipping_address?.line_2}, </>}
                    {order.shipping_address?.city}, {order.shipping_address?.zip_code}, {order.shipping_address?.country}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {order.user?.email && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="secondary.main" fontWeight={600}>Email</Typography>
                        <Typography variant="body2">{order.user.email}</Typography>
                      </Grid>
                     )}
                    {order.user?.phone_number && (
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="secondary.main" fontWeight={600}>Phone Number</Typography>
                        <Typography variant="body2">+{order.user.country_code} {order.user.phone_number}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  {order.tracking_number && (
                    <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'primary.main', borderRadius: 2, backgroundColor: 'primary.light' }}>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 600 }}>
                        Tracking Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {order.tracking_number}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TableContainer variant="outlined" component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography
                              component={Link}
                              to={`/products/${item.product.slug}`}
                              fontWeight={600}
                              color="inherit"
                              variant="body2"
                              sx={{ '&:hover': { textDecoration: 'underline' } }}
                            >
                              {item.product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₱{item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>
                          ₱{Number(item.subtotal).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    {[
                      { label: 'Subtotal', value: order.subtotal },
                      { label: 'Shipping', value: order.shipping_cost },
                      { label: 'Tax', value: order.tax },
                      { label: 'Total', value: order.total, bold: true }
                    ].map((row) => (
                      <TableRow
                        key={row.label}
                        sx={{
                          '& .MuiTableCell-root': {
                            borderBottom: 'none',
                            pt: 0.8,
                            pb: row.bold? 2.5 : 0.5,
                            fontSize: row.bold ? '1.1rem' : '0.85rem',
                            fontWeight: row.bold ? 'bold' : 'normal',
                          },
                        }}
                      >
                        <TableCell colSpan={2} />
                        <TableCell>{row.label}:</TableCell>
                        <TableCell>₱{(row.value ?? 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
            <Grid size={{ xs: 12 }}>
              {canEditOrder && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={() => setAdminPanelOpen(!adminPanelOpen)}
                  sx={{ mr: 2 }}
                  startIcon={<EditIcon />}
                >
                  Update Order
                </Button>
              )}
              {canCancelOrder && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setShowConfirmation(true)}
                  startIcon={<CancelIcon />}
                >
                  Cancel Order
                </Button>
              )}
            </Grid>
            {canEditOrder && (
              <Grid size={{ xs: 12 }}>
                <Collapse in={adminPanelOpen}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <Grid container spacing={3} sx={{ my: 2}}>
                      <Grid size={{ xs: 12, sm: 6}}>
                        <FormControl fullWidth variant="outlined" size="small">
                          <InputLabel id="status-select-label">Status</InputLabel>
                          <Select
                            labelId="status-select-label"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="awaiting_payment">Awaiting Payment</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6}}>
                        <TextField
                          fullWidth
                          label="Tracking Number"
                          variant="outlined"
                          size="small"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g., 1Z1234567890"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUpdateOrder}
                        >
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Grid>
            )}
          </Grid>
        </Paper>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">
              Cancel Order
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setShowConfirmation(false)}
              sx={{ color: 'common.grey' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">Are you sure you want to cancel this order?{' '}<b>This action cannot be undone.</b></Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCancelOrder} color="error" variant="outlined">
            Cancel Order
          </Button>
          <Button onClick={() => setShowConfirmation(false)} color="primary" variant="contained">
            Keep Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails;