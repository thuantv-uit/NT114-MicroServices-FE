// src/features/columns/components/CreateColumn.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { createColumn, fetchColumns } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';

const CreateColumn = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingPositions, setExistingPositions] = useState([]); // Lưu danh sách position hiện có

  // Lấy danh sách cột để kiểm tra position
  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columns = await fetchColumns(token, id);
        const positions = columns.map(column => column.position);
        setExistingPositions(positions);
      } catch (err) {
        showToast('Failed to load columns for position validation', 'error');
      }
    };
    loadColumns();
  }, [token, id]);

  const initialValues = { title: '', position: 0 };
  const validate = (values) => {
    const errors = {};
    // Kiểm tra title
    if (!values.title) {
      errors.title = 'Title is required';
    } else if (values.title.length <= 5) {
      errors.title = 'Title must be more than 5 characters';
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
      await createColumn(token, values.title, id, values.position);
      showToast('Column created successfully!', 'success');
      setTimeout(() => navigate(`/boards/${id}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Unable to connect to server Column', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Create New Column</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Column Title"
            fullWidth
            name="title"
            value={values.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            label="Position"
            fullWidth
            type="number"
            name="position"
            value={values.position}
            onChange={handleChange}
            error={!!errors.position}
            helperText={errors.position}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ flex: 1 }}>
              {loading ? 'Creating...' : 'Create Column'}
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/boards/${id}`)} sx={{ flex: 1 }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateColumn;