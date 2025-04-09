// src/features/boards/components/InviteUser.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inviteUser } from '../services/boardService';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const InviteUser = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await inviteUser(token, id, email);
      setMessage(res.message);
      toast.success(res.message);
      setEmail('');
      setTimeout(() => navigate(`/boards/${id}`), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to invite user');
      toast.error(err.response?.data.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Invite User to Board
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {message && (
        <Typography color={message.includes('successfully') ? 'success.main' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleInvite}>
          <TextField
            label="User Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Inviting...' : 'Invite'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${id}`)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default InviteUser;