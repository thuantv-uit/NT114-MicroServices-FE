// import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Link,
  Divider,
} from '@mui/material';

/**
 * Component for the home page
 * @returns {JSX.Element}
 */
const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg,rgb(20, 226, 27) 0%,rgb(60, 28, 240) 100%)', // Gradient nền
        // Nếu muốn dùng hình ảnh: background: 'url(/images/background.jpg) no-repeat center/cover',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 500, // Rộng hơn một chút so với Login/Register
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)', // Nền trắng mờ để dễ đọc
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <img
            src="https://www.svgrepo.com/show/354463/trello.svg"
            alt="Thunio Logo"
            style={{ width: '30px', height: 'auto' }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Thunio
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
          Welcome to Thunio
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          NT114 - Web Application for Creating Timelines easily and efficiently.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            NT114, Web Application for Creating Timelines
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/about" variant="body2" sx={{ color: 'primary.main' }}>
              About Us
            </Link>
            <Link href="/contact" variant="body2" sx={{ color: 'primary.main' }}>
              Contact
            </Link>
            <Link href="/privacy" variant="body2" sx={{ color: 'primary.main' }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;