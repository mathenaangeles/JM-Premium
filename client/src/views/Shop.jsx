import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Refresh as RefreshIcon, ClearAll as ClearAllIcon, Sort as SortIcon, ShoppingBagOutlined as ShoppingBagOutlinedIcon, Close as CloseIcon, Search as SearchIcon,FilterList as FilterListIcon } from '@mui/icons-material';
import { Snackbar, Alert, LinearProgress, MenuItem, useTheme, FormControl, Box, Typography, InputLabel, Grid, Paper, Select, Button, TextField, Divider, Checkbox, FormControlLabel, IconButton, Chip, Drawer, useMediaQuery, Pagination, ListItem, FormGroup, InputAdornment, Stack } from '@mui/material';

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

  const handleAddToCartSuccess = () => {
    setSnackbarOpen(true);
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

  if (productsLoading || categoriesLoading) {
    return (<LinearProgress />)
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <TextField
          placeholder="Search"
          variant="standard"
          size="small"
          slotProps={{
            input: {
              endAdornment:(
                <InputAdornment position="end">
                  <SearchIcon className="search-icon" fontSize="medium" 
                    sx={{ 
                      mb: 0.5, 
                      cursor: 'pointer', 
                  }}/>
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
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: 350 },
            '& .MuiInputBase-root:hover .search-icon': {
              color: 'text.primary',
            },
            '& .MuiInputBase-root.Mui-focused .search-icon': {
              color: 'primary.main',
            },
            '& .search-icon': {
              color: 'text.secondary',
              mb: 0.5,
              transition: 'color 0.2s ease',
              cursor: 'pointer',
            },
          }}
        />
        <FormControl 
          variant="outlined" 
          size="small" 
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: 150 },
           }}
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
            <MenuItem value="price_low">Price Low to High</MenuItem>
            <MenuItem value="price_high">Price High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
        {products?.length > 0 ? `${products.length} product${products.length > 1 ? 's' : ''}` : 'No Products Found'}
      </Typography>
      {isMobile && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={toggleDrawer(true)}
          sx={{ mb: 3 }}
        >
          Filter Products
        </Button>
      )}
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
            backgroundColor: 'common.white'
          },
        
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Filters</Typography>
          <IconButton onClick={toggleDrawer(false)} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ p: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
              Categories
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
              {categories?.length > 0 ? (
                <FormGroup>
                  {renderCategories(categories)}
                </FormGroup>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No Categories Found
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
              p: 2, 
              position: 'sticky', 
              borderRadius: 2,
              backgroundColor: 'common.white',
            }}
          >
            <Box sx={{ p: 0 }}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              <Divider sx={{ mb: 1 }}/>
              <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {categories?.length > 0 ? (
                  <FormGroup>
                    {renderCategories(categories)}
                  </FormGroup>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No Categories Found
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          {products?.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map(product => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
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
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Pagination 
                  count={totalPages || 1} 
                  page={page} 
                  onChange={handlePageChange} 
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                />
                <Typography variant="body2" color="text.secondary" sx={{  mt: 2 }}>
                  {count > 0 ? `Showing ${(page - 1) * perPage + 1} - ${Math.min(page * perPage, count)} of ${count} products` : 'No products found'}
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 4, sm: 8 },
                px: { xs: 2, sm: 4 },
                backgroundColor: 'grey.100',
                borderRadius: 2,
                border: '1px dashed #CCCCCC',
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                We couldn't find any products matching your current filters.  Please try adjusting your search criteria or reloading the page.
              </Typography>
              {(search || selectedCategoryIds.length > 0) && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={clearAllFilters}
                  sx={{ mt: 2 }}
                  startIcon={<RefreshIcon />}
                >
                  Reset Filters
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Shop;