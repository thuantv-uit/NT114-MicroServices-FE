// src/features/boards/components/DeleteBoard.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteBoard } from '../services/boardService';
import { toast } from 'react-toastify';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';

const DeleteBoard = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    setMessage('');
    setLoading(true);
    try {
      await deleteBoard(token, id);
      setMessage('Board deleted successfully!');
      toast.success('Board deleted successfully!');
      setTimeout(() => navigate('/boards'), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to delete board');
      toast.error(err.response?.data.message || 'Failed to delete board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Delete Board
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
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this board? This action cannot be undone.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Delete Board
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(`/boards/${id}`)}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeleteBoard;