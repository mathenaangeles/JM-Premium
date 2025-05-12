import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// MUI components
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  Divider,
  Checkbox, 
  FormControlLabel, 
  IconButton, 
  Breadcrumbs,
  Chip,
  Drawer,
  useMediaQuery,
  CircularProgress,
  Pagination,
  Collapse,
  List,
  ListItem,
  FormGroup,
  InputAdornment,
  Stack
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';

// MUI icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import TuneIcon from '@mui/icons-material/Tune';

import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';
import { getCategories, getCategoryBreadcrumbs } from '../slices/categorySlice';


const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page')) || 1;
  const initialSearch = queryParams.get('search') || '';
  const initialCategoryIds = queryParams.get('category_ids') ? 
    queryParams.get('category_ids').split(',').map(id => parseInt(id)) : [];
  
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialCategoryIds);
  const [perPage] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const { products, totalProducts, loading: productsLoading } = useSelector(state => state.product);
  const { categories, loading: categoriesLoading } = useSelector(state => state.category);
  const { breadcrumbs } = useSelector(state => state.category);
  
  useEffect(() => {
    dispatch(getCategories({ tree: false }));
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(getProducts({ 
      page, 
      perPage, 
      search, 
      categoryIds: selectedCategoryIds,
      isActive: true 
    }));
    
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (search) params.set('search', search);
    if (selectedCategoryIds.length > 0) params.set('category_ids', selectedCategoryIds.join(','));
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
  }, [dispatch, page, perPage, search, selectedCategoryIds, navigate, location.pathname]);
  
  useEffect(() => {
    if (selectedCategoryIds.length === 1) {
      dispatch(getCategoryBreadcrumbs({ categoryId: selectedCategoryIds[0] }));
    }
  }, [dispatch, selectedCategoryIds]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };
  
  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
    setPage(1);
  };
  
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    });
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); 
  };
  
  const totalPages = Math.ceil(totalProducts / perPage) || 1;
  
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const clearAllFilters = () => {
    setSearch('');
    setSearchInput('');
    setSelectedCategoryIds([]);
    setPage(1);
  };
  
  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    return (
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="product category breadcrumbs"
        sx={{ mb: 4 }}
      >
        <Link 
          to="/shop" 
          style={{ 
            color: theme.palette.text.secondary, 
            textDecoration: 'none',
            '&:hover': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
            },
          }}
        >
          Shop
        </Link>
        
        {breadcrumbs.map((item, index) => (
          index === breadcrumbs.length - 1 ? (
            <Typography key={item.id} color="primary" fontWeight={500}>
              {item.name}
            </Typography>
          ) : (
            <Link
              key={item.id}
              to={`/shop?category_ids=${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategoryIds([item.id]);
              }}
              style={{ 
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                },
              }}
            >
              {item.name}
            </Link>
          )
        ))}
      </Breadcrumbs>
    );
  };
  
  const renderCategories = (categoryList, level = 0) => {
    if (!categoryList || categoryList.length === 0) return null;
    
    return categoryList.map(category => (
      <Box key={category.id} sx={{ pl: level * 2 }}>
        <ListItem 
          sx={{ 
            py: 0.5, 
            pr: 0,
            borderLeft: level > 0 ? `1px solid ${theme.palette.divider}` : 'none',
            ml: level > 0 ? 1 : 0,
            pl: level > 0 ? 1 : 0,
          }}
          dense
          disablePadding
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {category.children && category.children.length > 0 && (
              <IconButton 
                onClick={() => toggleCategoryExpansion(category.id)}
                size="small"
                sx={{ mr: 0.5 }}
                aria-label={expandedCategories[category.id] ? "Collapse category" : "Expand category"}
              >
                {expandedCategories[category.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
            
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
        
        <Collapse 
          in={expandedCategories[category.id]} 
          timeout="auto" 
          unmountOnExit
        >
          <List component="div" disablePadding dense>
            {category.children && category.children.length > 0 && renderCategories(category.children, level + 1)}
          </List>
        </Collapse>
      </Box>
    ));
  };
  
  const renderActiveFilters = () => {
    if (search || selectedCategoryIds.length > 0) {
      return (
        <Box sx={{ mb: 3, mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            
            <Button 
              size="small" 
              onClick={clearAllFilters} 
              sx={{ ml: 'auto' }}
              color="primary"
            >
              Clear all
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
                color="default"
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
                  color="primary"
                />
              ) : null;
            })}
          </Box>
        </Box>
      );
    }
    return null;
  };

  const FiltersContent = () => (
    <Box sx={{ p: 0 }}>
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          Search
        </Typography>
        <TextField
          fullWidth
          placeholder="Search products..."
          variant="outlined"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button 
          type="submit"
          fullWidth
          variant="contained" 
          color="primary"
          size="medium"
        >
          Search
        </Button>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
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
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 300 }}>
              Shop
            </Typography>
            {selectedCategoryIds.length === 1 && breadcrumbs && renderBreadcrumbs()}
          </Box>
          
          {/* Mobile filter button */}
          {isMobile && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<TuneIcon />}
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
              <Typography variant="h6">Filters</Typography>
              <IconButton onClick={toggleDrawer(false)} edge="end">
                <CloseIcon />
              </IconButton>
            </Box>
            <FiltersContent />
          </Drawer>
          
          {renderActiveFilters()}
          
          <Grid container spacing={4}>
            {/* Desktop sidebar */}
            <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <FiltersContent />
              </Paper>
            </Grid>
            
            {/* Main product area */}
            <Grid item xs={12} md={9} lg={9.5}>
              {productsLoading ? (
                <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={48} color="primary" />
                </Box>
              ) : products?.length > 0 ? (
                <>
                  <Grid container spacing={3}>
                    {products.map(product => (
                      <Grid item xs={12} sm={6} lg={4} xl={3} key={product.id}>
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
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Showing {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalProducts)} of {totalProducts} products
                    </Typography>
                  </Box>
                </>
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </Typography>
                  {(search || selectedCategoryIds.length > 0) && (
                    <Button 
                      variant="contained"
                      color="primary"
                      onClick={clearAllFilters}
                      sx={{ mt: 2 }}
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
    </ThemeProvider>
  );
};

export default Shop;