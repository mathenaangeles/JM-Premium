import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Rating,
  Divider,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  EmojiNature as EmojiNatureIcon,
  Spa as SpaIcon,
  CompostOutlined as EcoOutlinedIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  AssignmentReturn as AssignmentReturnIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Mock featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Healthy Eye Oil',
    price: 34.99,
    rating: 4.8,
    image: '/api/placeholder/400/400',
    category: 'Skincare'
  },
  {
    id: 2,
    name: 'Healthy Cream',
    price: 29.99,
    rating: 4.7,
    image: '/api/placeholder/400/400',
    category: 'Skincare'
  },
  {
    id: 3,
    name: 'Healthy Skin Cream',
    price: 39.99,
    rating: 4.9,
    image: '/api/placeholder/400/400',
    category: 'Skincare'
  }
];

// Mock bestseller products
const bestsellerProducts = [
  {
    id: 4,
    name: 'Bae Lactic Acid',
    price: 44.99,
    rating: 4.9,
    image: '/api/placeholder/400/400',
    category: 'Skincare'
  },
  {
    id: 5,
    name: 'Summer in Zanzibar Radiant Collagen Boost Moisturizer',
    price: 48.00,
    rating: 4.7,
    image: '/api/placeholder/400/400',
    category: 'Moisturizer'
  },
  {
    id: 6, 
    name: 'Sun Spray Lotion',
    price: 27.99,
    rating: 4.6,
    image: '/api/placeholder/400/400',
    category: 'Body Care'
  },
  {
    id: 7,
    name: 'Vegan Lip Balm',
    price: 12.99,
    rating: 4.8,
    image: '/api/placeholder/400/400',
    category: 'Lip Care'
  }
];

// Mock testimonials
const testimonials = [
  {
    id: 1,
    text: "Beauty Essence completely transformed my skin! Within a few weeks, my skin felt smoother, brighter and healthier.",
    author: "Emily T."
  },
  {
    id: 2,
    text: "I've tried dozens of skincare brands, but nothing compares to the quality and results I get from Beauty Essence products.",
    author: "Michael R."
  },
  {
    id: 3,
    text: "Their commitment to sustainability and clean beauty is what initially drew me in, but the amazing products are why I'm a loyal customer now.",
    author: "Sophia L."
  }
];

const HeroSection = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '90vh' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8f5f2',
        mb: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
            <Typography 
              variant="overline" 
              component="div" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                letterSpacing: 3
              }}
            >
              PREMIUM PRODUCTS
            </Typography>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontFamily: 'serif',
                fontWeight: 300,
                fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                lineHeight: 1.1,
                mb: 2
              }}
            >
              Premium Skincare for Maximum Results
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                fontSize: '1.1rem',
                maxWidth: '80%'
              }}
            >
              Discover our range of clean, sustainable beauty products designed to enhance your natural beauty and promote healthy skin.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                component={RouterLink}
                to="/shop"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 0,
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                Shop Now
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={RouterLink}
                to="/about"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 0,
                  borderColor: 'black',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#333',
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img"
              src="/api/placeholder/600/600"
              alt="Beautiful skin"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '50% 0 50% 50%',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const TestimonialSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#faf6f3' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 400,
              color: 'text.secondary',
              mb: 1
            }}
          >
            TESTIMONIALS
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontFamily: 'serif',
              fontWeight: 300,
              mb: 2
            }}
          >
            What Our Customers Say
          </Typography>
          <Divider sx={{ width: '80px', margin: '0 auto', borderColor: 'primary.main', borderWidth: 2 }} />
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item key={testimonial.id} xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: '4rem', 
                    color: '#ddd', 
                    height: '40px', 
                    mb: 2 
                  }}
                >
                  "
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    flexGrow: 1
                  }}
                >
                  "{testimonial.text}"
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {testimonial.author}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const CTASection = () => {
  return (
    <Box 
      sx={{ 
        py: 10,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/api/placeholder/1200/600")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            fontFamily: 'serif',
            fontWeight: 300,
            mb: 3
          }}
        >
          More Than Just Skin Deep
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Join our community of beauty enthusiasts who believe in the power of clean, sustainable skincare.
          Subscribe to our newsletter for exclusive offers, skincare tips, and early access to new product launches.
        </Typography>
        <Box 
          component="form" 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '1rem',
              border: 'none',
              outline: 'none',
            }}
          />
          <Button 
            variant="contained" 
            sx={{ 
              px: 4, 
              py: { xs: 1.5, sm: 0 },
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const ServiceSection = () => {
  return (
    <Box sx={{ py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 36, mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free shipping on orders over $50
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SecurityIcon sx={{ fontSize: 36, mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure payment processing
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AssignmentReturnIcon sx={{ fontSize: 36, mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Return Policy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30-day money back guarantee
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const Home = () => {
  return (
    <Box>
      <HeroSection />
      <ServiceSection />
      <FeaturedProductsSection />
      <ValuesSection />
      <BestsellerSection />
      <TestimonialSection />
      <CTASection />
    </Box>
  );
};

export default Home;

const FeaturedProductsSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 400,
              color: 'text.secondary',
              mb: 1
            }}
          >
            DISCOVER OUR COLLECTION
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontFamily: 'serif',
              fontWeight: 300,
              mb: 2
            }}
          >
            Featured Products
          </Typography>
          <Divider sx={{ width: '80px', margin: '0 auto', borderColor: 'primary.main', borderWidth: 2 }} />
        </Box>
        
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    {product.category}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      backgroundColor: 'black',
                      '&:hover': {
                        backgroundColor: '#333'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton aria-label="add to favorites">
                    <FavoriteBorderIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            component={RouterLink}
            to="/shop"
            variant="outlined" 
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 0,
              borderColor: 'black',
              color: 'black',
              '&:hover': {
                borderColor: '#333',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const ValuesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#faf6f3' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 400,
              color: 'text.secondary',
              mb: 1
            }}
          >
            OUR COMMITMENT
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontFamily: 'serif',
              fontWeight: 300,
              mb: 2
            }}
          >
            Clean Beauty. Clear Conscience.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '700px', mx: 'auto' }}>
            From the first raw ingredient to the very last molecule, our formulas are all good.
            We believe in beauty that doesn't compromise your health or the planet.
          </Typography>
          <Divider sx={{ width: '80px', margin: '0 auto', borderColor: 'primary.main', borderWidth: 2 }} />
        </Box>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <EmojiNatureIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Natural Ingredients
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We source the highest quality natural ingredients that are effective and safe for all skin types.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <SpaIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Cruelty-Free
              </Typography>
              <Typography variant="body1" color="text.secondary">
                All our products are cruelty-free. We never test on animals and work only with ethical suppliers.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <EcoOutlinedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                Sustainable Packaging
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our packaging is designed to minimize environmental impact, using recycled and recyclable materials.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const BestsellerSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 400,
              color: 'text.secondary',
              mb: 1
            }}
          >
            CUSTOMER FAVORITES
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontFamily: 'serif',
              fontWeight: 300,
              mb: 2
            }}
          >
            Best Selling Products
          </Typography>
          <Divider sx={{ width: '80px', margin: '0 auto', borderColor: 'primary.main', borderWidth: 2 }} />
        </Box>
        
        <Grid container spacing={3}>
          {bestsellerProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card 
                elevation={0} 
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                  />
                  <Chip 
                    label="BESTSELLER" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      left: 10, 
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    {product.category}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      backgroundColor: 'black',
                      '&:hover': {
                        backgroundColor: '#333'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton aria-label="add to favorites" size="small">
                    <FavoriteBorderIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}