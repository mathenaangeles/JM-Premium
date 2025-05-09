import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, Tooltip, ListItemIcon, Collapse, ListItemText, Container, Grid, Typography, Box, Button, Breadcrumbs, IconButton, Paper, Rating, Chip, TextField, Card, CardContent, Tabs, Tab, ButtonGroup, Skeleton, Alert } from '@mui/material';

import { styled } from '@mui/material/styles';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';

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
  const [expandedSection, setExpandedSection] = useState('description');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
      // Scroll to top when navigating to a product
      window.scrollTo(0, 0);
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

    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={24} width="40%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} width="30%" sx={{ mb: 3 }} />
            <Skeleton variant="text" height={100} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={50} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mt: 3, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>Product not found.</Alert>
      </Container>
    );
  }

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    setSelectedVariant(variant);
    
    // Update displayed image if variant has images
    if (variant && variant.images && variant.images.length > 0) {
      setSelectedImage(variant.images[0].url);
    }
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleReviewSubmit = () => {
    dispatch(getReviews({
      productId: product.id
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const groupVariantsByOption = () => {
    if (!product.variants || product.variants.length === 0) return {};
    
    const options = {};
    
    if (product.option1_name) {
      options[product.option1_name] = [...new Set(product.variants.map(v => v.option1_value).filter(Boolean))];
    }
    
    if (product.option2_name) {
      options[product.option2_name] = [...new Set(product.variants.map(v => v.option2_value).filter(Boolean))];
    }
    
    if (product.option3_name) {
      options[product.option3_name] = [...new Set(product.variants.map(v => v.option3_value).filter(Boolean))];
    }
    
    return options;
  };

  const getVariantForOptions = (option1, option2, option3) => {
    return product.variants.find(v => 
      (option1 ? v.option1_value === option1 : true) && 
      (option2 ? v.option2_value === option2 : true) && 
      (option3 ? v.option3_value === option3 : true)
    );
  };

  const productInStock = selectedVariant 
    ? selectedVariant.stock > 0 
    : (product.stock > 0 || product.total_stock > 0);

  const currentPrice = selectedVariant 
    ? (selectedVariant.sale_price || selectedVariant.price || selectedVariant.base_price)
    : (product.sale_price || product.base_price);
    
  const compareAtPrice = selectedVariant && selectedVariant.sale_price
    ? selectedVariant.base_price
    : product.sale_price ? product.base_price : null;
    
  const discountPercentage = compareAtPrice ? 
    Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100) : 0;
    
  const options = groupVariantsByOption();
  const averageRating = product.average_rating || 0;
  const reviewCount = reviews ? reviews.length : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color="text.secondary" variant="body2">Home</Typography>
        </Link>
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color="text.secondary" variant="body2">Shop</Typography>
        </Link>
        <Typography color="text.primary" variant="body2">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            height: { xs: 350, sm: 500 }, 
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            mb: 2,
            position: 'relative',
          }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain' 
                }}
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
                  left: 16,
                  fontWeight: 500,
                }}
              />
            )}
            
            {compareAtPrice && (
              <Chip
                label={`${discountPercentage}% OFF`}
                color="error"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontWeight: 500,
                }}
              />
            )}
          </Box>

          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'nowrap', 
              gap: 1, 
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 2,
              }
            }}>
              {product.images.map((image) => (
                <Box
                  key={image.id}
                  onClick={() => handleImageClick(image.url)}
                  sx={{
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === image.url ? '2px solid' : '1px solid',
                    borderColor: selectedImage === image.url ? 'primary.main' : 'divider',
                    '&:hover': {
                      borderColor: 'primary.light',
                    }
                  }}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} thumbnail`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </Box>
              ))}
              
              {/* Show variant images if any */}
              {product.variants && product.variants.map(variant => 
                variant.images && variant.images.map(image => (
                  <Box
                    key={image.id}
                    onClick={() => handleImageClick(image.url)}
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === image.url ? '2px solid' : '1px solid',
                      borderColor: selectedImage === image.url ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.light',
                      }
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`${variant.name} thumbnail`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            {product.name}
          </Typography>
          
          {/* Ratings */}
          {averageRating > 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap'
              }}
            >
              <Rating 
                value={averageRating} 
                precision={0.5} 
                readOnly 
                size="small"
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                component={Link} 
                to="#reviews" 
                onClick={() => setActiveTab(0)}
                sx={{ 
                  ml: 1, 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {reviewCount > 0 ? 
                  `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}` : 
                  'Be the first to review'
                }
              </Typography>
            </Box>
          )}
          
          {/* Price */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography 
              variant="h5" 
              component="span" 
              color="primary.main" 
              sx={{ fontWeight: 700 }}
            >
              ${parseFloat(currentPrice).toFixed(2)}
            </Typography>
            
            {compareAtPrice && (
              <>
                <Typography 
                  variant="body1" 
                  component="span" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${parseFloat(compareAtPrice).toFixed(2)}
                </Typography>
                
                <Chip 
                  label={`Save ${discountPercentage}%`} 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 500 }} 
                />
              </>
            )}
          </Box>
          
          {/* Description Preview - First 100 characters */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            {product.description ? 
              product.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
              'No description available'}
          </Typography>
          
          {/* Product Options */}
          {Object.keys(options).map((optionName, index) => (
            <Box key={optionName} sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2"
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                {optionName}
                {selectedVariant && (
                  <Typography 
                    component="span" 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {index === 0 ? selectedVariant.option1_value : 
                     index === 1 ? selectedVariant.option2_value : 
                     selectedVariant.option3_value}
                  </Typography>
                )}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {options[optionName].map((value) => {
                  // Find an appropriate variant to check if this option is in stock
                  const variantForOption = product.variants.find(v => 
                    (index === 0 && v.option1_value === value) ||
                    (index === 1 && v.option2_value === value) ||
                    (index === 2 && v.option3_value === value)
                  );
                  
                  const isInStock = variantForOption && variantForOption.stock > 0;
                  const isSelected = selectedVariant && (
                    (index === 0 && selectedVariant.option1_value === value) ||
                    (index === 1 && selectedVariant.option2_value === value) ||
                    (index === 2 && selectedVariant.option3_value === value)
                  );
                  
                  return (
                    <Button
                      key={value}
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      color={isSelected ? "primary" : "inherit"}
                      onClick={() => {
                        // Find appropriate variant based on current selection plus this new option
                        let variant;
                        if (index === 0) {
                          variant = getVariantForOptions(
                            value, 
                            selectedVariant?.option2_value,
                            selectedVariant?.option3_value
                          );
                        } else if (index === 1) {
                          variant = getVariantForOptions(
                            selectedVariant?.option1_value,
                            value,
                            selectedVariant?.option3_value
                          );
                        } else {
                          variant = getVariantForOptions(
                            selectedVariant?.option1_value,
                            selectedVariant?.option2_value,
                            value
                          );
                        }
                        
                        if (variant) {
                          handleVariantChange(variant.id);
                        }
                      }}
                      disabled={!isInStock}
                      sx={{
                        minWidth: '60px',
                        borderRadius: 1.5,
                        opacity: isInStock ? 1 : 0.5,
                        textTransform: 'none',
                        position: 'relative',
                        paddingY: 1
                      }}
                    >
                      {value}
                      {!isInStock && (
                        <Box sx={{ 
                          position: 'absolute', 
                          width: '100%', 
                          height: '1px', 
                          bgcolor: 'text.disabled',
                          transform: 'rotate(-45deg)'
                        }} />
                      )}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          ))}
          
          {/* Quantity */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Quantity
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonGroup 
                variant="outlined" 
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRadius: 1.5
                  }
                }}
              >
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="decrease quantity"
                  sx={{ px: 2 }}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
                
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ 
                    min: 1, 
                    style: { 
                      textAlign: 'center', 
                      width: '40px',
                      padding: '8px 0'
                    } 
                  }}
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  }}
                />
                
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="increase quantity"
                  sx={{ px: 2 }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </ButtonGroup>
              
              <Box sx={{ ml: 2 }}>
                <Chip
                  label={productInStock ? 'In Stock' : 'Out of Stock'}
                  color={productInStock ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Box>
          
          {/* Action Buttons */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                disabled={!productInStock}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {productInStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <Tooltip title="Add to Wishlist">
                <IconButton 
                  aria-label="add to wishlist" 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item xs={6} sm={2}>
              <Tooltip title="Share Product">
                <IconButton 
                  aria-label="share product" 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          
          {/* Product Benefits */}
          <List disablePadding sx={{ mb: 3 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LocalShippingIcon color="action" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Free shipping on orders over $50" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <VerifiedUserIcon color="action" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="100% natural ingredients" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LoopIcon color="action" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="30-day satisfaction guarantee" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      
      {/* Product Details Accordion */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: 6, 
          mb: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <List disablePadding>
          {/* Description Section */}
          <ListItem 
            button 
            onClick={() => toggleSection('description')}
            sx={{ 
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemText primary="Product Description" />
            {expandedSection === 'description' ? 
              <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          
          <Collapse in={expandedSection === 'description'}>
            <Box 
              sx={{ p: 3 }}
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          </Collapse>
          
          {/* Details Section */}
          <ListItem 
            button 
            onClick={() => toggleSection('details')}
            sx={{ 
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemText primary="Specifications" />
            {expandedSection === 'details' ? 
              <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          
          <Collapse in={expandedSection === 'details'}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {product.dimensions && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dimensions
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={9}>
                      <Typography variant="body2">
                        {product.dimensions.width && product.dimensions.height && product.dimensions.length ? 
                          `${product.dimensions.width}" × ${product.dimensions.height}" × ${product.dimensions.length}"` : 
                          'Not specified'}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {product.weight !== null && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Weight
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={9}>
                      <Typography variant="body2">
                        {product.weight} oz
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Collapse>
          
          {/* Benefits Section */}
          <ListItem 
            button 
            onClick={() => toggleSection('benefits')}
            sx={{ 
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemText primary="Benefits" />
            {expandedSection === 'benefits' ? 
              <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          
          <Collapse in={expandedSection === 'benefits'}>
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" paragraph>
                Experience the transformative effects of our premium health and beauty product:
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Made with natural ingredients" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Free from harmful chemicals" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cruelty-free and environmentally friendly" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Suitable for all skin types" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Collapse>
        </List>
      </Paper>
      
      {/* Reviews Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 6, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
        id="reviews"
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              py: 2
            }
          }}
        >
          <Tab label={`Reviews (${reviewCount})`} />
          <Tab label="Write a Review" />
        </Tabs>
        
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {activeTab === 0 && (
            <>
              {/* Review Summary */}
              {reviewCount > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        mb: { xs: 2, sm: 0 }
                      }}>
                        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 600 }}>
                          {averageRating.toFixed(1)}
                        </Typography>
                        
                        <Rating 
                          value={averageRating} 
                          precision={0.5} 
                          readOnly 
                          size="medium"
                          sx={{ mb: 1 }}
                        />
                        
                        <Typography color="text.secondary" variant="body2">
                          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={8} md={9}>
                      <Box>
                        {/* This would typically show rating distribution bars, 
                             but we'll just show placeholders for now */}
                        {[5, 4, 3, 2, 1].map((star) => (
                          <Box 
                            key={star} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 0.5 
                            }}
                          >
                            <Typography variant="body2" sx={{ width: 15, mr: 1 }}>
                              {star}
                            </Typography>
                            <StarIcon sx={{ color: 'warning.main', fontSize: 18, mr: 1 }} />
                            <Box 
                              sx={{ 
                                flexGrow: 1, 
                                height: 8, 
                                backgroundColor: 'grey.100',
                                borderRadius: 1,
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: `${star * 20}%`, 
                                  height: '100%', 
                                  backgroundColor: 'warning.main',
                                  borderRadius: 1,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ width: 30, ml: 1, color: 'text.secondary' }}>
                              {Math.round(reviewCount * (star / 15))}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Reviews List */}
              <Typography 
                variant="h6" 
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Customer Reviews
              </Typography>
              
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card 
                    key={review.id} 
                    elevation={0}
                    sx={{ 
                      mb: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          Verified Purchase
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2">{review.content}</Typography>
                      
                      {review.images && review.images.length > 0 && (
                        <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                          {review.images.map((image, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <img 
                                src={image.url} 
                                alt={`Review ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={{ 
                  py: 6, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' 
                }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    No reviews yet. Be the first to leave a review!
                  </Typography>
                  
                  <Button 
                    onClick={(e) => handleTabChange(e, 1)} 
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                  >
                    Write a Review
                  </Button>
                </Box>
              )}
            </>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Share Your Experience
              </Typography>
              <ReviewForm 
                productId={product.id} 
                onReviewSubmit={handleReviewSubmit} 
              />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Related Products would go here */}
      {/* You can implement this section later */}
    </Container>
  );
};

export default ProductDetail;