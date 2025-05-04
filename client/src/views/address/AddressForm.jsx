import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { MenuItem, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Stack, Chip, TextField, Typography } from '@mui/material';

import countries from '../../constants/countries';
import { createAddress, updateAddress } from '../../slices/addressSlice';

const AddressForm = ({ initialData = null, onClose, open }) => {
  const dispatch = useDispatch();

  const [addressData, setAddressData] = useState({
    type: '',
    line_1: '',
    line_2: '',
    city: '',
    zip_code: '',
    country: '',
  });

  useEffect(() => {
    if (initialData) {
      setAddressData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await dispatch(updateAddress({ addressId: initialData.id, addressData: addressData }));
    } else {
      await dispatch(createAddress(addressData));
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        sx: {
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: 8,
          p: 2
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {initialData ? 'Edit Address' : 'Add Address'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'common.grey' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField
              select
              name="type"
              label="Type"
              value={addressData.type}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="shipping">Shipping</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
            </TextField>
            <TextField
              name="line_1"
              label="Address Line 1"
              value={addressData.line_1}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="line_2"
              label="Address Line 2"
              value={addressData.line_2}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="city"
              label="City"
              value={addressData.city}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="zip_code"
              label="Zip Code"
              value={addressData.zip_code}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              select
              name="country"
              label="Country"
              value={addressData.country}
              onChange={handleChange}
              fullWidth
              required
            >
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.name.split(' (')[0]}>
                  {country.name.split(' (')[0]}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressForm;
