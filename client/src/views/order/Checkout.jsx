import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinearProgress, MenuItem, Fade, Modal, styled, Box, Button, Card, CardContent, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, Stack, TextField, Typography, Alert } from '@mui/material';
import { LocalMall as LocalMallIcon, Phone as PhoneIcon, Email as EmailIcon, Person as PersonIcon, Storefront as StorefrontIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon, Payment as PaymentIcon, LocalShipping as LocalShippingIcon, Home as HomeIcon, LocationCity as LocationCityIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

import { getCart } from '../../slices/cartSlice';
import countries from '../../constants/countries';
import SelectAddress from '../address/SelectAddress';
import { getUserAddresses } from '../../slices/addressSlice';
import { createOrder, payOrder, clearOrderMessages } from '../../slices/orderSlice';
import { createPaymentRequest, clearPaymentMessages } from '../../slices/paymentSlice';

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  }
}));

const OrderItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1.5),
}));

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.user);
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { addresses } = useSelector((state) => state.address);
  const { loading: orderLoading, error, success, order } = useSelector((state) => state.order);
  const { loading: paymentLoading, error: paymentError, success: paymentSuccess, payment, actions, xenditStatus, xenditResponse } = useSelector((state) => state.payment);
  
  const [orderData, setOrderData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    country_code: '',
    phone_number: '',
    shipping_address_id: '',
    shipping_line_1: '',
    shipping_line_2: '',
    shipping_city: '',
    shipping_zip_code: '',
    shipping_country: '',
    billing_address_id: '',
    billing_line_1: '',
    billing_line_2: '',
    billing_city: '',
    billing_zip_code: '',
    billing_country: '',
    shipping_method: 'standard',
    payment_method: 'gcash',
    same_as_shipping: true,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showBillingAddressList, setShowBillingAddressList] = useState(false);
  const [showShippingAddressList, setShowShippingAddressList] = useState(false);
  
  const isGuestCheckout = !user;
  
  useEffect(() => {
    dispatch(getCart());
    if (user) {
      dispatch(getUserAddresses());
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(address => address.is_default) || addresses[0];
      setOrderData(prev => ({
        ...prev,
        shipping_address_id: defaultAddress.id || '',
        shipping_line_1: defaultAddress.line_1 || '',
        shipping_line_2: defaultAddress.line_2 || '',
        shipping_city: defaultAddress.city || '',
        shipping_zip_code: defaultAddress.zip_code || '',
        shipping_country: defaultAddress.country || '',
      }));
    }
  }, [addresses]);
  
  useEffect(() => {
    if (orderData.same_as_shipping) {
      setOrderData(prev => ({
        ...prev,
        billing_address_id: prev.shipping_address_id,
        billing_line_1: prev.shipping_line_1,
        billing_line_2: prev.shipping_line_2,
        billing_city: prev.shipping_city,
        billing_zip_code: prev.shipping_zip_code,
        billing_country: prev.shipping_country,
      }));
    }
  }, [
    orderData.shipping_address_id, 
    orderData.shipping_line_1, 
    orderData.shipping_line_2, 
    orderData.shipping_city, 
    orderData.shipping_zip_code, 
    orderData.shipping_country,
    orderData.same_as_shipping
  ]);

  useEffect(() => {
  if (success && order) {
    if (!user && orderData.email) {
      localStorage.setItem('guestEmail', orderData.email);
    }
    navigate(`/orders/${order.id}`);
  }
}, [success, order, navigate, orderData.email, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setOrderData({
      ...orderData,
      [name]: checked
    });
  };
  
  const handleAddressSelection = (type, address) => {
    if (type === 'shipping') {
      setOrderData({
        ...orderData,
        shipping_address_id: address.id,
        shipping_line_1: address.line_1,
        shipping_line_2: address.line_2,
        shipping_city: address.city,
        shipping_zip_code: address.zip_code,
        shipping_country: address.country
      });
      setShowShippingAddressList(false);
    } else {
      setOrderData({
        ...orderData,
        billing_address_id: address.id,
        billing_line_1: address.line_1,
        billing_line_2: address.line_2,
        billing_city: address.city,
        billing_zip_code: address.zip_code,
        billing_country: address.country
      });
      setShowBillingAddressList(false);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (isGuestCheckout) {
      if (!orderData.email) errors.email = 'Email is required';
      if (!orderData.first_name) errors.first_name = 'First name is required';
      if (!orderData.last_name) errors.last_name = 'Last name is required';
      if (!orderData.country_code) errors.country_code = 'Country code is required';
      if (!orderData.phone_number) errors.phone_number = 'Phone number is required';
    }
    
    if (!orderData.shipping_address_id) {
      if (!orderData.shipping_line_1) errors.shipping_line_1 = 'Street address for shipping is required';
      if (!orderData.shipping_city) errors.shipping_city = 'City for shipping is required';
      if (!orderData.shipping_zip_code) errors.shipping_zip_code = 'Postal code for shipping is required';
      if (!orderData.shipping_country) errors.shipping_country = 'Country for shipping is required';
    }
    
    if (!orderData.same_as_shipping && !orderData.billing_address_id) {
      if (!orderData.billing_line_1) errors.billing_line_1 = 'Street address for billing is required';
      if (!orderData.billing_city) errors.billing_city = 'City for billing is required';
      if (!orderData.billing_zip_code) errors.billing_zip_code = 'Postal code for billing is required';
      if (!orderData.billing_country) errors.billing_country = 'Country for billing is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const calculateTax = () => {
    return cart.subtotal * 0.03;
  };
  
  const calculateShipping = () => {
    return orderData.shipping_method === 'express' ? 20.00 : 10.00; // TO DO: Change for production.
  };
  
  const calculateTotal = () => {
    return cart.subtotal + calculateTax() + calculateShipping();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formattedData = {
      shipping_address_id: orderData.shipping_address_id || null,
      billing_address_id: orderData.same_as_shipping 
        ? orderData.shipping_address_id 
        : orderData.billing_address_id || null,
      shipping_line_1: orderData.shipping_line_1,
      shipping_line_2: orderData.shipping_line_2,
      shipping_city: orderData.shipping_city,
      shipping_zip_code: orderData.shipping_zip_code,
      shipping_country: orderData.shipping_country,
      billing_line_1: !orderData.same_as_shipping ? orderData.billing_line_1 : null,
      billing_line_2: !orderData.same_as_shipping ? orderData.billing_line_2 : null,
      billing_city: !orderData.same_as_shipping ? orderData.billing_city : null,
      billing_zip_code: !orderData.same_as_shipping ? orderData.billing_zip_code : null,
      billing_country: !orderData.same_as_shipping ? orderData.billing_country : null,
      email: orderData.email || (user?.email || ''),
      first_name: orderData.first_name || (user?.first_name || ''),
      last_name: orderData.last_name || (user?.last_name || ''),
      country_code: orderData.country_code || (user?.country_code || ''),
      phone_number: orderData.phone_number || (user?.phone_number || ''),
      shipping_method: orderData.shipping_method,
      tax: calculateTax(),
      shipping_cost: calculateShipping(),
    };
    
    try {
      const orderResult = await dispatch(createOrder(formattedData));
      if (orderResult.error) {
        return;
      }
      const orderId = orderResult.payload?.order?.id;
      if (!orderId) {
        return;
      }
      const paymentData = {
        amount: calculateTotal(),
        currency: 'PHP',
        description: `Order #${orderId} Payment`,
        user_id: user?.id || null,
        payment_method: orderData.payment_method === 'card' ? 'CREDIT_CARD' : 'EWALLET',
        ewallet_type: orderData.payment_method === 'card' ? undefined : orderData.payment_method,
        order_id: orderId,
        ...(orderData.payment_method === 'card' && {
          card_number: orderData.card_number,
          expiry_month: orderData.expiry_month,
          expiry_year: orderData.expiry_year,
          cvn: orderData.cvn,
          cardholder_name: orderData.cardholder_name,
          cardholder_email: orderData.cardholder_email || orderData.email || user?.email,
          skip_three_ds: orderData.skip_three_ds,
        })
      };
      const paymentResult = await dispatch(createPaymentRequest(paymentData));
      if (paymentResult.error) {
        return;
      }
      const paymentId = paymentResult.payload?.payment?.id;
      if (!paymentId) {
        return;
      }
      await dispatch(payOrder({
        orderId: orderId,
        orderData: {
          payment_id: paymentId,
        }
      }));
      const checkoutUrl = paymentResult.payload?.actions?.find(action => action.url_type === 'CHECKOUT')?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      console.log(error);
      return; 
    }
  };

  if (cartLoading || !cart) {
    return (<LinearProgress/>);
  }
  
  
  if (cart?.items?.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', p: 3, backgroundColor: 'primary.main' }}>
        <Card sx={{ borderRadius: 2, height: '100%', py: 4 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            <Typography variant="h4" gutterBottom color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.disabled">
              It looks like you have not added anything to your cart yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/shop')}
              startIcon={<StorefrontIcon />}
              sx={{ mt: 2 }}
              size="large"
            >
              Shop Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }
  
  return (
    <Box sx={{  p: 4, minHeight: '100vh', backgroundColor: 'primary.main' }}>
      {(error || paymentError) && (
        <Alert severity="error" onClose={() => dispatch(clearOrderMessages())} sx={{ mb: 3 }}>
          {error || paymentError}
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  Checkout
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -6,
                    left: 0,
                    height: '3px',
                    width: '50px',
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                  }}
                />
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                {isGuestCheckout && (
                  <Box mb={4}>
                    <SectionTitle variant="h6">
                      <PersonIcon /> Contact Information
                    </SectionTitle>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={orderData.email}
                          onChange={handleInputChange}
                          error={!!validationErrors.email}
                          helperText={validationErrors.email}
                          variant="outlined"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="action" />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={orderData.first_name}
                          onChange={handleInputChange}
                          error={!!validationErrors.first_name}
                          helperText={validationErrors.first_name}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          value={orderData.last_name}
                          onChange={handleInputChange}
                          error={!!validationErrors.last_name}
                          helperText={validationErrors.last_name}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                          select
                          fullWidth
                          label="Country Code"
                          name="country_code"
                          value={orderData.country_code}
                          onChange={handleInputChange}
                          variant="outlined"
                          error={!!validationErrors.country_code}
                          helperText={validationErrors.country_code}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.name} value={country.code}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          value={orderData.phone_number}
                          onChange={handleInputChange}
                          error={!!validationErrors.phone_number}
                          helperText={validationErrors.phone_number}
                          variant="outlined"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon color="action" />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                <Box mb={4}>
                  <SectionTitle variant="h6">
                    <HomeIcon /> Shipping Address
                  </SectionTitle>
                  {user && (
                    <Box mb={4}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<LocationCityIcon />}
                        onClick={() => setShowShippingAddressList(true)}
                      >
                        Select from Saved Addresses
                      </Button>
                    </Box>
                  )}
                  <Modal 
                    sx = {{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    open={showShippingAddressList}
                    onClose={() => setShowShippingAddressList(false)}
                    closeAfterTransition
                    slotProps = {{
                      backdrop: {
                        timeout: 500
                      }
                    }}
                  >
                    <Fade in={showShippingAddressList}>
                      <Box>
                        <SelectAddress 
                          title="Select Shipping Address"
                          addresses={addresses}
                          onSelect={(address) => handleAddressSelection('shipping', address)}
                          onClose={() => setShowShippingAddressList(false)}
                          addressType="shipping"
                        />
                      </Box>
                    </Fade>
                  </Modal>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        name="shipping_line_1"
                        value={orderData.shipping_line_1}
                        onChange={handleInputChange}
                        error={!!validationErrors.shipping_line_1}
                        helperText={validationErrors.shipping_line_1}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Address Line 2"
                        name="shipping_line_2"
                        value={orderData.shipping_line_2}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="City"
                        name="shipping_city"
                        value={orderData.shipping_city}
                        onChange={handleInputChange}
                        error={!!validationErrors.shipping_city}
                        helperText={validationErrors.shipping_city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        name="shipping_zip_code"
                        value={orderData.shipping_zip_code}
                        onChange={handleInputChange}
                        error={!!validationErrors.shipping_zip_code}
                        helperText={validationErrors.shipping_zip_code}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                          select
                          fullWidth
                          label="Country"
                          name="shipping_country"
                          value={orderData.shipping_country}
                          onChange={handleInputChange}
                          variant="outlined"
                          error={!!validationErrors.shipping_country}
                          helperText={validationErrors.shipping_country}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.name} value={country.name.replace(/\s*\(.*\)/, '')}>
                              {country.name.replace(/\s*\(.*\)/, '')}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={4}>
                  <SectionTitle variant="h6">
                    <LocalShippingIcon /> Shipping Method
                  </SectionTitle>
                  <FormControl component="fieldset" sx={{  width: '100%', }}>
                    <RadioGroup
                      name="shipping_method"
                      value={orderData.shipping_method}
                      onChange={handleInputChange}
                    >
                      <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="standard"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>Standard Shipping</Typography>
                              <Typography variant="body2" color="text.secondary">
                                ₱10.00 - Delivery in 5 - 7 business days
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="express"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>Express Shipping</Typography>
                              <Typography variant="body2" color="text.secondary">
                                ₱20.00 - Delivery in 2 - 3 business days
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box mb={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={orderData.same_as_shipping}
                        onChange={handleCheckboxChange}
                        name="same_as_shipping"
                        color="primary"
                      />
                    }
                    label="Billing Address same as Shipping Address"
                  />
                </Box>
                {!orderData.same_as_shipping && (
                  <Box mb={4}>
                    <SectionTitle variant="h6">
                      <HomeIcon /> Billing Address
                    </SectionTitle>
                    {user && (
                      <Box mb={4}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<LocationCityIcon />}
                          onClick={() => setShowBillingAddressList(true)}
                        >
                          Select from Saved Addresses
                        </Button>
                      </Box>
                    )}
                    <Modal
                      sx = {{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      open={showBillingAddressList}
                      onClose={() => setShowBillingAddressList(false)}
                      closeAfterTransition
                      slotProps = {{
                        backdrop: {
                          timeout: 500
                        }
                      }}
                    >
                      <Fade in={showBillingAddressList}>
                        <Box>
                          <SelectAddress 
                            title="Select Billing Address"
                            addresses={addresses}
                            onSelect={(address) => handleAddressSelection('billing', address)}
                            onClose={() => setShowBillingAddressList(false)}
                            addressType="billing"
                          />
                        </Box>
                      </Fade>
                    </Modal>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address Line 1"
                          name="billing_line_1"
                          value={orderData.billing_line_1}
                          onChange={handleInputChange}
                          error={!!validationErrors.billing_line_1}
                          helperText={validationErrors.billing_line_1}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address Line 2"
                          name="billing_line_2"
                          value={orderData.billing_line_2}
                          onChange={handleInputChange}
                          error={!!validationErrors.billing_line_2}
                          helperText={validationErrors.billing_line_2}
                          variant="outlined"
                        />
                      </Grid>    
                      <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="City"
                        name="billing_city"
                        value={orderData.billing_city}
                        onChange={handleInputChange}
                        error={!!validationErrors.billing_city}
                        helperText={validationErrors.billing_city}
                        variant="outlined"
                      />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="ZIP Code"
                          name="billing_zip_code"
                          value={orderData.billing_zip_code}
                          onChange={handleInputChange}
                          error={!!validationErrors.billing_zip_code}
                          helperText={validationErrors.billing_zip_code}
                          variant="outlined"
                        />
                      </Grid>   
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="Country"
                            name="billing_country"
                            value={orderData.billing_country}
                            onChange={handleInputChange}
                            variant="outlined"
                            error={!!validationErrors.billing_country}
                            helperText={validationErrors.billing_country}
                          >
                            {countries.map((country) => (
                              <MenuItem key={country.name} value={country.name.replace(/\s*\(.*\)/, '')}>
                                {country.name.replace(/\s*\(.*\)/, '')}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>               
                    </Grid>
                  </Box>
                )}
                <Box mb={4}>
                  <SectionTitle variant="h6">
                    <PaymentIcon /> Payment Method
                  </SectionTitle>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="payment_method"
                      value={orderData.payment_method}
                      onChange={handleInputChange}
                    >
                      <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="gcash"
                          control={<Radio color="primary" />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PaymentIcon sx={{ mr: 1, color: '#007BC7' }} />
                              <Box>
                                <Typography variant="body1">GCash</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Pay using your GCash wallet
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </Paper>

                      <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="paymaya"
                          control={<Radio color="primary" />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PaymentIcon sx={{ mr: 1, color: '#00A8E6' }} />
                              <Box>
                                <Typography variant="body1">PayMaya</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Pay using your PayMaya wallet
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </Paper>
                      
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="card"
                          control={<Radio color="primary" />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CreditCardIcon sx={{ mr: 1 }} />
                              <Box>
                                <Typography variant="body1">Credit/Debit Card</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Visa, Mastercard, JCB, American Express
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        
                        {/* Card Form - Show only when card is selected */}
                        {orderData.payment_method === 'card' && (
                          <Box sx={{ mt: 2, pl: 4 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Card Number"
                                  name="card_number"
                                  value={orderData.card_number}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.card_number}
                                  helperText={validationErrors.card_number}
                                  placeholder="1234 5678 9012 3456"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Expiry Month"
                                  name="expiry_month"
                                  type="number"
                                  value={orderData.expiry_month}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.expiry_month}
                                  helperText={validationErrors.expiry_month}
                                  placeholder="MM"
                                  inputProps={{ min: 1, max: 12 }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Expiry Year"
                                  name="expiry_year"
                                  type="number"
                                  value={orderData.expiry_year}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.expiry_year}
                                  helperText={validationErrors.expiry_year}
                                  placeholder="YYYY"
                                  inputProps={{ min: new Date().getFullYear() }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="CVV"
                                  name="cvn"
                                  value={orderData.cvn}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cvn}
                                  helperText={validationErrors.cvn}
                                  placeholder="123"
                                  inputProps={{ maxLength: 4 }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Cardholder Name"
                                  name="cardholder_name"
                                  value={orderData.cardholder_name}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_name}
                                  helperText={validationErrors.cardholder_name}
                                  placeholder="John Doe"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Cardholder Email"
                                  name="cardholder_email"
                                  type="email"
                                  value={orderData.cardholder_email}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_email}
                                  helperText={validationErrors.cardholder_email}
                                  placeholder="john@example.com"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={orderData.skip_three_ds}
                                      onChange={handleCheckboxChange}
                                      name="skip_three_ds"
                                    />
                                  }
                                  label="Skip 3D Secure (not recommended)"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Paper>
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={orderLoading || paymentLoading || !cart?.items?.length}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {orderLoading || paymentLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Complete Order`
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle variant="h6">
                <LocalMallIcon /> Order Summary
              </SectionTitle>
              <Box mb={3}>
                {cart?.items?.map((item) => (
                  <OrderItem key={item.id}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.product?.name || "Product"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </OrderItem>
                ))}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body1">₱{cart.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">Tax</Typography>
                  <Typography variant="body1">₱{calculateTax().toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" color="text.secondary">Shipping</Typography>
                  <Typography variant="body1">₱{calculateShipping().toFixed(2)}</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>₱{calculateTotal().toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
    </Grid>
  </Box>
  );
};

export default Checkout;