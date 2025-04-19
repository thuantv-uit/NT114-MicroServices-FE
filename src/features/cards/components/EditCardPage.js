/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { updateCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';

const EditCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || '';

  const initialValues = {
    title: state?.title || '',
    description: state?.description || '',
  };

  const validate = (values) => {
    const errors = {};
    // Kiểm tra title
    if (!values.title) {
      errors.title = 'Tiêu đề là bắt buộc';
    } else if (values.title.length < 5) {
      errors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    }
    // Kiểm tra description
    if (values.description && values.description.length < 5) {
      errors.description = 'Mô tả phải có ít nhất 5 ký tự';
    }
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await updateCard(token, cardId, values.title, values.description);
      showToast('Cập nhật card thành công!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Không thể cập nhật card', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>Chỉnh sửa Card</Typography>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tiêu đề Card"
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
            label="Mô tả (tùy chọn)"
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật Card'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${boardId}`)}
              fullWidth
              disabled={loading}
            >
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditCardPage;