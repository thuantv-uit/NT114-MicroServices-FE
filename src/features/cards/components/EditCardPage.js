// src/features/cards/components/EditCardPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { updateCard, fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';

const EditCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || ''; // Cần columnId để lấy danh sách card
  const [existingPositions, setExistingPositions] = useState([]); // Lưu danh sách position hiện có

  // Lấy danh sách card để kiểm tra position
  useEffect(() => {
    const loadCards = async () => {
      try {
        const cards = await fetchCards(token, columnId);
        const positions = cards
          .filter(card => card._id !== cardId) // Loại trừ position của card đang chỉnh sửa
          .map(card => card.position);
        setExistingPositions(positions);
      } catch (err) {
        showToast('Failed to load cards for position validation', 'error');
      }
    };
    if (columnId) {
      loadCards();
    }
  }, [token, columnId, cardId]);

  const initialValues = {
    title: state?.title || '',
    description: state?.description || '',
    position: state?.position || 0,
  };

  const validate = (values) => {
    const errors = {};
    // Kiểm tra title
    if (!values.title) {
      errors.title = 'Title is required';
    } else if (values.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    // Kiểm tra description
    if (values.description && values.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }
    // Kiểm tra position
    if (values.position < 0) {
      errors.position = 'Position cannot be negative';
    } else if (existingPositions.includes(Number(values.position))) {
      errors.position = 'Position must be unique';
    }
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await updateCard(token, cardId, values.title, values.description, values.position);
      showToast('Card updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Failed to update card', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Edit Card</Typography>
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
            error={!!errors.description}
            helperText={errors.description}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Updating...' : 'Update Card'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${boardId}`)}
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditCardPage;