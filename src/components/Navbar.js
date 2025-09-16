import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Badge, Avatar, Popover, Button, Input, Typography, TextField, InputAdornment } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; // Placeholder for Thunio logo icon
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import { showToast } from '../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from '../features/invitations/components/Invitation';
import { fetchUserData, changeAvatar } from '../features/users/services/userService';

/**
 * Navigation bar component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.logout - Logout function
 * @param {string} props.backgroundColor - Background color of the board (unused in this version)
 * @param {boolean} props.isSidebarOpen - State indicating if the sidebar is open
 * @param {Function} props.toggleSidebar - Function to toggle the sidebar visibility
 * @returns {JSX.Element}
 */
const Navbar = ({ token, logout, backgroundColor, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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

    const loadUserData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchPendingInvitations();
      loadUserData();
    }
  }, [token, userId]);

  const handleNotificationClick = () => {
    if (userId) {
      navigate(`/pending-invitations/${userId}`);
    } else {
      console.error('No userId found, cannot navigate to pending invitations');
      showToast('Unable to navigate to pending invitations. Please try logging in again.', 'error');
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAvatarFile(null);
  };

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      showToast('Please select an image file', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await changeAvatar(avatarFile);
      setUser(response.user);
      setAvatarFile(null);
      handleClosePopover();
      showToast('Avatar updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update avatar: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'avatar-popover' : undefined;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100vw',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        borderBottom: '1px solid #E0E0E0',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1200,
      }}
    >
      <Toolbar>
        {/* Left section: Toggle button and Thunio logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <HomeIcon /> {/* Placeholder icon for Thunio logo; replace with <img src="path/to/thunio-logo.png" alt="Thunio" /> if available */}
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, color: '#000000' }}>
            Thunio
          </Typography>
        </Box>

        {/* Center section: Search bar */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            sx={{ width: '50%', bgcolor: '#F5F5F5', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#000000' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right section: Notification, Help, Settings, Avatar/Login */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {token && (
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton color="inherit">
            <HelpOutlineIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          {token && user ? (
            <>
              <IconButton onClick={handleAvatarClick}>
                <Avatar
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt={user.username}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ p: 2, width: 250 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Change Avatar
                  </Typography>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    sx={{ mb: 1, display: 'block' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile || loading}
                    fullWidth
                  >
                    Upload
                  </Button>
                </Box>
              </Popover>
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