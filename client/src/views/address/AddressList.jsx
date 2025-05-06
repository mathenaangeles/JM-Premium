import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Typography, Button, List, ListItem, Divider, Grid, IconButton, Chip } from '@mui/material';
import { EditOutlined as EditOutlinedIcon, DeleteOutlineOutlined as DeleteOutlineOutlinedIcon, AccountBalanceOutlined as AccountBalanceOutlinedIcon, LocalShippingOutlined as LocalShippingOutlinedIcon, Add as AddIcon } from '@mui/icons-material';

import AddressForm from './AddressForm';
import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getUserAddresses, deleteAddress, clearMessages } from '../../slices/addressSlice';

const AddressList = () => {
  const dispatch = useDispatch();

  const { addresses, error, success } = useSelector((state) => state.address);

  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  const openCreateAddressForm = () => {
    setEditData(null);
    setShowForm(true);
  };
  
  const openEditAddressForm = (address) => {
    setEditData(address);
    setShowForm(true);
  };

  const openDeleteConfirmation = (address) => {
    setAddressToDelete(address);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = () => {
    if (addressToDelete) {
      dispatch(deleteAddress({ addressId: addressToDelete.id }));
      setShowDeleteConfirmation(false);
    }
  };

  const getAddressIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'billing':
        return <AccountBalanceOutlinedIcon sx={{ color: 'secondary.main' }} />;
      case 'shipping':
        return <LocalShippingOutlinedIcon sx={{ color: 'secondary.main' }} />;
      default:
        return <LocalShippingOutlinedIcon sx={{ color: 'secondary.main' }} />;
    }
  };
  
  return (
    <Box>
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Addresses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openCreateAddressForm}
        >
          Add Address
        </Button>
      </Box>
      {!addresses || addresses.length === 0 ? (
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
            You have no saved addresses
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Add a shipping or billing address to speed up checkout.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {addresses.map((address) => (
            <React.Fragment key={address.id}>
              <ListItem 
                disablePadding 
                sx={{ 
                  display: 'block', 
                  p: 3, 
                  my: 2,
                  bgcolor: '#fff', 
                  borderRadius: 2,
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Chip
                    icon={getAddressIcon(address.type)}
                    label={address.type || 'Address'}
                    sx={{
                      bgcolor: 'rgba(151, 167, 99, 0.1)',
                      color: 'secondary.main',
                      px: 1,
                      py: 2,
                      '& .MuiChip-icon': {
                        color: 'secondary.main',
                      },
                      textTransform: 'uppercase',
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => openEditAddressForm(address)}
                      color="primary"
                    >
                      <EditOutlinedIcon/>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteConfirmation(address)}
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon/>
                    </IconButton>
                  </Box>
                </Box>
                <Grid container spacing={4} sx={{ my: 1 }}>
                  <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                    <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                      Street
                    </Typography>
                    <Typography variant="body2">
                      {address.line_1}
                      {address.line_2 && <>, {address.line_2}</>}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                      City
                    </Typography>
                    <Typography variant="body2">{address.city}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                      Country
                    </Typography>
                    <Typography variant="body2">{address.country}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                      Zip Code
                    </Typography>
                    <Typography variant="body2">{address.zip_code}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
      {showForm && (
        <AddressForm
          open={showForm}
          initialData={editData}
          onClose={() => setShowForm(false)}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this address?"
          open={showDeleteConfirmation}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </Box>
  );
};

export default AddressList;