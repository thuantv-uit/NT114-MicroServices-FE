// src/features/columns/components/ColumnEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { updateColumn, fetchColumns } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';

const ColumnEdit = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [existingPositions, setExistingPositions] = useState([]); // Lưu danh sách position hiện có

  const initialValues = {
    title: state?.title || '',
    position: state?.position || 0,
  };
  const boardId = state?.boardId || '';

  // Lấy danh sách cột để kiểm tra position
  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columns = await fetchColumns(token, boardId);
        const positions = columns
          .filter(column => column._id !== columnId) // Loại trừ position của cột đang chỉnh sửa
          .map(column => column.position);
        setExistingPositions(positions);
      } catch (err) {
        showToast('Failed to load columns for position validation', 'error');
      }
    };
    loadColumns();
  }, [token, boardId, columnId]);

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
      await updateColumn(token, columnId, values.title, values.position);
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