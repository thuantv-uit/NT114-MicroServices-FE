import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchUserData, changeAvatar } from '../services/userService';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Chat as ChatIcon, Task, GroupAdd, Edit } from '@mui/icons-material';
import Chatbot from '../../ai/chatbot';
import { COLORS } from '../../../constants/color';

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
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [userData] = await Promise.all([fetchUserData()]);
        setUser(userData);
      } catch (err) {
        // Errors handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  const handleAvatarChange = (e) => setAvatarFile(e.target.files[0]);

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert('Please select an image file');
    if (!token) return alert('You must be logged in to update avatar');

    try {
      setLoading(true);
      const response = await changeAvatar(avatarFile);
      setUser(response.user);
      setAvatarFile(null);
      setShowAvatarInput(false);
      alert('Avatar updated successfully');
    } catch (error) {
      alert('Failed to update avatar: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleAvatarInput = () => {
    setShowAvatarInput((prev) => !prev);
    setAvatarFile(null);
  };

  return (
    <Box
      sx={{
      position: 'fixed', // ✅ giúp layout full viewport, không padding
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflowY: 'auto', // ✅ cho phép cuộn nếu nội dung vượt khung
      bgcolor: COLORS.background,
      m: 0,
      p: 0,
    }}
    >
      
      {/* Header */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: COLORS.primary,
          textAlign: 'center',
        }}
      >
        User Dashboard
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} sx={{ color: COLORS.primary }} />
        </Box>
      )}

      {/* Main Content */}
      {!loading && (
        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                bgcolor: COLORS.card,
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'medium', mb: 2, color: COLORS.text }}
                >
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
                      <Typography variant="h6" sx={{ color: COLORS.textLight }}>
                        Welcome, {user.username}!
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={toggleAvatarInput}
                        sx={{
                          mb: 1,
                          borderColor: COLORS.primary,
                          color: COLORS.primary,
                          '&:hover': {
                            borderColor: COLORS.textLight,
                            color: COLORS.textLight,
                          },
                        }}
                      >
                        {showAvatarInput ? 'Cancel' : 'Change Avatar'}
                      </Button>
                      {showAvatarInput && (
                        <>
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
                            sx={{
                              bgcolor: COLORS.primary,
                              color: COLORS.white,
                              textTransform: 'none',
                              '&:hover': { bgcolor: COLORS.textLight },
                            }}
                          >
                            Upload
                          </Button>
                        </>
                      )}
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

          {/* Recent Activity Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                bgcolor: COLORS.card,
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'medium', mb: 2, color: COLORS.text }}
                >
                  Recent Activity
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Task sx={{ color: COLORS.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed task: Project Plan"
                      secondary="2 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GroupAdd sx={{ color: COLORS.expense }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Invited user to Team Board"
                      secondary="Yesterday"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Edit sx={{ color: COLORS.income }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Updated profile information"
                      secondary="3 days ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Task Deadlines Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                bgcolor: COLORS.card,
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'medium', mb: 2, color: COLORS.text }}
                >
                  Total of all Deadlines
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={80}
                      size={100}
                      thickness={5}
                      sx={{ color: COLORS.primary }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: COLORS.text }}
                      >
                        80%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ color: COLORS.textLight, textAlign: 'center' }}
                >
                  80% Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Chatbot Floating Button */}
      <IconButton
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: COLORS.primary,
          color: COLORS.white,
          '&:hover': { bgcolor: COLORS.textLight },
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