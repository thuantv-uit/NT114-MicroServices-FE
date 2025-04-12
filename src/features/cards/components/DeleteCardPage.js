// src/features/cards/components/DeleteCardPage.js
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deleteCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';

const DeleteCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';

  const { loading, handleSubmit } = useForm({
    initialValues: {},
    onSubmit: async () => {
      await deleteCard(token, cardId);
      showToast('Card deleted successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Failed to delete card', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Delete Card</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this card? This action cannot be undone.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Delete Card
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(`/boards/${boardId}`)}
            sx={{ flex: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeleteCardPage;