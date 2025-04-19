import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { updateColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';

const ColumnEdit = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const initialValues = {
    title: state?.title || '',
  };
  const boardId = state?.boardId || '';

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = 'Title is required';
    } else if (values.title.length <= 5) {
      errors.title = 'Title must be more than 5 characters';
    }
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await updateColumn(token, columnId, values.title);
      showToast('Column updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Failed to update column', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Edit Column</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Column Title"
            variant="outlined"
            fullWidth
            name="title"
            value={values.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/boards/${boardId}`)} fullWidth disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ColumnEdit;