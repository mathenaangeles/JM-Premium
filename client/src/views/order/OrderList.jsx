import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Storefront as StorefrontIcon, Refresh as RefreshIcon} from '@mui/icons-material';
import { Select, FormControl, InputLabel, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Pagination, Alert, Chip, Grid, LinearProgress } from '@mui/material';

import { getUserOrders, getOrders, resetCurrentPage, clearOrderMessages } from '../../slices/orderSlice';

const OrderList = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.user);
  const { orders, loading, error, totalPages, currentPage, count } = useSelector((state) => state.order);
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [statusFilter, setStatusFilter] = useState('');
  
  const isAdmin = user?.is_admin;

  const loadOrders = useCallback((page, perPage, status) => {
    const params = { page, perPage, status };
    if (userId) {
      dispatch(getUserOrders(params));
    } else if (isAdmin) {
      dispatch(getOrders(params));
    }
  }, [dispatch, userId, isAdmin]);

  useEffect(() => {
    loadOrders(currentPage, perPage, statusFilter);
  }, [loadOrders, currentPage, perPage, statusFilter]);

  useEffect(() => {
    dispatch(resetCurrentPage());
  }, [dispatch, userId, isAdmin]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handlePerPageChange = (e) => {
    setPerPage(e.target.value);
    setPage(1); 
  };

  const handleFilterChange = (e) => {
    const status = e.target.value === 'all' ? null : e.target.value;
    setStatusFilter(status);
  };

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearOrderMessages())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" fontWeight={600} mb={3}>
        {userId ? 'My Orders' : isAdmin ? 'Manage Orders' : 'My Orders'}
      </Typography>
       <Grid container spacing={1} justifyContent="space-between" alignItems="center" sx={{ my: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ 
              minWidth: { sm: 200 },
              }}
          >
            <InputLabel id="sort-select-label">Status Filter</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={statusFilter}
              onChange={handleFilterChange}
              label="Status Filter"
            >
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }} sx={{
            display: 'flex',
            justifyContent: {
              xs: 'flex-start',
              md: 'flex-end',
            },
            alignItems: 'center',
          }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
            }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              {isAdmin && (<TableCell>Email</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ p: 0, pb: 2 }}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          ) : orders?.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography
                      component={Link}
                      to={`/orders/${order.id}`}
                      variant="body2"
                      fontWeight={600}
                      color="inherit"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      {order.id}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>₱{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.light',
                      color: 'secondary.main',
                      fontWeight: 600,
                      p: 1,
                      textTransform: 'capitalize',
                    }}
                  />
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {order.user?.email || order.email || 'N/A'}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    No orders found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    If this is not the expected result, please try refreshing the page.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/shop')}
                    startIcon={<StorefrontIcon />}
                    sx={{ mt: 1 }}
                  >
                    Shop Now
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          )}
          </TableBody>
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
    </Box>
  );
};

export default OrderList;