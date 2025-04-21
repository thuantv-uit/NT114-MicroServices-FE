import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchUserData, fetchAllUsers } from '../services/userService';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

/**
 * Component to display user dashboard
 * @returns {JSX.Element}
 */
const UserDashboard = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        return;
      }
      setLoading(true);
      try {
        const [userData, usersData] = await Promise.all([
          fetchUserData(),
          fetchAllUsers(),
        ]);
        setUser(userData);
        setAllUsers(usersData);
      } catch (err) {
        // Errors are handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {user ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Welcome, {user.username}!</Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>
      ) : (
        !loading && <Typography>No user data available</Typography>
      )}
      <Typography variant="h5" gutterBottom>All Users</Typography>
      {allUsers.length > 0 ? (
        <List>
          {allUsers.map((u) => (
            <ListItem key={u._id}>
              <ListItemText primary={`${u.username} - ${u.email}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No users found</Typography>
      )}
    </Box>
  );
};

export default UserDashboard;