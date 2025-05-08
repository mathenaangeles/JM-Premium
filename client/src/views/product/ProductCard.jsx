import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon }  from '@mui/icons-material';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating, Stack, Button } from '@mui/material';

import { addToCart } from '../../slices/cartSlice';

const ProductCard = ({ product }) => {
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
    const variantId =
      product.variants && product.variants.length > 0
        ? product.variants[0].id
        : null;
    dispatch(addToCart({
      product_id: product.id,
      variant_id: variantId,
      quantity: 1
    }));
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
              paddingTop: '100%', // 1:1 aspect ratio
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
            size="small"
            sx={{
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
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
        {variantCount > 0 && (
          <Chip
            label={`${variantCount} ${variantCount === 1 ? 'Option' : 'Options'}`}
            size="small"
            sx={{
              fontSize: '0.75rem',
              backgroundColor: '#F0F4F8',
              color: '#516F90',
              alignSelf: 'flex-start',
              mb: 0.5,
            }}
          />
        )}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
          {finalSalePrice > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
                fontSize: '0.85rem',
              }}
            >
              ${parseFloat(finalBasePrice).toFixed(2)}
            </Typography>
          )}
          <Typography 
            variant="h6" 
            sx={{ 
              color: finalSalePrice > 0 ? '#E5484D' : '#2A3548',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            ${parseFloat(product.display_price).toFixed(2)}
          </Typography>
            {finalSalePrice > 0 && (
              <>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  ml: 1,
                }}
              >
                {Math.round(discount)}% OFF
              </Typography>
              </>
            )}
          {!isInStock && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  mr: 0.75,
                  backgroundColor:'error.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Out of Stock
              </Typography>
            </Box>
          )}
        </Stack>
        <Button
          variant="contained"
          fullWidth
          disableElevation
          disabled={!isInStock}
          onClick={{handleAddToCart}}
          sx={{
            mt: 1,
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
