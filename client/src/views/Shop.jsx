import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Refresh as RefreshIcon, ClearAll as ClearAllIcon, Sort as SortIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon, Close as CloseIcon, Search as SearchIcon, FilterList as FilterListIcon, TuneOutlined as TuneOutlinedIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Snackbar, Alert, LinearProgress, MenuItem, useTheme, FormControl, Box, Typography, Grid, Paper, Select, Button, TextField, Divider, IconButton, Chip, Drawer, useMediaQuery, Pagination, InputAdornment, Stack, Fade, Collapse } from '@mui/material';

import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';
import { getCategories } from '../slices/categorySlice';

const Shop = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [perPage] = useState(24);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchInput, setSearchInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  
  const { categories, loading: categoriesLoading } = useSelector(state => state.category);
  const { products, totalPages, count, loading: productsLoading } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(getCategories({ tree: false }));
  }, [dispatch]);

  const loadProducts = useCallback(() => {
    dispatch(getProducts({
      page: page, 
      perPage: perPage, 
      search: search,
      categoryIds: selectedCategoryIds,
      isActive: true,
      sort: sortBy,
    }));
  }, [dispatch, page, perPage, search, selectedCategoryIds, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim())
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
    setPage(1);
  };
  
  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
    
  const toggleDrawer = (open) => (e) => {
    if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };
  
  const clearAllFilters = () => {
    setSearch('');
    setSearchInput('');
    setSelectedCategoryIds([]);
    setPage(1);
    setSortBy('newest');
  };

  const handleAddToCartSuccess = () => {
    setSnackbarOpen(true);
  };
  
  const renderCategories = (categoryList) => {
    if (!categoryList || categoryList.length === 0) return null;
    return categoryList.map(category => {
      const isSelected = selectedCategoryIds.includes(category.id);
      return (
        <Box 
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          sx={{ 
            p: 1.25,
            mb: 0.75,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isSelected ? 'primary.light' : 'transparent',
            border: '1px solid',
            borderColor: isSelected ? 'primary.main' : 'transparent',
            '&:hover': {
              backgroundColor: isSelected ? 'primary.light' : 'primary.light',
              borderColor: isSelected ? 'primary.main' : 'transparent'
            }
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '4px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'common.black',
                  backgroundColor: isSelected ? 'primary.main' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'common.white',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'text.primary' : 'common.black',
                  transition: 'all 0.2s ease'
                }}
              >
                {category.name}
              </Typography>
            </Stack>
            {category.product_count !== undefined && (
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  px: 1,
                  py: 0.25,
                  backgroundColor: isSelected ? 'primary.main' : 'common.black',
                  color: isSelected ? 'common.white' : 'common.white',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  minWidth: 28,
                  textAlign: 'center'
                }}
              >
                {category.product_count}
              </Typography>
            )}
          </Stack>
        </Box>
      );
    });
  };
  
  const renderActiveFilters = () => {
    const hasActiveFilters = search || selectedCategoryIds.length > 0;
    if (!hasActiveFilters) return null;
    
    return (
      <Fade in={hasActiveFilters}>
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            p: 2.5,
            backgroundColor: 'primary.light',
            borderRadius: 3,
            border: '1.5px solid',
            borderColor: 'primary.main'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <TuneOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Active Filters
            </Typography>
            <Chip 
              label={selectedCategoryIds.length + (search ? 1 : 0)}
              size="small"
              sx={{ 
                backgroundColor: 'primary.main', 
                color: 'common.white',
                fontWeight: 600,
                height: 20,
                fontSize: '0.7rem'
              }}
            />
            <Button 
              size="small" 
              onClick={clearAllFilters} 
              sx={{ ml: 'auto !important' }}
              color="primary"
              startIcon={<ClearAllIcon fontSize="small" />}
              variant="text"
            >
              Clear All
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {search && (
              <Chip
                label={`Search: "${search}"`}
                onDelete={() => {
                  setSearch('');
                  setSearchInput('');
                }}
                size="medium"
                variant="outlined"
                sx={{
                  borderColor: 'secondary.main',
                  borderWidth: 1.5,
                  color: 'secondary.main',
                  fontWeight: 600,
                  '& .MuiChip-deleteIcon': {
                    color: 'secondary.main',
                  }
                }}
              />
            )}
            {selectedCategoryIds.map(catId => {
              const category = categories?.find(c => c.id === catId);
              return category ? (
                <Chip
                  key={catId}
                  label={category.name}
                  onDelete={() => handleCategorySelect(catId)}
                  size="medium"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    fontWeight: 600,
                    '& .MuiChip-deleteIcon': {
                      color: 'common.white',
                    }
                  }}
                />
              ) : null;
            })}
          </Box>
        </Paper>
      </Fade>
    );
  };

  if (productsLoading || categoriesLoading) {
    return (<LinearProgress sx={{ backgroundColor: 'common.primary' }} />)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'common.white' }}>
      <Box 
        sx={{ 
          backgroundColor: 'common.white',
          pt: { xs: 3, md: 4 },
          pb: 3,
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 400,
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
          >
            Shop All Products
          </Typography>          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'flex-end' }}
          >
            <TextField
              placeholder="Search products..."
              variant="outlined"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'common.black' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSearchInput('');
                          setSearch('');
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'common.white',
                  '& fieldset': {
                    borderColor: 'common.black',
                  },
                  '&:hover fieldset': {
                    borderColor: 'common.black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`
                  }
                }
              }}
            />
            <Button 
              variant="contained" 
              size="medium"
              onClick={handleSearch}
              sx={{ 
                minWidth: { xs: '100%', sm: 120 },
                px: 4
              }}
            >
              Search
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {!isMobile && (
              <Button
                variant={showFilters ? 'contained' : 'outlined'}
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                size="medium"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            )}
            {isMobile && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={toggleDrawer(true)}
                size="medium"
              >
                Filters {selectedCategoryIds.length > 0 && `(${selectedCategoryIds.length})`}
              </Button>
            )}
          </Stack>

          <FormControl 
            variant="outlined" 
            size="small"
             sx={{ 
              minWidth: { xs: '100%', sm: 220 },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'common.black',
                },
                '&:hover fieldset': {
                  borderColor: 'common.black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}33`,
                },
              },
            }}
          >
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" sx={{ color: 'common.black' }} />
                </InputAdornment>
              }
              sx={{
                fontWeight: 500,
                '& .MuiSelect-select': {
                  py: 1.25
                }
              }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ 
            display: { md: 'none' },
            '& .MuiDrawer-paper': { 
              width: '85%', 
              maxWidth: 380,
              p: 3,
              backgroundColor: 'common.white'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>Filters</Typography>
            <IconButton onClick={toggleDrawer(false)} edge="end" sx={{ color: 'common.black' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3, borderColor: 'common.black' }} />
          
          <Box
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              mb: 2,
              pb: 1.5,
              borderBottom: '1px solid',
              borderColor: 'common.black'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Categories
            </Typography>
            <ExpandMoreIcon 
              sx={{ 
                transform: categoriesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: 'common.grey'
              }} 
            />
          </Box>
          
          <Collapse in={categoriesExpanded}>
            <Box sx={{ maxHeight: 450, overflowY: 'auto', pr: 0.5 }}>
              {categories?.length > 0 ? (
                <Box>
                  {renderCategories(categories)}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No Categories Available
                </Typography>
              )}
            </Box>
          </Collapse>

          <Box sx={{ pt: 3 }}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={toggleDrawer(false)}
              size="large"
            >
              View {count} Product{count !== 1 ? 's' : ''}
            </Button>
          </Box>
        </Drawer>

        {renderActiveFilters()}

        <Grid container spacing={3}>
          {showFilters && !isMobile && (
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  position: 'sticky',
                  top: 20,
                  borderRadius: 3,
                  backgroundColor: 'common.white',
                  border: '1px solid',
                  borderColor: 'common.black'
                }}
              >
                <Box
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    mb: 2,
                    pb: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'common.black'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Categories
                  </Typography>
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: categoriesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: 'common.black'
                    }} 
                  />
                </Box>
                
                <Collapse in={categoriesExpanded}>
                  <Box sx={{ maxHeight: 550, overflowY: 'auto', pr: 0.5 }}>
                    {categories?.length > 0 ? (
                      <Box>
                        {renderCategories(categories)}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                        No Categories Available
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: showFilters && !isMobile ? 9 : 12 }}>
            {products?.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {products.map(product => (
                    <Grid 
                      size={{ xs: 12, sm: 6, md: showFilters ? 4 : 3 }}
                      key={product.id}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCartSuccess={handleAddToCartSuccess}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <Pagination 
                    count={totalPages || 1} 
                    page={page} 
                    onChange={handlePageChange} 
                    shape="rounded"
                    size={isMobile ? "medium" : "large"}
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" sx={{ color: 'common.grey', mt: 2, fontWeight: 500 }}>
                    {count > 0 ? `Showing ${(page - 1) * perPage + 1}–${Math.min(page * perPage, count)} of ${count} products` : 'No products found'}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: { xs: 6, sm: 10 },
                  px: { xs: 3, sm: 4 },
                  backgroundColor: 'grey.100',
                  borderRadius: 3,
                  boxShadow: 1,
                  border: '1px dashed #CCCCCC',
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'common.grey', mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 400, mb: 1 }}>
                  No Products Found
                </Typography>
                <Typography variant="body1" color="text.disabled" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  We couldn't find any products matching your filters. Try adjusting your search or clearing some filters.
                </Typography>
                {(search || selectedCategoryIds.length > 0) && (
                  <Button 
                    variant="contained"
                    size="large"
                    onClick={clearAllFilters}
                    startIcon={<RefreshIcon />}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ borderRadius: 2 }}
        >
          Item successfully added to cart
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Shop;