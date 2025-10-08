import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Fade, Snackbar, Alert, Box, Container, Typography, Button, Grid, Stack, Paper, Avatar } from '@mui/material';
import { Landscape as LandscapeIcon, ArrowForward as ArrowForwardIcon,LocalShipping as LocalShippingIcon, CheckCircle as CheckCircleIcon, AssignmentReturn as AssignmentReturnIcon, Spa as SpaIcon, Science as ScienceIcon, Nature as NatureIcon, Star as StarIcon, FormatQuote as FormatQuoteIcon } from '@mui/icons-material';

import hero from '../assets/hero.png'; 
import ProductCard from './product/ProductCard';
import { getProducts } from '../slices/productSlice';

const testimonials = [
  {
    id: 1,
    text: "This coffee has completely transformed my mornings. The blend of natural ingredients gives me energy that lasts all day without any crash.",
    author: "Sarah Chen",
    location: "Manila",
    rating: 5,
    initial: "S"
  },
  {
    id: 2,
    text: "The science behind their formulations is impressive, but what I love most is how natural and gentle everything feels. My sensitive skin has never looked better.",
    author: "Maria Santos",
    location: "Cebu",
    rating: 5,
    initial: "M"
  },
  {
    id: 3,
    text: "Finally found a coffee brand that delivers on both taste and benefits. I'm excited to have it every morning.",
    author: "Jennifer Lim",
    location: "Davao",
    rating: 5,
    initial: "J"
  }
];

const HeroSection = () => {
  return (
    <Box sx={{ 
      backgroundColor: 'common.white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          minHeight: { xs: 'calc(100vh - 80px)' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 4, md: 4 }
        }}>
          <Grid container spacing={{ xs: 0, md: 6 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ 
              order: { xs: 1, md: 1 },
              px: { xs: 3, sm: 4, md: 0 },
              pb: { xs: 4, md: 0 }
            }}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 700,
                    letterSpacing: 2.5,
                    mb: 2.5,
                    display: 'block',
                    fontSize: '0.75rem'
                  }}
                >
                  PREMIUM WELLNESS COFFEE
                </Typography>
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '3rem', sm: '2.5rem', md: '3.3rem', lg: '4rem' },
                    fontWeight: 400,
                    lineHeight: 1.1,
                    mb: 3,
                    color: 'text.primary'
                  }}
                >
                  Energize Your Day
                  <br />
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    Naturally
                  </Box>
                </Typography>

                <Typography 
                  sx={{ 
                    mb: 4,
                    color: 'common.grey',
                    lineHeight: 1.8,
                    fontSize: '1.05rem'
                  }}
                >
                  Coffee infused with tongkat ali and ginseng for sustained energy, enhanced focus, and natural vitality
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink}
                  to="/products/tongkat-ali-ginseng-coffee"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 4.5, 
                    py: 1.75,
                    backgroundColor: 'common.black',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#2A2A2A'
                    }
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              order: { xs: 2, md: 2 }
            }}>
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
            </Grid>
          </Grid>
        </Box>
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

  if (loading || error) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'primary.light' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 650, mx: 'auto', px: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1.5,
              display: 'block',
            }}
          >
            BESTSELLERS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 400,
              mb: 2.5,
              color: 'text.primary',
            }}
          >
            Featured Products
          </Typography>
          <Typography
            sx={{
              color: 'common.grey',
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Discover our premium coffee and beauty formulations designed to elevate your wellness journey.
          </Typography>
        </Box>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 4 }}
          sx={{
            alignItems: 'stretch',
            mx: 'auto',
            width: '100%',
          }}
        >
          {(products || []).map((product, index) => (
            <Grid
              key={product.id}
              size={{ xs: 12, sm: 4, md: 4 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Fade in timeout={800 + index * 120}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <ProductCard
                    product={product}
                    onAddToCartSuccess={onAddToCartSuccess}
                    sx={{ height: '100%', width: '100%' }}
                  />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
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
              px: 4,
              '&:hover': {
                backgroundColor: 'secondary.main',
                color: 'common.white',
                borderColor: 'secondary.main',
              },
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};


const BrandValuesSection = () => {
  const values = [
    {
      icon: <LandscapeIcon sx={{ fontSize: 36 }} />,
      title: 'Natural Heritage',
      description: 'Time-honored botanical ingredients sourced sustainably'
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 36 }} />,
      title: 'Scientific Innovation',
      description: 'Advanced formulations backed by research for proven results'
    },
    {
      icon: <SpaIcon sx={{ fontSize: 36 }} />,
      title: 'Holistic Wellness',
      description: 'Complete care that nurtures your outer beauty and inner vitality'
    }
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(180deg, #F1F6E9 0%, #FAF9F6 100%)',
        position: 'relative',
        boxShadow: 'inset 0 2px 6px rgba(151, 167, 99, 0.08)',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: { xs: 7, md: 9 },
            maxWidth: '700px',
            mx: 'auto',
            px: { xs: 3, sm: 4, md: 0 }
          }}
        >
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'secondary.main',
              fontWeight: 700,
              letterSpacing: 2.5,
              mb: 2,
              display: 'block',
              fontSize: '0.8rem'
            }}
          >
            OUR PHILOSOPHY
          </Typography>

          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 400,
              mb: 2.5,
              color: 'text.primary'
            }}
          >
            Where Science Meets Nature
          </Typography>

          <Typography 
            sx={{ 
              color: 'common.grey',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            True beauty and wellness arise from the harmony between modern science and timeless natural wisdom.
          </Typography>
        </Box>

        {/* Values Grid */}
        <Grid 
          container 
          spacing={{ xs: 4, md: 6 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {values.map((value, index) => (
            <Grid size={{ xs: 12, md: 4 }}key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 },
                    textAlign: 'center',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(151, 167, 99, 0.15)',
                    borderRadius: 3,
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 32px rgba(151, 167, 99, 0.15)',
                      backgroundColor: 'rgba(250, 249, 246, 0.95)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      width: 72,
                      height: 72,
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(151, 167, 99, 0.15)'
                    }}
                  >
                    {value.icon}
                  </Avatar>

                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 1.5, 
                      fontWeight: 400,
                      fontSize: '1.5rem',
                      color: 'text.primary',
                      textAlign: 'center'
                    }}
                  >
                    {value.title}
                  </Typography>

                  <Typography 
                    sx={{ 
                      color: 'common.grey',
                      lineHeight: 1.8,
                      fontSize: '1.05rem',
                      textAlign: 'center'
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

const TestimonialSection = () => {
  return (
    <Box sx={{ py: { xs: 8, sm: 10, md: 13 }, backgroundColor: 'common.white' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: '650px', mx: 'auto', px: 2 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 2.5,
              mb: 2,
              display: 'block',
              fontSize: '0.75rem'
            }}
          >
            TESTIMONIALS
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 400,
              mb: 2.5,
              color: 'text.primary'
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            sx={{ 
              color: 'common.grey',
              fontSize: '1.05rem',
              lineHeight: 1.7
            }}
          >
            Experience the difference that is trusted and loved by our growing community
          </Typography>
        </Box>
        
        <Box sx={{ px: { xs: 3, sm: 4, md: 0 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {testimonials.map((testimonial) => (
              <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 4.5 },
                    height: '100%',
                    borderRadius: '12px',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: '1px solid',
                    borderColor: 'rgba(151, 167, 99, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(151, 167, 99, 0.15)'
                    }
                  }}
                >
                  <FormatQuoteIcon 
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontSize: 48,
                      color: 'primary.main',
                      opacity: 0.15
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', mb: 2.5, gap: 0.3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFA41C', fontSize: '1.2rem' }} />
                    ))}
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      mb: 4,
                      lineHeight: 1.8,
                      fontSize: '1rem',
                      flexGrow: 1,
                      color: 'text.primary',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {testimonial.text}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25, fontSize: '1rem' }}>
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'common.grey', fontSize: '0.875rem' }}>
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
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
      <FeaturedProductsSection onAddToCartSuccess={handleAddToCartSuccess} />
      <BrandValuesSection />
      <TestimonialSection />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Item successfully added to cart
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;