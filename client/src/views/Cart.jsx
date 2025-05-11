import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Box, Button, IconButton, Popover, Typography, Alert, Stack, LinearProgress } from '@mui/material';
import { Storefront as StorefrontIcon, DeleteOutlineOutlined as DeleteOutlineOutlinedIcon, ShoppingCartOutlined as ShoppingCartOutlinedIcon, ProductionQuantityLimitsOutlined as ProductionQuantityLimitsOutlinedIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

import { getCart, updateCartItem, removeCartItem, clearCartMessages } from '../slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart = { items: [] }, loading, error, success } = useSelector((state) => state.cart);
  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);
  const id = isOpen ? 'cart-popover' : undefined;

  useEffect(() => {
    if (isOpen) {
      dispatch(getCart());
    }
  }, [dispatch, isOpen]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuantityChange = (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      return
    }
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem({ cartItemId }));
  };

  const getItemImage = (item) => {
    if (item.variant?.images?.length > 0) {
      return item.variant.images[0].url;
    }
    if (item.product?.images?.length > 0) {
      return item.product.images[0].url;
    }
    return '';
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <Box>
      <IconButton 
        color="inherit" 
        aria-describedby={id} 
        onClick={handleOpen}
      >
        <Badge badgeContent={cartItemCount} color="primary" 
          sx={{ 
            '& .MuiBadge-badge': {
              color: 'common.white',
              fontWeight: 700,
            }
          }}
        >
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ 
          width: { xs: 300, sm: 400 }, 
          maxHeight: 500,
          borderTop: '4px solid',
          borderColor: 'primary.main', 
        }}>
          {loading && (
            <LinearProgress/>
          )}
          <Box sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => dispatch(clearCartMessages())} sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" onClose={() => dispatch(clearCartMessages())} sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
            {!loading && cart?.items?.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <ProductionQuantityLimitsOutlinedIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  It looks like you haven't added anything yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/shop')}
                  startIcon={<StorefrontIcon />}
                >
                  Shop Products
                </Button>
              </Box>
            )}
            {cart?.items && cart.items.length > 0 && (
              <Stack spacing={2}>
                {cart.items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', py: 1,  alignItems: 'center', }}>
                    <Box sx={{ width: 80, height: 80, flexShrink: 0, border: 1, borderColor: 'grey.300', borderRadius: 2, overflow: 'hidden' }}>
                      <img
                        src={getItemImage(item)}
                        alt={item.product?.name || "Product"}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                          {item.product?.name || "Product"}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                      {item.variant?.name && (
                        <Typography variant="caption" color="text.secondary">
                          {item.variant.name}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'primary.main', borderRadius: 1, height: 28 }}>
                          <IconButton 
                            size="small"
                            disableRipple
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          >
                            <RemoveIcon fontSize="small" color="primary" />
                          </IconButton>
                          <Typography variant="body2" sx={{ px: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small"
                            disableRipple
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          >
                            <AddIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Box>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {cart?.items && cart.items.length > 0 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">Total</Typography>
                <Typography variant="body1" fontWeight="bold">${(cart.subtotal).toFixed(2)}</Typography>
              </Box>
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                fullWidth
                onClick={handleClose}
              >
                Proceed to Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default Cart;