import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge, Box, Button, CircularProgress, IconButton, Paper, Popover, Typography, Alert, Stack } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

import { getCart, updateCartItem, removeCartItem, clearCart } from '../slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
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
      dispatch(removeCartItem({ cartItemId }));
    } else {
      dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem({ cartItemId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <>
      <IconButton 
        color="inherit" 
        aria-describedby={id} 
        onClick={handleOpen}
      >
        <Badge badgeContent={cartItemCount} color="primary">
          <ShoppingCartIcon />
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
        <Paper sx={{ width: { xs: 300, sm: 400 }, maxHeight: 500 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton size="small" onClick={handleClose}>
              ×
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {!loading && cart?.items?.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">Your cart is empty</Typography>
              </Box>
            )}

            {cart?.items && cart.items.length > 0 && (
              <Stack spacing={2}>
                {cart.items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', py: 1 }}>
                    <Box sx={{ width: 60, height: 60, flexShrink: 0, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                      <img
                        src={item.primary_image_url || "/api/placeholder/60/60"}
                        alt={item.product?.name || "Product"}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" noWrap>
                          {item.product?.name || "Product"}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                      
                      {item.variant?.name && (
                        <Typography variant="caption" color="text.secondary">
                          {item.variant.name}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
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
                <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">${cart.subtotal}</Typography>
              </Box>
              
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                
                <Button
                  component={Link}
                  to="/checkout"
                  variant="contained"
                  fullWidth
                  onClick={handleClose}
                >
                  Checkout
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default Cart;