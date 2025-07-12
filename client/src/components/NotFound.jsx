import { ShoppingBag as ShoppingBagIcon, Home as HomeIcon } from '@mui/icons-material';
import { Box, Typography, Button, Container, Paper, useTheme, styled } from '@mui/material';

const StyledContainer = styled(Container)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const NotFound = () => {
  const theme = useTheme();
  return (
    <StyledContainer maxWidth="lg">
      <Paper 
        elevation={2} 
        sx= {{
            padding: theme.spacing(6, 4),
            textAlign: 'center',
            borderRadius: theme.spacing(3),
            position: 'relative',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" component="div" sx={{ color: 'primary.main', fontSize: '8rem', }}>
            404
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 300,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            We couldn't find the page you're looking for. 
            Browse our shop to see the best products.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBagIcon />}
            href="/shop"
          >
            Explore our Collections
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            href="/"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
          >
            Return Home
          </Button>
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default NotFound;