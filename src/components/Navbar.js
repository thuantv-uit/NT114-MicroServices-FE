// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ token, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Tran Van Thuan - NT114
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {token ? (
            <>
              <Button key="dashboard" sx={{ color: 'inherit' }} component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button key="boards" sx={{ color: 'inherit' }} component={Link} to="/boards">
                Boards
              </Button>
              <Button key="logout" sx={{ color: 'inherit' }} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button key="login" sx={{ color: 'inherit' }} component={Link} to="/login">
                Login
              </Button>
              <Button key="register" sx={{ color: 'inherit' }} component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;