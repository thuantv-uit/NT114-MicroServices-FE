// src/features/users/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchUserData, fetchAllUsers } from '../services/userService';
import { toast } from 'react-toastify';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const UserDashboard = ({ token }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, usersData] = await Promise.all([
        fetchUserData(token),
        fetchAllUsers(token),
      ]);
      setUser(userData);
      setAllUsers(usersData);
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      {loading && <CircularProgress />}
      {user ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Welcome, {user.username}!</Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>
      ) : (
        !loading && <Typography>No user data</Typography>
      )}
      <Typography variant="h5" gutterBottom>All Users</Typography>
      <List>
        {allUsers.map((u) => (
          <ListItem key={u._id}>
            <ListItemText primary={`${u.username} - ${u.email}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserDashboard;
// Tran Van Thuan