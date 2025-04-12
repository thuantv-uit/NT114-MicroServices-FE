// src/features/cards/components/CreateCard.js
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { createCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';

const CreateCard = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const initialValues = { title: '', description: '', position: 0 };
  const validate = (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (values.position < 0) errors.position = 'Position cannot be negative';
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await createCard(token, values.title, values.description, columnId, values.position);
      showToast('Card created successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Failed to create card', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Create New Card</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Card Title"
            variant="outlined"
            fullWidth
            name="title"
            value={values.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description (optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            name="description"
            value={values.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            type="number"
            name="position"
            value={values.position}
            onChange={handleChange}
            error={!!errors.position}
            helperText={errors.position}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
              {loading ? 'Creating...' : 'Create Card'}
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/boards/${boardId}`)} fullWidth>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCard;