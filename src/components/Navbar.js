import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { showToast } from '../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from '../features/invitations/components/Invitation';

/**
 * Navigation bar component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.logout - Logout function
 * @param {string} props.backgroundColor - Background color of the board (unused in this version)
 * @returns {JSX.Element}
 */
const Navbar = ({ token, logout, backgroundColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);

  // Extract userId from token
  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId || payload.id || payload._id || null;
    } catch (err) {
      console.error('Failed to parse token:', err);
    }
  }

  useEffect(() => {
    const fetchPendingInvitations = async () => {
      if (!userId) return;

      try {
        const boardInvites = await getPendingBoardInvitations(userId);
        const columnInvites = await getPendingColumnInvitations(userId);
        const totalCount = (boardInvites?.length || 0) + (columnInvites?.length || 0);
        setNotificationCount(totalCount);
      } catch (err) {
        console.error('Failed to fetch pending invitations:', err);
      }
    };

    if (token && userId) {
      fetchPendingInvitations();
    }
  }, [token, userId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    if (userId) {
      navigate(`/pending-invitations/${userId}`);
    } else {
      console.error('No userId found, cannot navigate to pending invitations');
      showToast('Unable to navigate to pending invitations. Please try logging in again.', 'error');
    }
  };

  return (
    <AppBar
      position="fixed" // Fixed to stay at the top
      sx={{
        width: '100vw', // Full viewport width
        backgroundColor: '#FFFFFF', // White background
        color: '#000000', // Black text/icons for contrast
        borderBottom: '1px solid #E0E0E0', // Dividing line at the bottom
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        zIndex: 1200, // Ensure Navbar is above Sidebar (zIndex: 1100)
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Task Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {token && (
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/boards">
                Boards
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
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