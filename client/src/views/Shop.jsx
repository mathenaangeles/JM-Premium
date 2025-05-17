import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Refresh as RefreshIcon, ClearAll as ClearAllIcon, Sort as SortIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon, NavigateNext as NavigateNextIcon, Close as CloseIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Search as SearchIcon,FilterList as FilterListIcon } from '@mui/icons-material';
import { MenuItem, useTheme, FormControl, Box, Typography, Container, InputLabel, Grid, Paper, Select, Button, TextField, Divider, Checkbox, FormControlLabel, IconButton, Breadcrumbs, Chip, Drawer, useMediaQuery, CircularProgress, Pagination, Collapse, List, ListItem, FormGroup, InputAdornment,Stack } from '@mui/material';

import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';
import { getCategories } from '../slices/categorySlice';

const Shop = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [perPage] = useState(12);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  
  const { categories, loading: categoriesLoading } = useSelector(state => state.category);
  const { products, totalPages, loading: productsLoading } = useSelector(state => state.product);

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
    }));
  }, [dispatch, page, perPage, search, selectedCategoryIds]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
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
    window.scrollTo(0, 0); 
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
  
  const renderCategories = (categoryList) => {
    if (!categoryList || categoryList.length === 0) return null;
    return categoryList.map(category => (
      <Box key={category.id}>
        <ListItem sx={{ p: 0.5 }} dense disablePadding>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={selectedCategoryIds.includes(category.id)} 
                  onChange={() => handleCategorySelect(category.id)}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 0.5 }}>
                    {category.name}
                  </Typography>
                  {category.product_count !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      ({category.product_count})
                    </Typography>
                  )}
                </Box>
              }
              sx={{ flex: 1 }}
            />
          </Box>
        </ListItem>
      </Box>
    ));
  };
  
  const renderActiveFilters = () => {
    if (search || selectedCategoryIds.length > 0) {
      return (
        <Paper elevation={0} 
          sx={{ 
            my: 2, 
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <FilterListIcon fontSize="small" color="action" />
            <Typography variant="body2">
              Active Filters
            </Typography>
            <Button 
              size="small" 
              onClick={clearAllFilters} 
              sx={{ ml: 'auto' }}
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
                label={`Search: ${search}`}
                onDelete={() => {
                  setSearch('');
                  setSearchInput('');
                }}
                size="small"
                variant="outlined"
              />
            )}
            {selectedCategoryIds.map(catId => {
              const category = categories?.find(c => c.id === catId);
              return category ? (
                <Chip
                  key={catId}
                  label={category.name}
                  onDelete={() => handleCategorySelect(catId)}
                  size="small"
                  variant="filled"
                  color="primary"
                  sx={{
                    color: 'common.white',
                    '& .MuiChip-deleteIcon': {
                      color: 'common.white',
                    },
                    fontWeight: 600
                  }}
                />
              ) : null;
            })}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 6 }}>
        {/* Shop Header */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 2
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 500,
                letterSpacing: '-0.5px', 
                mb: 0.5 
              }}
            >
              Shop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {products?.length} products
            </Typography>
          </Box>
          
          {/* Sort dropdown */}
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ minWidth: 180 }}
          >
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>
          
        {/* Mobile filter button */}
        {isMobile && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleDrawer(true)}
            sx={{ mb: 3 }}
          >
            Filter & Search
          </Button>
        )}
        
        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ 
            display: { md: 'none' },
            '& .MuiDrawer-paper': { 
              width: '85%', 
              maxWidth: 360,
              p: 3,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Filters</Typography>
            <IconButton onClick={toggleDrawer(false)} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 0 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              Search
            </Typography>

            <TextField
              fullWidth
              placeholder="Search products..."
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                  },
                }
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              sx={{ mt: 1 }}
              fullWidth
              onClick={handleSearch}
            >
              Search
            </Button>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              
              <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {categoriesLoading ? (
                  <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="primary" />
                  </Box>
                ) : categories?.length > 0 ? (
                  <FormGroup>
                    {renderCategories(categories)}
                  </FormGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No categories found
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Drawer>
        
        {renderActiveFilters()}
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3}} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                position: 'sticky', 
                top: 20, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Box sx={{ p: 0 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              Search
            </Typography>

            <TextField
              fullWidth
              placeholder="Search products..."
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                  },
                }
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              sx={{ mt: 1 }}
              fullWidth
              onClick={handleSearch}
            >
              Search
            </Button>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              
              <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {categoriesLoading ? (
                  <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="primary" />
                  </Box>
                ) : categories?.length > 0 ? (
                  <FormGroup>
                    {renderCategories(categories)}
                  </FormGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No categories found
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
            </Paper>
          </Grid>
          
          {/* Main product area */}
          <Grid size={{ xs: 12, md: 9 }}>
            {productsLoading ? (
              <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={40} color="primary" />
              </Box>
            ) : products?.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {products.map(product => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 1
                      }
                    }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Showing {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalPages)} of {totalPages} products
                  </Typography>
                </Box>
              </>
            ) : (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'action.hover',
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
                  We couldn't find any products matching your current filters. Try adjusting your search criteria or browse our categories.
                </Typography>
                {(search || selectedCategoryIds.length > 0) && (
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={clearAllFilters}
                    sx={{ mt: 2 }}
                    startIcon={<RefreshIcon />}
                  >
                    Reset filters
                  </Button>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Shop;