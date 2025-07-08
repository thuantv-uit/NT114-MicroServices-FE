import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchUserData, changeAvatar } from '../services/userService'; // Import changeAvatar
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Button,
  Input,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import Chatbot from '../../ai/chatbot';

/**
 * Component to display user dashboard
 * @returns {JSX.Element}
 */
const UserDashboard = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        return;
      }
      setLoading(true);
      try {
        const [userData] = await Promise.all([fetchUserData()]);
        setUser(userData);
      } catch (err) {
        // Errors are handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert('Please select an image file');
      return;
    }
    if (!token) {
      alert('You must be logged in to update avatar');
      return;
    }

    try {
      setLoading(true);
      const response = await changeAvatar(avatarFile); // Use changeAvatar from userService
      setUser(response.user); // Update user with new avatar
      setAvatarFile(null); // Reset file input
      alert('Avatar updated successfully');
    } catch (error) {
      alert('Failed to update avatar: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', my: 4, p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}
      >
        User Dashboard
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Main Content */}
      {!loading && (
        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Profile
                </Typography>
                {user ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={user.avatar || 'https://via.placeholder.com/150'}
                        alt={user.username}
                        sx={{ width: 100, height: 100, mr: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        Welcome, {user.username}!
                      </Typography>
                    </Box>
                    {/* <Typography variant="body1" color="text.secondary">
                      Email: {user.email}
                    </Typography> */}
                    <Box sx={{ mt: 2 }}>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAvatarUpload}
                        disabled={!avatarFile || loading}
                      >
                        Update Avatar
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1" color="error">
                    No user data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Placeholder for Other Features */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Recent Activity
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Chatbot Toggle Button */}
      <IconButton
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          width: 60,
          height: 60,
          boxShadow: 3,
        }}
      >
        <ChatIcon fontSize="large" />
      </IconButton>

      {/* Chatbot Floating Window */}
      {isChatOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: '90%', sm: 400 },
            maxHeight: '70vh',
            zIndex: 1000,
          }}
        >
          <Chatbot onClose={toggleChat} />
        </Box>
      )}
    </Box>
  );
};

export default UserDashboard;