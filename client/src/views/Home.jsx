import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, Box, Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions, Rating, Divider, IconButton, Paper, Chip, TextField, InputAdornment, Stack, Fade, Grow } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, FavoriteBorder as FavoriteBorderIcon, ShoppingCart as ShoppingCartIcon, SpaOutlined as WellnessIcon, Landscape as NaturalIcon, Science as ScienceIcon, LocalShipping as LocalShippingIcon, Security as SecurityIcon, AssignmentReturn as AssignmentReturnIcon, Email as EmailIcon, Star as StarIcon } from '@mui/icons-material';

import hero from '../assets/hero.png'; 
import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';

const testimonials = [
  {
    id: 1,
    text: "JM Premium transformed not just my skin, but my entire wellness routine. The combination of their skincare and wellness products has given me a glow I never thought possible.",
    author: "Sarah Chen",
    location: "Manila",
    rating: 5
  },
  {
    id: 2,
    text: "The science behind their formulations is impressive, but what I love most is how natural and gentle everything feels. My sensitive skin has never looked better.",
    author: "Maria Santos",
    location: "Cebu",
    rating: 5
  },
  {
    id: 3,
    text: "Finally, a brand that understands holistic beauty. Their approach to combining inner wellness with outer care is exactly what I was looking for.",
    author: "Jennifer Lim",
    location: "Davao",
    rating: 5
  }
];

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '85vh', md: '90vh' },
        background: `linear-gradient(135deg, 
          ${props => props.theme?.palette?.common?.white || '#FAF9F6'} 0%, 
          ${props => props.theme?.palette?.primary?.light || '#F1F6E9'} 50%, 
          ${props => props.theme?.palette?.common?.creme || '#ECE4CE'} 100%)`,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 700,
                    letterSpacing: 2,
                    mb: 1,
                    display: 'block'
                  }}
                >
                  Health & Beauty
                </Typography>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', lg: '3.5rem' },
                    fontWeight: 400,
                    lineHeight: 1.1,
                    mb: 3,
                    color: 'text.primary',
                    maxWidth: '90%'
                  }}
                >
                  Rooted in Ancient Wisdom
                  <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                    Perfected by Science
                  </Box>
                </Typography>
                <Typography 
                  sx={{ 
                    mb: 4,
                    color: 'common.grey',
                    lineHeight: 1.6,
                    maxWidth: '85%',
                    fontWeight: 400,
                    fontSize: theme => theme.typography.h6.fontSize,
                  }}
                >
                  Combining natural heritage with modern science for holistic care. Discover
                  premium products that nourish and empower your inner strength.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink}
                  to="/shop"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    backgroundColor: 'common.black',
                    color: 'common.white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'text.primary',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Fade>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <Grow in timeout={1200}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={hero}
                  alt="JM Premium Beauty"
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const BrandValuesSection = () => {
  const values = [
    {
      icon: <NaturalIcon sx={{ fontSize: 48 }} />,
      title: 'Natural Heritage',
      description: 'Time-honored botanical ingredients sourced sustainably from nature\'s finest offerings'
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 48 }} />,
      title: 'Modern Science',
      description: 'Advanced formulations backed by research to deliver proven, visible results'
    },
    {
      icon: <WellnessIcon sx={{ fontSize: 48 }} />,
      title: 'Holistic Wellness',
      description: 'Complete care that nurtures both your outer glow and inner strength'
    }
  ];
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'common.white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block'
            }}
          >
            OUR PHILOSOPHY
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 400,
              mb: 3,
              color: 'text.primary'
            }}
          >
            Where Science Meets Nature
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'common.grey',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            We believe true beauty radiates from the perfect harmony of nature's wisdom 
            and scientific innovation, creating transformative experiences for the mind and body.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    height: '100%',
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(151, 167, 99, 0.15)'
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 3 }}>
                    {value.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'common.grey',
                      lineHeight: 1.6
                    }}
                  >
                    {value.description}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const FeaturedProductsSection = ({ onAddToCartSuccess }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts({ isFeatured: true, isActive: true, perPage: 8 }));
  }, [dispatch]);

  if (loading || error) { return; }
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'primary.light' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block'
            }}
          >
            BESTSELLERS
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 400,
              mb: 3,
              color: 'text.primary'
            }}
          >
            Featured Products
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'common.grey',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            Our most coveted formulations, crafted to reveal your natural radiance 
            through the power of premium ingredients.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {(products || []).map((product, index) => (
            <Grid key={product.id} size = {{ xs: 12, sm: 6, md: 4 }}>
              <Fade in timeout={800 + index * 200}>
                <Box>
                  <ProductCard product={product} onAddToCartSuccess={onAddToCartSuccess} />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            component={RouterLink}
            to="/shop"
            variant="outlined" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            color="secondary"
            sx={{
              transition: 'all 0.3s ease',
              borderColor: 'secondary.main',
              color: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.main',
                color: 'common.white',
                borderColor: 'secondary.main',
              }
            }}
          >
            Explore All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const TestimonialSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              display: 'block'
            }}
          >
            TESTIMONIALS
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 400,
              mb: 3,
              color: 'text.primary'
            }}
          >
            Customer Stories
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={testimonial.id} xs={12} md={4}>
              <Fade in timeout={1000 + index * 200}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 5,
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: 'common.white',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2, pt: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFA41C', fontSize: '1.2rem' }} />
                    ))}
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      color: 'text.primary'
                    }}
                  >
                    {testimonial.text}
                  </Typography>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {testimonial.author}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: 'common.grey' }}
                    >
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// const NewsletterSection = () => {
//   return (
//     <Box 
//       sx={{ 
//         py: 8,
//         background: `linear-gradient(135deg, 
//           ${props => props.theme?.palette?.primary?.main || '#97A763'} 0%, 
//           ${props => props.theme?.palette?.secondary?.main || '#607049'} 100%)`,
//         // color: 'common.white',
//         position: 'relative',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundImage: `url('/api/placeholder/1200/600')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           opacity: 0.1,
//           zIndex: 0
//         }
//       }}
//     >
//       <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
//         <Typography 
//           variant="h2" 
//           sx={{ 
//             fontSize: { xs: '2rem', md: '2.5rem' },
//             fontWeight: 400,
//             mb: 3
//           }}
//         >
//           Join Our Beauty Community
//         </Typography>
//         <Typography 
//           variant="body1" 
//           sx={{ 
//             mb: 4, 
//             fontSize: '1.1rem',
//             opacity: 0.9,
//             lineHeight: 1.7
//           }}
//         >
//           Be the first to discover new launches, receive credible health and beauty tips, 
//           and enjoy special offers exclusive to our community.
//         </Typography>
//         <Box
//           component="form"
//           sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 2,
//             maxWidth: '600px',
//             mx: 'auto',
//             width: '100%',
//             flexWrap: 'nowrap',
//           }}
//         >
//           <TextField
//             placeholder="Enter your email address"
//             variant="outlined"
//             color="primary"
//             fullWidth
//             slots={{
//               inputAdornedStart: InputAdornment,
//             }}
//             slotProps={{
//               input: {
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon sx={{ color: 'primary.main' }} />
//                   </InputAdornment>
//                 ),
//                 sx: {
//                   px: 1.5,
//                   borderRadius: 25,
//                   height: '56px',
//                 }
//               },
             
//             }}
//           />
//           <Button
//             variant="contained"
//             size="large"
//             color="primary"
//             sx={{
//               whiteSpace: 'nowrap',
//               height: '56px',
//               borderRadius: 25,
//               flexShrink: 0,
//               px: 4,
//             }}
//           >
//             Subscribe
//           </Button>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

const Home = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAddToCartSuccess = () => {
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <HeroSection />
      <BrandValuesSection />
      <FeaturedProductsSection onAddToCartSuccess={handleAddToCartSuccess} />
      <TestimonialSection />
      {/* <NewsletterSection /> */}
       <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          disableWindowBlurListener
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Item was successfully added to cart.
          </Alert>
      </Snackbar>
    </Box>
  );

};

export default Home;