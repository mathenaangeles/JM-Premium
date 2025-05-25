import { Dialog, Box, Typography, IconButton, Paper, Divider, List, ListItem, Chip, Stack, Grid } from '@mui/material';
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
        maxWidth: 600,
        borderRadius: 2,
        outline: 'none',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h5" component="h2" fontWeight="medium">
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
      <Divider sx={{ mb: 1 }} />
      {addresses && addresses.length > 0 ? (
        <Box sx={{ p: 2 }}>
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
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                  }
                }}
              >
                <Box width="100%">
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    {getAddressIcon(address.type || addressType)}
                    <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize', color: 'secondary.main' }}>
                      {address.type || addressType}
                    </Typography>
                    {address.is_default && (
                      <Chip 
                        label="Default" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Stack>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="medium"><b>Address Line 1:</b></Box> {address.line_1}
                      </Typography>
                    </Grid>
                    
                    {address.line_2 && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="medium"><b>Address Line 2:</b></Box> {address.line_2}
                        </Typography>
                      </Grid>
                    )}
                    
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="medium"><b>City:</b></Box> {address.city}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="medium"><b>Zip Code:</b></Box> {address.zip_code}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="medium"><b>Country:</b></Box> {address.country}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ pb: 4, px: 4, pt: 1 }}>
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
        </Box>
      )}
    </Paper>
  );
};

export default SelectAddress;