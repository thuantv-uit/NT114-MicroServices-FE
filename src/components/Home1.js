import React from 'react';
import Header from '../components/Header';
import { Container, Typography, Button, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GetAppIcon from '@mui/icons-material/GetApp';
import websiteImage from '../assets/Home/home.png';

const Home = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container sx={{ mt: 4, textAlign: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'medium' }}>
          Thunio brings all your{' '}
          <span style={{ fontWeight: 'bold', color: '#1976d2' }}>tasks</span>
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 'medium', mt: 1, mb: 3 }}
        >
          <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Teammates</span>{' '}
          and <span style={{ fontWeight: 'bold', color: '#1976d2' }}>tools</span>{' '}
          together
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PlayArrowIcon />}
            sx={{ textTransform: 'none', px: 3, py: 1 }}
          >
            Watch Video
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
            sx={{ textTransform: 'none', px: 3, py: 1 }}
          >
            Download Now
          </Button>
        </Box>
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <img
            src={websiteImage}
            alt="Thunio Website"
            style={{ width: '100%', maxHeight: 700, objectFit: 'contain' }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;