import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Card, CardContent, LinearProgress, Chip, Box, Breadcrumbs, Button, Alert, CardMedia, Container, Collapse, Grid, Snackbar, Typography, IconButton } from '@mui/material';
import { ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon, Inventory2Outlined as Inventory2OutlinedIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';

import ProductCard from '../product/ProductCard';
import { getProducts } from '../../slices/productSlice';
import { getCategoryBySlug, getCategoryBreadcrumbs, clearCategoryMessages } from '../../slices/categorySlice';

const CategoryDetail = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();

  const { category, breadcrumbs, error, loading } = useSelector(state => state.category);
  const { products, totalPages, currentPage, count } = useSelector(state => state.product);

  const [perPage, _] = useState(50);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      dispatch(getCategoryBySlug({ slug: categorySlug, includeSubcategories: true }));
    }
  }, [dispatch, categorySlug]);

  useEffect(() => {
    if (category?.id) {
      dispatch(getCategoryBreadcrumbs({ categoryId: category.id }));
      const categoryIds = [category.id];
      if (category.subcategories && category.subcategories.length > 0) {
        categoryIds.push(...category.subcategories.map(sub => sub.id));
      }
      dispatch(getProducts({ categoryIds, page: 1, perPage }));
    }
  }, [dispatch, category?.id, category?.subcategories, perPage]);

  const handlePageChange = (page) => {
    const categoryIds = [category.id];
    if (category.subcategories && category.subcategories.length > 0) {
      categoryIds.push(...category.subcategories.map(sub => sub.id));
    }
    dispatch(getProducts({ categoryIds, page, perPage }));
  };

  const handleAddToCartSuccess = () => {
    setSnackbarOpen(true);
  };

  const startItem = products.length > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endItem = Math.min(currentPage * perPage, count || 0);

  if (loading) {
    return (<LinearProgress />)
  }

  if (!loading && !category) {
    return (
      <Box sx={{ bgcolor: 'common.white', minHeight: '100vh', py: 8, px: 2 }} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Category Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The category you're looking for doesn't exist or has been removed.
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
          Browse All Categories
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '40vh', md: '55vh' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundColor: 'primary.main',
        }}
      >
        {category.image?.url && (
          <CardMedia
            component="img"
            image={category.image.url}
            alt={category.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: '#fff',
              fontWeight: 600,
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
              mb: 1,
            }}
          >
            {category.name}
          </Typography>

          {category.description && (
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontWeight: 300,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '800px',
              }}
            >
              {category.description}
            </Typography>
          )}
        </Container>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 4, md: 5 }, py: 3 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            <Link
              to="/shop"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              Shop
            </Link>
            {breadcrumbs.map((item, index) => (
              <Box key={item.id}>
                {index < breadcrumbs.length - 1 ? (
                  <Link
                    to={`/categories/${item.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <Typography color="primary.main" sx={{ fontWeight: '600' }}>
                    {item.name}
                  </Typography>
                )}
              </Box>
            ))}
          </Breadcrumbs>
        )}
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearCategoryMessages())} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {category.subcategories && category.subcategories.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 0.5 }}>
                  Subcategories
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
              <IconButton
                onClick={() => setShowSubcategories(!showSubcategories)}
                color="primary"
                size="small"
              >
                {showSubcategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={showSubcategories} timeout={300} unmountOnExit>
              <Grid container spacing={3}>
                {category.subcategories.map(subcategory => (
                  <Grid component={Link} to={`/categories/${subcategory.slug}`} sx={{ textDecoration: 'none', color: 'inherit' }} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={subcategory.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          '& .subcategory-name': {
                            color: 'primary.main',
                          },
                        },
                      }}
                    >
                      {subcategory.image?.url ? (
                        <CardMedia
                          component="img"
                          image={subcategory.image.url}
                          title={subcategory.name}
                          sx={{
                            height: 140,
                            objectFit: 'cover',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      ) : (
                        <Box
                          height="140px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          backgroundColor="#F5F5F5"
                          color="grey.500"
                        >
                          <ImageNotSupportedOutlinedIcon fontSize="large" />
                        </Box>
                      )}
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            className="subcategory-name"
                            sx={{
                              transition: 'color 0.3s ease',
                              flexGrow: 1,
                            }}
                          >
                            {subcategory.name}
                          </Typography>
                          <Chip
                            icon={<Inventory2OutlinedIcon color="secondary" />}
                            label={`${subcategory.product_count || 0} ${subcategory.product_count > 1 ? 'Products' : 'Product'} `}
                            size="small"
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'secondary.main',
                              px: 1,
                              py: 1.7
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>
        )}
        <Box sx={{ mt: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
              <Typography variant="h4" component="h2" sx={{ mb:  0.5 }}>
                Products
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
          </Box>
          {products && products.length > 0 ? (
            <>
            <Grid container spacing={4}>
              {products.map(product => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} onAddToCartSuccess={handleAddToCartSuccess} />
                </Grid>
              ))}
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                Item was successfully added to cart.
              </Alert>
            </Snackbar>
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 4, sm: 8 },
                px: { xs: 2, sm: 2 },
                backgroundColor: 'grey.100',
                borderRadius: 2,
                border: '1px dashed #CCCCCC',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                There are currently no products available in this category.
              </Typography>
            </Box>
          )}

          {products && products.length > 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'center', md: 'center' }, 
                mt: 6,
                pt: 4,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: { xs: 3, md: 0 },
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {count > 0 ? 
                    `Showing ${startItem}-${endItem} of ${count} products` : 
                    'No results found'}
                </Typography>
              </Box>
              <Pagination 
                count={totalPages || 1} 
                page={currentPage} 
                onChange={handlePageChange} 
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryDetail;