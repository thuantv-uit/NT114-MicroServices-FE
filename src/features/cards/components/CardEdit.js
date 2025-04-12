// src/features/cards/components/CardEdit.js
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Button, TextField, Typography } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { updateCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';

const CardEdit = ({ card, token, onUpdate, onCancel }) => {
  const initialValues = {
    title: card.title,
    description: card.description || '',
    position: card.position,
  };
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
      const updatedCard = await updateCard(token, card._id, values.title, values.description, values.position);
      showToast('Card updated successfully!', 'success');
      onUpdate(updatedCard);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Failed to update card', 'error');
    },
  });

  return (
    <Box sx={{ p: 1 }}>
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
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button variant="outlined" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CardEdit;