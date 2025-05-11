import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating, Stack, Button } from '@mui/material';
import { AddShoppingCartOutlined as AddShoppingCartOutlinedIcon, ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon }  from '@mui/icons-material';

import { addToCart } from '../../slices/cartSlice';

const ProductCard = ({ product, onAddToCartSuccess = null }) => {
  const dispatch = useDispatch();

  if (!product || !product.is_active) return null;

  const isInStock = product.total_stock > 0;
  const imageUrl = product.images?.[0]?.url || '';
  const reviewCount = product.reviews?.length || 0;
  const variantCount = product.variants?.length || 0;
  const finalSalePrice = product.variants?.length > 0 ? product.variants[0].sale_price : product.sale_price;
  const finalBasePrice = product.variants?.length > 0 ? product.variants[0].base_price : product.base_price; 
  const discount = finalBasePrice > 0 ? (finalBasePrice - finalSalePrice) / finalBasePrice * 100 : 0;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const variantId =
      product.variants && product.variants.length > 0
        ? product.variants[0].id
        : null;
    dispatch(addToCart({
      product_id: product.id,
      variant_id: variantId,
      quantity: 1
    }));
    if (typeof onAddToCartSuccess === 'function') {
      onAddToCartSuccess();
    }
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
        },
        borderRadius: 2,
        overflow: 'hidden',
        textDecoration: 'none',
        position: 'relative',
      }}
      component={Link}
      to={`/products/${product.slug}`}
    >
      <Box sx={{ position: 'relative' }}>
        {product.images?.length > 0 ? (
          <CardMedia
            image={imageUrl}
            title={product.name}
            alt={product.name}
            sx={{
              paddingTop: '100%',
              backgroundColor: '#F5F5F5',
              position: 'relative',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              backgroundColor: '#F5F5F5',
              color: 'grey.500',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: "grey.500"
              }}
            >
              <ImageNotSupportedOutlinedIcon fontSize="large" />
            </Box>
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {product.is_featured && (
          <Chip
            label="Featured"
            color="secondary"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}
        </Box>
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2,
        '&:last-child': { 
          paddingBottom: 2.5 
        }, 
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '1.2rem',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.5,
          }}
        >
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={product.average_rating}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({reviewCount})
          </Typography>
        </Box>
        {variantCount > 1 && (
          <Chip
            label={`${variantCount} Options`}
            size="small"
            sx={{
              fontSize: '0.75rem',
              backgroundColor: 'grey.100',
              color: 'common.grey',
              alignSelf: 'flex-start',
              mb: 0.5,
            }}
          />
        )}
        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 'auto', flexWrap: 'wrap' }}>
          {finalSalePrice > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'common.grey',
              }}
            >
              ${parseFloat(finalBasePrice).toFixed(2)}
            </Typography>
          )}
          <Typography 
            variant="body1" 
            color="primary"
            sx={{ 
              color: finalSalePrice > 0 ? 'primary.main' : 'text.primary',
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
          >
            ${parseFloat(product.display_price).toFixed(2)}
          {finalSalePrice > 0 && (
            <Chip
              label={`${Math.round(discount)}% OFF`}
              size="small"
              sx={{
                ml: 1,
                bgcolor: 'red',
                color: 'white',
                fontWeight: 500,
              }}
            />
          )}
          </Typography>
        </Stack>
        {isInStock ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                mr: 0.75,
                backgroundColor: '#4CAF50',
              }}
            />
            <Typography variant="caption" sx={{ color: 'common.grey' }}>
              In Stock
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                mr: 0.75,
                backgroundColor: '#E5484D',
              }}
            />
            <Typography variant="caption" sx={{ color: 'common.grey' }}>
              Out of Stock
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          fullWidth
          disableElevation
          disabled={!isInStock}
          onClick={handleAddToCart}
          sx={{
            mt: 1,
          }}
          startIcon={<AddShoppingCartOutlinedIcon />}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
