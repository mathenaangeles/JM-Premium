import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, Box, Typography, Paper, TextField, Button, Alert, Grid, Divider, InputAdornment } from '@mui/material';
import { PersonOutline as PersonOutlineIcon, PhoneOutlined as PhoneOutlinedIcon, PublicOutlined as PublicOutlinedIcon, EmailOutlined as EmailOutlinedIcon } from '@mui/icons-material';

import AddressList from '../address/AddressList';
import countries from '../../constants/countries';
import { getProfile, updateProfile, clearMessages } from '../../slices/userSlice';

const Profile = () => {
  const dispatch = useDispatch();

  const { user, error, success } = useSelector((state) => state.user);

  const [userData, setUserData] = useState({
      first_name: '',
      last_name: '',
      country_code: '',
      phone_number: '',
  });

  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    } else {
      setUserData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        country_code: user.country_code || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(userData));
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'primary.main',
        p: 5,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 'md',
          p: { xs: 4, md: 5 },
          borderRadius: 5,
          bgcolor: 'common.white',
        }}
      >
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
        <Typography 
          variant="h4" 
          align="center"
        >
          Account Details
        </Typography>
        <Box
          sx={{
            height: '2px',
            width: '40px',
            bgcolor: 'primary.main',
            borderRadius: 1,
            mx: 'auto',
            mt: 2,
            mb: 1
          }}
        />
        <Box my={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <EmailOutlinedIcon sx={{ color: 'secondary.main', mr: 1 }} />
            <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
              Email
            </Typography>
          </Box>
          <Typography variant="body1">{user?.email}</Typography>
        </Box>
        {!editMode ? (
          <Box>
            <Box my={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PersonOutlineIcon sx={{ color: 'secondary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                  Name
                </Typography>
              </Box>
              <Typography variant="body1">{user?.first_name} {user?.last_name}</Typography>
            </Box>
            <Box my={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <PhoneOutlinedIcon sx={{ color: 'secondary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="secondary.main" fontWeight={600}>
                  Phone Number
                </Typography>
              </Box>
              { (user.country_code && user.phone_number) ? (
                <Typography variant="body1">({user?.country_code}) {user?.phone_number}</Typography>
              ) : (
                <Typography variant="body2" color="common.grey"> Not Provided </Typography>
              )}
            </Box>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleUpdate} my={4}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }} mb={1}>
                <TextField
                  fullWidth
                  name="first_name"
                  label="First Name"
                  value={userData.first_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }} mb={1}>
                <TextField
                  fullWidth
                  name="last_name"
                  label="Last Name"
                  value={userData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }} mb={1}>
                <TextField
                  select
                  fullWidth
                  name="country_code"
                  label="Country Code"
                  value={userData.country_code}
                  onChange={handleChange}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }} mb={1}>
                <TextField
                  fullWidth
                  name="phone_number"
                  label="Phone Number"
                  value={userData.phone_number}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="secondary">
                Save Changes
              </Button>
            </Box>
          </Box>
        )}
        <Box mt={4}>
          <AddressList />
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
