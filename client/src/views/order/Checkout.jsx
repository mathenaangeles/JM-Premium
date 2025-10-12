import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, LinearProgress, MenuItem, Fade, Modal, styled, Box, Button, Card, CardContent, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, Stack, TextField, Typography, Alert } from '@mui/material';
import { LocalMall as LocalMallIcon, Phone as PhoneIcon, Email as EmailIcon, Person as PersonIcon, Storefront as StorefrontIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon, Payment as PaymentIcon, LocalShipping as LocalShippingIcon, Home as HomeIcon, LocationCity as LocationCityIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

import { getCart } from '../../slices/cartSlice';
import countries from '../../constants/countries';
import SelectAddress from '../address/SelectAddress';
import { getUserAddresses } from '../../slices/addressSlice';
import { setPaymentFromOrder } from '../../slices/paymentSlice';
import { createOrder, clearOrderMessages } from '../../slices/orderSlice';

import jcbLogo from '../../assets/jcb.png'
import visaLogo from '../../assets/visa.png'
import gcashLogo from '../../assets/gcash.png'
import mastercardLogo from '../../assets/mastercard.png'

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
  const { loading: orderLoading, error } = useSelector((state) => state.order);
  
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
    shipping_method: 'local',
    payment_method: 'ewallet',
    ewallet_type: 'gcash',
    same_as_shipping: true,
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvn: '',
    cardholder_first_name: '',
    cardholder_last_name: '',
    cardholder_email: '',
    cardholder_phone_number: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showBillingAddressList, setShowBillingAddressList] = useState(false);
  const [showShippingAddressList, setShowShippingAddressList] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error')
  
  const isGuestCheckout = !user;

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);
  
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

     if (orderData.payment_method === 'card') {
      if (!orderData.card_number) errors.card_number = 'Card number is required';
      if (!orderData.expiry_month) errors.expiry_month = 'Expiry month is required';
      if (!orderData.expiry_year) errors.expiry_year = 'Expiry year is required';
      if (!orderData.cvn) errors.cvn = 'CVN is required';
      if (!orderData.cardholder_first_name && !orderData.first_name && !user?.first_name) {
        errors.cardholder_first_name = 'Cardholder first name is required';
      }
      if (!orderData.cardholder_last_name && !orderData.last_name && !user?.last_name) {
        errors.cardholder_last_name = 'Cardholder last name is required';
      }
      if (!orderData.cardholder_email && !orderData.email && !user?.email) {
        errors.cardholder_email = 'Cardholder email is required';
      }
      const cardholderPhone = orderData.cardholder_phone_number;
      if (!cardholderPhone) {
        errors.cardholder_phone_number = 'Cardholder phone number is required (e.g., +639123456789)';
      } else {
        const phonePattern = /^\+[0-9]\d{1,14}$/;
        if (!phonePattern.test(cardholderPhone)) {
          errors.cardholder_phone_number = 'Phone number must start with + followed by country code and 2-15 digits (e.g., +639123456789)';
        }
      }
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
    return cart.subtotal * 0.12;
  };
  
  const calculateShipping = () => {
    return orderData.shipping_method === 'express' ? 0.00 : 0.00; // TO DO: Change when shipping has been implemented.
  };
  
  const calculateTotal = () => {
    return cart.subtotal + calculateTax() + calculateShipping();
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.xendit.co/cards-session.min.js';
    script.async = true;
    script.onload = () => {
      const publicKey = import.meta.env.VITE_XENDIT_PUBLIC_KEY;
      if (!publicKey) {
        console.error("Xendit public key not set!");
        return;
      }
      window.Xendit.setPublishableKey(publicKey);
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const processCardPayment = async (paymentSessionId) => {
    return new Promise((resolve, reject) => {
      if (!window.Xendit || !window.Xendit.payment) {
        reject(new Error('Xendit payment session not loaded.'));
        return;
      }
      const cardData = {
        card_number: orderData.card_number.replace(/\s/g, ''),
        expiry_month: orderData.expiry_month,
        expiry_year: orderData.expiry_year,
        cvn: orderData.cvn,
        cardholder_first_name: orderData.cardholder_first_name || orderData.first_name,
        cardholder_last_name: orderData.cardholder_last_name || orderData.last_name,
        cardholder_email: orderData.cardholder_email || orderData.email,
        cardholder_phone_number: orderData.cardholder_phone_number || orderData.phone_number,
        payment_session_id: paymentSessionId
      };
      window.Xendit.payment.collectCardData(cardData, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    let payment_method = null;
    let ewallet_type = null;
    if (orderData.payment_method === 'gcash') {
      payment_method = 'EWALLET';
      ewallet_type = 'GCASH';
    } else if (orderData.payment_method === 'card') {
      payment_method = 'CREDIT_CARD';
    } else {
      console.error("Unsupported payment method was selected.");
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
      email: orderData.email || user?.email || '',
      first_name: orderData.first_name || user?.first_name || '',
      last_name: orderData.last_name || user?.last_name || '',
      country_code: orderData.country_code || user?.country_code || '',
      phone_number: orderData.phone_number || user?.phone_number || '',
      shipping_method: orderData.shipping_method,
      tax: calculateTax(),
      shipping_cost: calculateShipping(),
      amount: calculateTotal(),
      payment_method,
      ewallet_type,
      card_number: orderData.card_number ||  '',
      expiry_month: orderData.expiry_month ||  '',
      expiry_year: orderData.expiry_year || '',
      cvn: orderData.cvn || '',
      cardholder_first_name:  orderData.cardholder_first_name || '',
      cardholder_last_name: orderData.cardholder_last_name || '',
      cardholder_email: orderData.cardholder_email || '',
      cardholder_phone_number: orderData.cardholder_phone_number || '',
    };
    try {
      const orderResult = await dispatch(createOrder(formattedData));
      if (orderResult.error) {
        return;
      }
      const { order, payment, checkout_url, payment_session_id } = orderResult.payload;
      if (payment_method === 'CREDIT_CARD' && payment_session_id) {
        try {
          const cardResponse = await processCardPayment(payment_session_id);
          if (cardResponse.action_url) {
            window.location.href = cardResponse.action_url;
          } else if (cardResponse.status === 'SUCCEEDED') {
            navigate(`/orders/${order.id}`);
          } else {
            console.log('Payment session still active, waiting for completion.');
          }
        } catch (err) {
          console.error("Card processing failed:", err);
          navigate(`/orders/${order.id}`);
        }
      } else {
        if (payment) {
          dispatch(setPaymentFromOrder({ payment, checkout_url }));
        }
        if (!user && formattedData.email) {
          localStorage.setItem('guestEmail', formattedData.email);
        }
        if (checkout_url) {
          window.location.href = checkout_url;
        } else if (order?.id) {
          navigate(`/orders/${order.id}`);
        }
      }
    } catch (error) {
      console.error("Order submission failed:", error);
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
                          value="local"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "secondary.main" }}>Local Shipping – FREE</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Available nationwide. No minimum order required.
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="international"
                          control={<Radio color="primary" />}
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "secondary.main" }}>International Shipping</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Rates vary by country and will be calculated upon order confirmation.
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
                  <FormControl component="fieldset" sx={{  width: '100%', }}>
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
                             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box
                                  component="img"
                                  src={gcashLogo}
                                  alt="GCash"
                                  sx={{ width: 90, height: 'auto' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  Pay with your GCash wallet.
                                </Typography>
                              </Box>
                          }
                        />
                      </Paper>              
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <FormControlLabel
                          value="card"
                          control={<Radio color="primary" />}
                          label={
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>  
                                <Box
                                  component="img"
                                  src={visaLogo}
                                  alt="Credit/Debit"
                                  sx={{ width: 50, height: 'auto' }}
                                />
                                <Box
                                  component="img"
                                  src={mastercardLogo}
                                  alt="Credit/Debit"
                                  sx={{ width: 50, height: 'auto' }}
                                />
                                <Box
                                  component="img"
                                  src={jcbLogo}
                                  alt="Credit/Debit"
                                  sx={{ width: 50, height: 'auto' }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Pay with a Visa, Mastercard, or JCB card.
                              </Typography>
                            </Box>
                          }
                        />
                        {orderData.payment_method === 'card' && (
                          <Box sx={{ mt: 4, pl: 4 }}>
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12 }}>
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
                              <Grid size={{ xs: 4 }}>
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
                                  slotProps={{
                                    htmlInput: {
                                      min: 1,
                                      max: 12
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid size={{ xs: 4 }}>
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
                                  slotProps={{
                                    htmlInput: {
                                      min: new Date().getFullYear()
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid size={{ xs: 4 }}>
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
                              <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                  fullWidth
                                  label="Cardholder First Name"
                                  name="cardholder_first_name"
                                  value={orderData.cardholder_first_name}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_first_name}
                                  helperText={validationErrors.cardholder_first_name}
                                  placeholder="Juan"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                  fullWidth
                                  label="Cardholder Last Name"
                                  name="cardholder_last_name"
                                  value={orderData.cardholder_last_name}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_last_name}
                                  helperText={validationErrors.cardholder_last_name}
                                  placeholder="Dela Cruz"
                                />
                              </Grid>
                              <Grid size={{ xs: 12 }}>
                                <TextField
                                  fullWidth
                                  label="Cardholder Email"
                                  name="cardholder_email"
                                  type="email"
                                  value={orderData.cardholder_email}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_email}
                                  helperText={validationErrors.cardholder_email}
                                  placeholder="juan@example.com"
                                />
                              </Grid>
                              <Grid size={{ xs: 12}}>
                                 <TextField
                                  fullWidth
                                  label="Cardholder Phone Number"
                                  name="cardholder_phone_number"
                                  value={orderData.cardholder_phone_number}
                                  onChange={handleInputChange}
                                  error={!!validationErrors.cardholder_phone_number}
                                  helperText={validationErrors.cardholder_phone_number}
                                  variant="outlined"
                                  placeholder="+639171231234"
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
                  disabled={orderLoading || !cart?.items?.length}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {orderLoading ? (
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
    <Snackbar
      open={snackbarOpen}
      onClose={() => {
        setSnackbarOpen(false);
        dispatch(clearOrderMessages());
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => {
          setSnackbarOpen(false);
          dispatch(clearOrderMessages());
        }}
        severity={snackbarSeverity}
        variant="filled"
        sx={{ 
          minWidth: '300px',
          boxShadow: 3
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </Box>
  );
};

export default Checkout;