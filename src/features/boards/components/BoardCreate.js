// src/features/boards/components/BoardCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../services/boardService';
import { toast } from 'react-toastify';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

const BoardCreate = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' }); // Thêm trạng thái lỗi
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { title: '', description: '' };
    let isValid = true;

    // Kiểm tra title
    if (title.length <= 5) {
      newErrors.title = 'Board title must be more than 5 characters';
      isValid = false;
    }

    // Kiểm tra description
    // if (!description.trim()) {
    //   newErrors.description = 'Description is required';
    //   isValid = false;
    // }
    if (description.length <= 5) {
      newErrors.description = 'Description must be more than 5 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra điều kiện trước khi gửi
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await createBoard(token, title, description);
      toast.success('Board created successfully!');
      setTimeout(() => navigate('/boards'), 2000);
    } catch (err) {
      toast.error(err.response?.data.message || 'Unable to connect to server Board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Create New Board</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Board Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required // Đánh dấu là bắt buộc
            error={!!errors.description}
            helperText={errors.description || 'Description (required)'}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? 'Creating...' : 'Create Board'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default BoardCreate;