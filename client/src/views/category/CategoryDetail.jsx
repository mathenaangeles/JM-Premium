import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Inventory2Outlined as Inventory2OutlinedIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { LinearProgress, Chip, Box, Breadcrumbs, Button, Alert, CardMedia, Container, Collapse, FormControl, Grid, MenuItem, Select, Typography, Paper, IconButton } from '@mui/material';

import ProductCard from '../product/ProductCard';
import { getProducts } from '../../slices/productSlice';
import { getCategoryBySlug, getCategoryBreadcrumbs, clearCategoryMessages } from '../../slices/categorySlice';

const CategoryDetail = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();

  const { category, breadcrumbs, error, loading } = useSelector(state => state.category);
  const { products, totalPages, currentPage, } = useSelector(state => state.product);

  const [perPage, setPerPage] = useState(12);
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


  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
  };

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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'common.white' }}>
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
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={subcategory.id}>
                    <Paper
                      component={Link}
                      to={`/categories/${subcategory.slug}`}
                      elevation={2}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 'shadows[1]',
                          '& .subcategory-name': {
                            color: 'primary.main'
                          }
                        },
                      }}
                    >
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                            label={`${subcategory.product_count || 0} Products`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(151, 167, 99, 0.15)',
                              color: 'secondary.main',
                              p: 2,
                            }}
                          />
                        </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>
        )}

        {/* Products Section */}
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

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={perPage}
                onChange={handlePerPageChange}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              >
                <MenuItem value={12}>12 per page</MenuItem>
                <MenuItem value={24}>24 per page</MenuItem>
                <MenuItem value={48}>48 per page</MenuItem>
              </Select>
            </FormControl>

          </Box>

          <>
            {products && products.length > 0 ? (
              <Grid container spacing={4}>
                {products.map(product => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
                  <Button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outlined"
                    sx={{
                      borderRadius: '4px 0 0 4px',
                      borderRight: 'none',
                      px: 2,
                      py: 1,
                      minWidth: { xs: '60px', sm: '80px' },
                      color: currentPage === 1 ? 'disabled' : 'primary.main'
                    }}
                  >
                    Previous
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={currentPage === page ? "contained" : "outlined"}
                          sx={{
                            borderRadius: 0,
                            borderLeft: 'none',
                            borderRight: 'none',
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            minWidth: { xs: '40px', sm: '50px' }
                          }}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <Button
                          key={page}
                          disabled
                          variant="outlined"
                          sx={{
                            borderRadius: 0,
                            borderLeft: 'none',
                            borderRight: 'none',
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            minWidth: { xs: '40px', sm: '50px' }
                          }}
                        >
                          ...
                        </Button>
                      );
                    }
                    return null;
                  })}

                  <Button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outlined"
                    sx={{
                      borderRadius: '0 4px 4px 0',
                      borderLeft: 'none',
                      px: 2,
                      py: 1,
                      minWidth: { xs: '60px', sm: '80px' },
                      color: currentPage === totalPages ? 'disabled' : 'primary.main'
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </>
            
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryDetail;