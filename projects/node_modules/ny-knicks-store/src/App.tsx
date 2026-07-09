import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// NY Knicks official palette
//   Primary blue  : #006BB6  (Knicks blue)
//   Secondary org : #F58426  (Knicks orange)
//   Dark trim     : #1A2A4F  (deep navy)
//   Court silver  : #BEC0C2  (neutral gray)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006BB6', // Knicks blue
      light: '#3399D6',
      dark: '#1A2A4F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F58426', // Knicks orange
      light: '#FFA85C',
      dark: '#C25E00',
      contrastText: '#000000',
    },
    background: {
      default: '#F4F6F8', // light court-floor gray
      paper: '#ffffff',
    },
    text: {
      primary: '#0E1A2B', // near-black navy
      secondary: '#4A5A6E',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#F58426',
    },
    info: {
      main: '#006BB6',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Oswald"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      color: '#0E1A2B',
    },
    h2: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      color: '#0E1A2B',
    },
    h3: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: '#0E1A2B',
    },
    h4: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: '#0E1A2B',
    },
    h5: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      color: '#0E1A2B',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
      color: '#0E1A2B',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4A5A6E',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4A5A6E',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#0E1A2B',
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#0E1A2B',
    },
    button: {
      fontFamily: '"Oswald", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      color: '#4A5A6E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // sharper corners for athletic feel
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 107, 182, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #006BB6 0%, #1A2A4F 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A2A4F 0%, #006BB6 100%)',
          },
        },
        outlined: {
          borderColor: '#006BB6',
          color: '#006BB6',
          '&:hover': {
            backgroundColor: 'rgba(0, 107, 182, 0.08)',
            borderColor: '#1A2A4F',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(14, 26, 43, 0.08)',
          border: '1px solid #E5E8EC',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 107, 182, 0.18)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(14, 26, 43, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(14, 26, 43, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#006BB6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#006BB6',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0E1A2B',
          boxShadow: '0 2px 8px rgba(14, 26, 43, 0.08)',
          borderBottom: '3px solid #F58426',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          marginBottom: '1.5rem',
        },
        h2: {
          marginBottom: '1.25rem',
        },
        h3: {
          marginBottom: '1rem',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;