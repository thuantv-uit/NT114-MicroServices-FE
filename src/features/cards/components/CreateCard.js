// src/features/cards/components/CreateCard.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCard } from '../services/cardService';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const CreateCard = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const boardId = query.get('boardId') || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createCard(token, title, description, columnId, position);
      setMessage('Card created successfully!');
      toast.success('Card created successfully!');
      setTitle('');
      setDescription('');
      setPosition(0);
      setTimeout(() => navigate(`/boards/${boardId}`), 2000); // Điều hướng về BoardDetail
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to create card');
      toast.error(err.response?.data.message || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create New Card
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
            label="Card Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description (optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating...' : 'Create Card'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${boardId}`)} // Điều hướng về BoardDetail
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCard;