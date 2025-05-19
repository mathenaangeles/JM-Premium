import { Box, Typography, IconButton, Paper, Divider, List, ListItem, Chip, Stack, Grid } from '@mui/material';
import { Close as CloseIcon, LocationOn as LocationOnIcon, Home as HomeIcon, LocalShipping as LocalShippingIcon } from '@mui/icons-material';

const SelectAddress = ({ 
  title = 'Select Address',
  addresses = [], 
  onSelect, 
  onClose,
  addressType = 'shipping'
}) => {
  const getAddressIcon = (type) => {
    switch (type) {
      case 'shipping':
        return <LocalShippingIcon color="primary" />;
      case 'billing':
        return <HomeIcon color="primary" />;
      default:
        return <LocationOnIcon color="primary" />;
    }
  };
  return (
    <Paper 
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: 500,
        borderRadius: 2,
        p: 3,
        outline: 'none',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2" fontWeight="medium">
          {title}
        </Typography>
        <IconButton 
          size="small" 
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {addresses && addresses.length > 0 ? (
        <List disablePadding>
          {addresses.map((address) => (
            <ListItem 
              key={address.id}
              onClick={() => {
                onSelect(address);
                onClose();
              }}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 2,
                p: 2,
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Box width="100%">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  {getAddressIcon(address.type || addressType)}
                  <Typography variant="subtitle1" fontWeight="medium">
                    {address.type || addressType}
                  </Typography>
                  {address.is_default && (
                    <Chip 
                      label="Default" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Stack>
                
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <Box component="span" fontWeight="medium">Street:</Box> {address.line_1}
                    </Typography>
                  </Grid>
                  
                  {address.line_2 && (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="medium">Street 2:</Box> {address.line_2}
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <Box component="span" fontWeight="medium">City:</Box> {address.city}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <Box component="span" fontWeight="medium">Zip Code:</Box> {address.zip_code}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <Box component="span" fontWeight="medium">Country:</Box> {address.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box 
          sx={{ 
            py: 4, 
            textAlign: 'center', 
            color: 'text.secondary' 
          }}
        >
          <LocationOnIcon sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
          <Typography>No saved addresses found.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SelectAddress;