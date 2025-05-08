import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Typography, Box, Button, Divider, IconButton, Paper, Rating, Chip, TextField, Card, CardContent, Tabs, Tab, ButtonGroup, Skeleton, Alert } from '@mui/material';

import { styled } from '@mui/material/styles';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import ReviewForm from '../review/ReviewForm';
import { addToCart } from '../../slices/cartSlice';
import { getReviews } from '../../slices/reviewSlice';
import { getProductBySlug } from '../../slices/productSlice';

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const ThumbnailImage = styled('img')({
  width: '64px',
  height: '64px',
  objectFit: 'cover',
  cursor: 'pointer',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
});

const SelectedThumbnail = styled(ThumbnailImage)({
  border: '2px solid #1976d2',
});

const VariantButton = styled(Button)(({ theme, selected }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  ...(selected && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));

const StockChip = styled(Chip)(({ theme, instock }) => ({
  backgroundColor: instock === 'true' ? theme.palette.success.light : theme.palette.error.light,
  color: instock === 'true' ? theme.palette.success.dark : theme.palette.error.dark,
  fontWeight: 500,
}));

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { product, loading, error } = useSelector((state) => state.product);
  const { reviews } = useSelector((state) => state.review);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
  }, [dispatch, slug]);
  
  useEffect(() => {
    if (product && product.id) {
      dispatch(getReviews({
        productId: product.id
      }));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 2, display: 'flex' }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={60} height={60} sx={{ mr: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={120} />
            <Skeleton variant="rectangular" height={100} />
            <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Product not found.</Alert>
      </Container>
    );
  }

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const handleAddToCart = () => {
    const productToAdd = selectedVariant ? selectedVariant : product;

    dispatch(addToCart({
      product_id: productToAdd.id,
      variant_id: selectedVariant ? selectedVariant.id : null,
      quantity,
    }));
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleReviewSubmit = () => {
    dispatch(getReviews({
      productId: product.id
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const productInStock = selectedVariant 
    ? selectedVariant.stock > 0 
    : (product.stock > 0 || product.total_stock > 0);

  const currentPrice = selectedVariant 
    ? (selectedVariant.sale_price || selectedVariant.price || selectedVariant.base_price)
    : (product.sale_price || product.base_price);
    
  const compareAtPrice = selectedVariant && selectedVariant.sale_price
    ? selectedVariant.base_price
    : product.compare_at_price;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        component={Link} 
        to="/shop" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        color="inherit"
      >
        Back to Shop
      </Button>

      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Box 
              sx={{ 
                height: 400, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: 1,
                position: 'relative'
              }}
            >
              {product.images && product.images.length > 0 ? (
                <ProductImage
                  src={product.images[currentImageIndex].url}
                  alt={product.name}
                />
              ) : (
                <Typography color="text.secondary">No image available</Typography>
              )}
              {product.is_featured && (
                <Chip
                  label="Featured"
                  color="secondary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                  }}
                />
              )}
            </Box>

            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {product.images.map((image, index) => (
                  index === currentImageIndex ? (
                    <SelectedThumbnail
                      key={image.id}
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                    />
                  ) : (
                    <ThumbnailImage
                      key={image.id}
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                    />
                  )
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            {reviews && reviews.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating 
                  value={product.average_rating || 0} 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
              <Typography variant="h5" component="span" color="primary.main" sx={{ fontWeight: 600 }}>
                ${parseFloat(currentPrice).toFixed(2)}
              </Typography>
              {compareAtPrice && (
                <Typography 
                  variant="body1" 
                  component="span" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through', ml: 2 }}
                >
                  ${parseFloat(compareAtPrice).toFixed(2)}
                </Typography>
              )}
            </Box>

            <Box 
              sx={{ mb: 3 }} 
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />

            {product.variants && product.variants.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Options
                </Typography>
                <Box>
                  {product.variants.map((variant) => (
                    <VariantButton
                      key={variant.id}
                      variant="outlined"
                      size="small"
                      selected={selectedVariant && selectedVariant.id === variant.id}
                      onClick={() => handleVariantChange(variant.id)}
                    >
                      {variant.name}
                    </VariantButton>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <StockChip
                label={productInStock ? 'In Stock' : 'Out of Stock'}
                instock={productInStock.toString()}
                size="small"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              disabled={!productInStock}
              sx={{ py: 1.5 }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Reviews" />
          <Tab label="Write a Review" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{review.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body2">{review.content}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="text.secondary">
                  No reviews yet. Be the first to leave a review!
                </Typography>
              )}
            </>
          )}
          
          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <ReviewForm productId={product.id} onReviewSubmit={handleReviewSubmit} />
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductDetail;