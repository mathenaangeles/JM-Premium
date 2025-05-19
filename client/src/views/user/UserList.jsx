import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { PersonAddAlt as PersonAddAltIcon, PersonRemove as PersonRemoveIcon, Delete as DeleteIcon, SupervisorAccount as SupervisorAccountIcon, Search as SearchIcon, Refresh as RefreshIcon} from '@mui/icons-material';
import { MenuItem, Select, FormControl, Grid, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert, Stack, Chip, IconButton, Tooltip, TextField, InputAdornment, FormControlLabel, Switch, Pagination } from '@mui/material';

import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getUsers, updateUser, deleteUser, clearMessages } from '../../slices/userSlice';

const UserList = () => {
  const dispatch = useDispatch();

  const { users, error, success, count, totalPages } = useSelector((state) => state.user);
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [showAdminOnly, setShowAdminOnly] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const loadUsers = useCallback(() => {
    dispatch(getUsers({
      page: page,
      perPage: perPage,
      search: search.trim(),
      isAdmin: showAdminOnly ? true : undefined,
    }));
  }, [dispatch, page, perPage, search, showAdminOnly]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
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

  const handleAdminFilterChange = (e) => {
    setShowAdminOnly(e.target.checked);
    setPage(1);
  };

  const handleUpdate = (userId, is_admin) => {
    const userData = {
      is_admin: is_admin,
    };
    dispatch(updateUser({ userId, userData }));
  };

  const openDeleteConfirmation = (user) => {
    setUserToDelete(user); 
    setShowDeleteConfirmation(true); 
  };

  const handleDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser({ userId: userToDelete.id }));
      setShowDeleteConfirmation(false);
      setUserToDelete(null); 
    }
  };

  return (
    <Box sx={{ p: 4 }}>
    {error && (
      <Alert severity="error" onClose={() => dispatch(clearMessages())} sx={{ mb: 3 }}>
        {error}
      </Alert>
    )}
    {success && (
      <Alert severity="success" onClose={() => dispatch(clearMessages())} sx={{ mb: 3 }}>
        {success}
      </Alert>
    )}
    <Typography variant="h4" fontWeight={600} mb={3}>
      Manage Users
    </Typography>
    <Grid container spacing={1} alignItems="flex-start" sx={{ my: 3 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          value={search}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search users by name or email"
          slotProps = {{
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
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={showAdminOnly} 
              onChange={handleAdminFilterChange}
              color="primary"
            />
          }
          label="Show Admins Only"
          sx={{ m: 0 }}
        />
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
            setSearch('');
            setShowAdminOnly(false);
            setPage(1);
            setPerPage(10);
            setTimeout(() => loadUsers(), 0);
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
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  {(user.first_name || user.last_name) ? (
                    <>{`${user.first_name} ${user.last_name}`}</>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Anonymous</Typography>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    icon={user.is_admin ? <SupervisorAccountIcon fontSize="small" color="secondary" /> : null}
                    label={user.is_admin ? 'Admin' : 'Regular User'}
                    size="small"
                    sx={{
                      backgroundColor: user.is_admin ? 'primary.light' : 'grey.100',
                      color: user.is_admin ? 'secondary.main' : 'common.grey',
                      fontWeight: 600,
                      p: 1,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} useFlexGap>
                    <Tooltip title={user.is_admin ? 'Remove Admin Role' : 'Grant Admin Role'}>
                      <Button
                        variant="contained"
                        color={user.is_admin ? 'error' : 'primary'}
                        startIcon={user.is_admin ? <PersonRemoveIcon /> : <PersonAddAltIcon />}
                        onClick={() => handleUpdate(user.id, !user.is_admin)}
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Add Admin'}
                      </Button>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon/>}
                      onClick={() => openDeleteConfirmation(user)}
                      sx={{
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Delete User
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 6, bgcolor: 'grey.50' }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {search ? 'Try adjusting your search or filters' : 'If this is not the expected result, please try refreshing the page.'}
                  </Typography>
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
      message={`Are you sure you want to delete ${userToDelete?.first_name || ''} ${userToDelete?.last_name || ''}?`}
      onConfirm={handleDelete}
      onCancel={() => setShowDeleteConfirmation(false)}
    />
  </Box>
  );
};

export default UserList;
