import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { showToast } from '../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from '../features/invitations/components/Invitation';

/**
 * Darken a hex color by a given percentage
 * @param {string} hexColor - Hex color code (e.g., #FF5733)
 * @param {number} percent - Percentage to darken (0 to 100)
 * @returns {string} Darkened hex color
 */
const darkenColor = (hexColor, percent) => {
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  const factor = 1 - percent / 100;
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Navigation bar component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.logout - Logout function
 * @param {string} props.backgroundColor - Background color of the board
 * @returns {JSX.Element}
 */
const Navbar = ({ token, logout, backgroundColor = '#FFFFFF' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);

  // Lấy userId từ token
  let userId = null;
  if (token) {
    try {
      // console.log('Token:', token); // Debug giá trị token
      const payload = JSON.parse(atob(token.split('.')[1]));
      // console.log('Token Payload:', payload); // Debug payload
      userId = payload.userId || payload.id || payload._id || null; // Thử các trường khác nhau
      // console.log('Extracted userId:', userId); // Debug userId
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

        // console.log('Navbar Board Invites:', boardInvites);
        // console.log('Navbar Column Invites:', columnInvites);

        const totalCount =
          (boardInvites?.length || 0) +
          (columnInvites?.length || 0)

        setNotificationCount(totalCount);
      } catch (err) {
        console.error('Failed to fetch pending invitations:', err);
      }
    };

    if (token && userId) {
      fetchPendingInvitations();
    }
  }, [token, userId]);

  const isBoardDetailPage = /^\/boards\/[0-9a-fA-F]{24}$/.test(location.pathname);
  const navbarColor = isBoardDetailPage ? darkenColor(backgroundColor, 20) : undefined;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    if (userId) {
      // console.log('Navigating to /pending-invitations/', userId);
      navigate(`/pending-invitations/${userId}`);
    } else {
      console.error('No userId found, cannot navigate to pending invitations');
      showToast('Unable to navigate to pending invitations. Please try logging in again.', 'error');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: navbarColor }}>
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