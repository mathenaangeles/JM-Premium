import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Star as StarIcon,Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Select, FormControl, Switch, IconButton, InputAdornment, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, FormControlLabel, MenuItem, Pagination, Alert, Chip, Stack, Grid, LinearProgress } from '@mui/material';

import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getProducts, deleteProduct, clearProductMessages } from '../../slices/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();

  const { products, loading, error, success, count, totalPages} = useSelector((state) => state.product);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const loadProducts = useCallback(() => {
    dispatch(getProducts({
      page: page,
      per_page: perPage,
      search: search.trim(),
      isFeatured: showActiveOnly ? true : undefined,
      isActive: showFeaturedOnly ? true : undefined,
    }));
  }, [dispatch, page, perPage, search, showActiveOnly, showFeaturedOnly]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
    setPage(1); 
  };

  const handleActiveFilterChange = (e) => {
    setShowActiveOnly(e.target.checked);
    setPage(1);
  };

  const handleFeaturedFilterChange = (e) => {
    setShowFeaturedOnly(e.target.checked);
    setPage(1);
  };

  const openDeleteConfirmation = (product) => {
    setProductToDelete(product); 
    setShowDeleteConfirmation(true); 
  };
  
  const handleDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct({ productId: productToDelete.id }));
      setShowDeleteConfirmation(false);
      setProductToDelete(null); 
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearProductMessages())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => dispatch(clearProductMessages())} sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Manage Products
        </Typography>
        <Button 
          component={Link}
          to="/manage/products/form/"
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}>
          Add New Product
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, my: 3 }}>
        <TextField
          value={search}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search products by name"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          variant="outlined"
          size="small"
        />
        <FormControlLabel
          control={
            <Switch 
              checked={showActiveOnly} 
              onChange={handleActiveFilterChange}
              color="primary"
              size="small"
            />
          }
          label="Show Active Only"
          sx={{ m: 0 }}
        />
        <FormControlLabel
          control={
            <Switch 
              checked={showFeaturedOnly} 
              onChange={handleFeaturedFilterChange}
              color="primary"
              size="small"
            />
          }
          label="Show Featured Only"
          sx={{ m: 0, flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            setSearch('');
            setShowActiveOnly(false);
            setShowFeaturedOnly(false);
            setPage(1);
            setPerPage(10);
            setTimeout(() => loadProducts(), 0);
          }}
        >
          Reset Filters
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0, pb: 2 }}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
          <TableBody>
            {products?.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                      {product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#F5F5F5',
                          color: 'grey',
                        }}>
                          <ImageNotSupportedOutlinedIcon fontSize="large" />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                  <Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        component={Link}
                        to={`/products/${product.slug}`}
                        variant="body2"
                        fontWeight={600}
                        color="inherit"
                        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {product.name}
                      </Typography>
                      {product.is_featured && (
                        <StarIcon fontSize="small" color="primary" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {product.variants?.length > 0
                        && `${product.variants.length} Variant${product.variants.length > 1 ? 's' : ''}`}
                    </Typography>
                  </Box>
                  </TableCell>
                  <TableCell>₱{product.display_price?.toFixed(2)}</TableCell>
                  <TableCell>{product.total_stock}</TableCell>
                  <TableCell><Chip label={product.is_active ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: product.is_active ? 'primary.light' : 'grey.100', color: product.is_active ? 'secondary.main' : 'common.grey', p: 1, fontWeight: 600 }} /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} useFlexGap>
                      <Link to={`/manage/products/form/${product.id}`}>
                        <Button variant="outlined" color="primary" startIcon={<EditIcon size="small"/>} sx={{ whiteSpace: 'nowrap' }} size="small">Edit</Button>
                      </Link>
                      <Button variant="outlined" color="error" startIcon={<DeleteIcon size="small"/>}  onClick={() => openDeleteConfirmation(product)} sx={{ whiteSpace: 'nowrap' }} size="small">Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Typography variant="h6" color="text.primary" fontWeight={500}>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Try adjusting your search or filters' : 'If this is not the expected result, please try refreshing the page.'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          )}
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Rows per page:</Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              displayEmpty
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 4 }}>
            {count > 0 ? `Showing ${(page - 1) * perPage + 1}-${Math.min(page * perPage, count)} of ${count}` : 'No results found'}
          </Typography>
        </Box>
        <Pagination 
          count={totalPages || 1} 
          page={page} 
          onChange={handlePageChange} 
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        message={`Are you sure you want to delete ${productToDelete?.name || 'this product'}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Box>
  );
};

export default ProductList;
