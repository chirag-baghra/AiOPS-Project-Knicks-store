import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Fade,
  Slide,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  SportsBasketball as SportsBasketballIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      console.log('[Home] Loading products...');
      try {
        const featuredProducts = await productService.getAll();
        console.log('[Home] Got products:', featuredProducts.length);
        setProducts(featuredProducts.slice(0, 8));
      } catch (error) {
        console.error('[Home] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <LoadingSkeleton count={8} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section — Knicks arena vibe */}
      <Box
        sx={{
          background:
            'linear-gradient(135deg, #006BB6 0%, #1A2A4F 60%, #0E1A2B 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid #F58426',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: '#F58426',
                      letterSpacing: '0.2em',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    OFFICIAL TEAM STORE
                  </Typography>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.75rem' },
                      color: '#ffffff',
                      lineHeight: 1.05,
                    }}
                  >
                    Gear up like
                    <Box component="span" sx={{ color: '#F58426' }}>
                      {' '}the Knicks
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{
                      mb: 4,
                      lineHeight: 1.6,
                      fontWeight: 400,
                      opacity: 0.9,
                      textTransform: 'none',
                      letterSpacing: 0,
                      color: '#E8EEF6',
                    }}
                  >
                    Authentic jerseys, signature Jordans, hardwood-ready basketballs, and courtside hoodies — built for fans who live orange and blue.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ShoppingBagIcon />}
                      href="/products"
                      sx={{
                        backgroundColor: '#F58426',
                        color: '#0E1A2B',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#FFA85C',
                        },
                      }}
                    >
                      Shop the Store
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      href="#featured"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          borderColor: '#F58426',
                        },
                      }}
                    >
                      What's New
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide in timeout={1500} direction="right">
                <Box
                  sx={{
                    height: { xs: 300, md: 400 },
                    background:
                      'linear-gradient(135deg, #F58426 0%, #C25E00 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '4px solid #ffffff',
                  }}
                >
                  <SportsBasketballIcon
                    sx={{
                      fontSize: { xs: 140, md: 200 },
                      color: '#ffffff',
                      opacity: 0.95,
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      right: 24,
                      color: '#0E1A2B',
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      letterSpacing: '0.15em',
                      fontWeight: 700,
                    }}
                  >
                    #NEWYORK
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <ShippingIcon sx={{ fontSize: 48, color: '#006BB6', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over $75
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 48, color: '#006BB6', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Secure Checkout
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SSL-encrypted every step
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <StarIcon sx={{ fontSize: 48, color: '#F58426', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Authentic Gear
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Officially licensed by the NBA
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <RefreshIcon sx={{ fontSize: 48, color: '#F58426', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Easy Returns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30-day no-questions-asked
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: '#EEF2F6', py: 8 }} id="featured">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#F58426',
                fontWeight: 700,
                letterSpacing: '0.2em',
              }}
            >
              GAME DAY
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
              Featured Gear
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
              Top picks from the Knicks locker room
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={addItem}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              href="/products"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              Shop All
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;