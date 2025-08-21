import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionSummary, AccordionDetails, LinearProgress, Grid, Typography, Box, Button, Breadcrumbs, IconButton, Rating, Chip, TextField, Card, CardContent } from '@mui/material';
import { AddShoppingCartOutlined as AddShoppingCartOutlinedIcon, ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon, Add as AddIcon, Remove as RemoveIcon, Star as StarIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, NavigateNext as NavigateNextIcon, CheckCircle as CheckCircleIcon, Loop as LoopIcon, VerifiedUser as VerifiedUserIcon, LocalShipping as LocalShippingIcon, Share as ShareIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

import ReviewForm from '../review/ReviewForm';
import { addToCart } from '../../slices/cartSlice';
import { getReviews } from '../../slices/reviewSlice';
import { getProductBySlug } from '../../slices/productSlice';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { reviews, count, ratingCounts } = useSelector((state) => state.review);
  const { product, loading } = useSelector((state) => state.product);
  
  const reviewsRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [expandedSection, setExpandedSection] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  useEffect(() => {
    if (productSlug) {
      dispatch(getProductBySlug(productSlug));
      window.scrollTo(0, 0);
    }
  }, [dispatch, productSlug]);
  
  useEffect(() => {
    if (product && product.id) {
      dispatch(getReviews({
        productId: product.id
      }));
    }
  }, [dispatch, product]);

  useEffect(() => {
     if (product && product.variants && product.variants.length > 0) {
      const firstInStockVariant = product.variants.find(v => v.stock > 0);
      setSelectedVariant(firstInStockVariant || product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.images && variant.images.length > 0) {
      setSelectedImage(variant.images[0].url);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    const maxStock = selectedVariant ? selectedVariant.stock : product.total_stock;
    if (value < 1) {
      setQuantity(1);
    } else if (value > maxStock) {
      setQuantity(maxStock);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    const productToAdd = selectedVariant ? selectedVariant : product;
    dispatch(addToCart({
      product_id: productToAdd.id,
      variant_id: selectedVariant ? selectedVariant.id : null,
      quantity,
    }));
  };

  const handleReviewSubmit = () => {
    dispatch(getReviews({
      productId: product.id
    }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (<LinearProgress/>);
  }

  if (!loading && !product) {
    return (
      <Box sx={{ bgcolor: 'common.white', minHeight: '100vh', py: 8, px: 2 }} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Product Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The product you're looking for doesn't exist or has been removed.
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
          Browse All Products
        </Button>
      </Box>
    );
  }

  const sections = [
    { id: 'benefits', label: 'Benefits', content: product.benefits },
    { id: 'instructions', label: 'Instructions', content: product.instructions },
    { id: 'ingredients', label: 'Ingredients', content: product.ingredients },
  ];

  const reviewCount = reviews ? count : 0;  
  const isInStock = selectedVariant 
    ? selectedVariant.stock > 0 
    : (product.stock > 0 || product.total_stock > 0);
  const currentPrice = selectedVariant 
    ? (selectedVariant.sale_price || selectedVariant.price || selectedVariant.base_price)
    : (product.sale_price || product.base_price);
  const compareAtPrice = selectedVariant && selectedVariant.sale_price
    ? selectedVariant.base_price
    : product.sale_price ? product.base_price : null;
  const discount = compareAtPrice ? 
    Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100) : 0;
  const productImages = product.images || [];

  return (
    <Box sx={{ px: 5, py: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color="text.secondary" variant="body2">Shop</Typography>
        </Link>
        <Link to={`/categories/${product.category_slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color="text.secondary" variant="body2">{product.category_name}</Typography>
        </Link>
        <Typography color="primary.main" variant="body2" sx={{ fontWeight: '600' }}>{product.name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
          {productImages.length > 1 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1, 
              mr: 2,
              width: '80px',
            }}>
              {productImages.map((image) => (
                <Box
                  key={image.id}
                  onClick={() => handleImageClick(image.url)}
                  sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#F5F5F5',
                    border: selectedImage === image.url ? '2px solid' : '1px solid',
                    borderColor: selectedImage === image.url ? 'primary.main' : 'grey.300',
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
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ 
            flexGrow: 1,
            height: { xs: 350, sm: 550 }, 
            backgroundColor: '#F5F5F5',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid',
            borderColor: 'grey.100',
          }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                }}
              />
            ) : (
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
                <ImageNotSupportedOutlinedIcon fontSize="large"  />
              </Box>
              
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
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
            {productImages.length > 1 && (
              <>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    left: 8, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.1)',  
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                    boxShadow: 1,
                  }}
                  onClick={() => {
                    const currentIndex = productImages.findIndex(img => img.url === selectedImage);
                    const prevIndex = currentIndex <= 0 ? productImages.length - 1 : currentIndex - 1;
                    setSelectedImage(productImages[prevIndex].url);
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                    boxShadow: 1,
                  }}
                  onClick={() => {
                    const currentIndex = productImages.findIndex(img => img.url === selectedImage);
                    const nextIndex = (currentIndex + 1) % productImages.length;
                    setSelectedImage(productImages[nextIndex].url);
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              mb: 2,
              fontWeight: 600,
            }}
          >
            {product.name}
          </Typography>
          <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap'
              }}
            >
            <Rating 
              value={product.average_rating} 
              precision={0.5} 
              readOnly 
            />
              <Typography 
                variant="body2" 
                color="secondary.main" 
                component={Link} 
                to="#reviews" 
                onClick={() => setTimeout(() => {
                  reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100)}
                sx={{ 
                  ml: 1, 
                }}
              >
                {reviewCount > 0 ? 
                  `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}` : 
                  'Be the first to review'
                }
              </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 1
            }}
          >
          {compareAtPrice && (
            <Typography 
              variant="body2" 
              component="span" 
              sx={{ 
                textDecoration: 'line-through',
                color: 'common.grey'
                }}
            >
              ₱{parseFloat(compareAtPrice).toFixed(2)}
            </Typography>
            )}
            <Typography 
              variant="body1" 
              component="span" 
              sx={{ 
                fontWeight: 700,
                color: compareAtPrice ? 'primary.main' : 'text.primary',
                fontSize: '1.2rem'
              }}
            >
              ₱{parseFloat(currentPrice).toFixed(2)}
            </Typography>
            {compareAtPrice && (
              <Chip
                label={`${Math.round(discount)}% OFF`}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
              }}/>
            )}
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: 3,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              maxWidth: '100%',
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description || 'No description available'),
            }}
          />
          {product.variants && product.variants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2"  sx={{ mb: 1, fontWeight: 600 }}>
                Select Option:
                {selectedVariant && (
                  <Typography 
                    component="span" 
                    variant="body2" 
                    color="secondary.main" 
                    sx={{ ml: 1, fontWeight: 600 }}
                  >
                    {selectedVariant.name}
                  </Typography>
                )}
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant && selectedVariant.id === variant.id;
                  const isInStock = variant.stock > 0;
                  const variantImage = variant.images && variant.images.length > 0 
                    ? variant.images[0].url 
                    : null;
                  return (
                    <Grid item key={variant.id} xs="auto">
                      <Box
                        onClick={() => isInStock && handleVariantSelect(variant)}
                        sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: isInStock ? 'pointer' : 'not-allowed',
                          backgroundColor: '#F5F5F5',
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                          opacity: isInStock ? 1 : 0.5,
                          '&:hover': {
                            borderColor: isInStock ? 'primary.light' : 'grey.300',
                          },
                          position: 'relative',
                        }}
                      >
                        {variantImage ? (
                          <Box>
                            <img
                              src={variantImage}
                              alt={variant.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                            />
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              height: '100%', 
                              width: '100%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',  
                              color: isSelected ? 'primary.main' : 'common.grey'                            
                            }}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {variant.option1_value || variant.option2_value || variant.option3_value}
                            </Typography>
                          </Box>
                        )}
                        
                        {isSelected && (
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: 1,
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                        {!isInStock && (
                          <Box sx={{ 
                            position: 'absolute', 
                            width: '100%', 
                            height: '1px', 
                            bgcolor: 'text.disabled',
                            transform: 'rotate(-45deg)',
                            top: '50%'
                          }} />
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  height: 40,
                }}
              >
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="decrease quantity"
                  sx={{
                    minWidth: 40,
                    px: 0,
                    borderRight: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 0,
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                  size="small"
                  type="number"
                  slotProps = {{
                    htmlInput: {
                      min: 1,
                      max: selectedVariant? selectedVariant.stock : product.total_stock,
                      style: { 
                        textAlign: 'center', 
                        padding: '8px 0',
                        MozAppearance: 'textfield'
                      } 
                    }
                  }}                  
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{
                    width: 50,
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& input': {
                      textAlign: 'center',
                    },
                  }}
                />
                <Button
                  onClick={() => setQuantity(Math.min(selectedVariant? selectedVariant.stock : product.total_stock, quantity + 1))}
                  aria-label="increase quantity"
                  sx={{
                    minWidth: 40,
                    px: 0,
                    borderLeft: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 0,
                  }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </Box>
              {isInStock ? (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2  }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
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
            </Box>
          </Box>
          {(product.weight &&  product.dimensions) && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {product.weight && (
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="body2">
                  {product.weight || 0} kg
                </Typography>
              </Grid>
              )}
              {product.dimensions && (
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dimensions
                  </Typography>
                  <Typography variant="body2">
                    {(() => {
                      const { width, length, height } = product.dimensions || {};
                      const dimensions = [
                        width && `${width}W`,
                        length && `${length}L`,
                        height && `${height}H`
                      ].filter(Boolean);
                      
                      return dimensions.length > 0 ? dimensions.join(' x ') : null;
                    })()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
              disableElevation
              disabled={!isInStock}
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartOutlinedIcon />}
              size="large"
              sx={{ width: '250px' }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Box my={4}>
        {sections.map(
          ({ id, label, content }) =>
            content && (
              <Accordion
                key={id}
                expanded={expandedSection === id}
                onChange={() => toggleSection(id)}
                elevation={0}
                sx={{ 
                  my: 2, 
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'common.black' }} />}>
                  <Typography variant="h5">{label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body1"
                     sx={{ 
                      mb: 3,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      maxWidth: '100%',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(content),
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            )
        )}
      </Box>
      <Box ref={reviewsRef} sx={{ display: 'inline-block', position: 'relative', mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600 }}>
          Customer Reviews
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: -6,
            left: 0,
            height: '3px',
            width: '60px',
            bgcolor: 'primary.main',
            borderRadius: 2,
          }}
        />
      </Box>
      <Box>
        {reviewCount > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 600 }}>
                  {product.average_rating.toFixed(1)}
                </Typography>
                <Rating
                  value={product.average_rating}
                  precision={0.5}
                  readOnly
                  size="medium"
                  sx={{ mb: 1 }}
                />
                <Typography color="text.secondary" variant="body2">
                  Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: '250px' }}>
              {(() =>
                [5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percentage = reviewCount ? (count / reviewCount) * 100 : 0;

                  return (
                    <Box
                      key={star}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ width: 15, mr: 1 }}>
                        {star}
                      </Typography>
                      <StarIcon sx={{ color: '#FFA41C', fontSize: 18, mr: 1 }} />
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          backgroundColor: 'grey.100',
                          borderRadius: 1,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: '#FFA41C',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ width: 30, ml: 1, color: 'text.secondary' }}
                      >
                        {count}
                      </Typography>
                    </Box>
                  );
                })
              )()}
            </Box>
            </Box>
          </Box>

        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, sm: 5 },
              px: { xs: 2, sm: 3 },
              backgroundColor: 'grey.100',
              borderRadius: 3,
              boxShadow: 1,
              border: '1px dashed #CCCCCC',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              This product has no reviews yet.
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              If you have purchased this product, click the button below to submit a review.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ mt: 2 }}
              disableElevation
              onClick={() => setShowReviewModal(true)}
            >
              Write a Review
            </Button>
          </Box>
        )}
        {reviews && reviews.length > 0 && (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</Typography>
              <Button variant="contained" color="secondary" disableElevation onClick={() => setShowReviewModal(true)}>Write a Review</Button>
            </Box>
            {reviews.map((review) => (
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
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                      {(user?.is_admin || user?.id === review.user_id) && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEditingReview(review);
                            setShowReviewModal(true);
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Edit
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      Verified Purchase
                    </Typography>
                  </Box>
                  <Typography variant="body2">{review.content}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        <ReviewForm 
          productId={product.id}
          review={editingReview}
          open={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setEditingReview(null);
          }}
          onReviewSubmit={handleReviewSubmit}
        />
      </Box>
    </Box>
  );
};

export default ProductDetail;