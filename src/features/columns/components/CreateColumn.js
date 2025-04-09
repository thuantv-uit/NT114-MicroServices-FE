// src/features/columns/components/CreateColumn.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createColumn } from '../services/columnService';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const CreateColumn = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await createColumn(token, title, id, position);
      setMessage('Column created successfully!');
      toast.success('Column created successfully!');
      setTitle('');
      setPosition(0);
      setTimeout(() => navigate(`/boards/${id}`), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to create column');
      toast.error(err.response?.data.message || 'Failed to create column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create New Column
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Column Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            label="Position"
            fullWidth
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
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
              {loading ? 'Creating...' : 'Create Column'}
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

export default CreateColumn;