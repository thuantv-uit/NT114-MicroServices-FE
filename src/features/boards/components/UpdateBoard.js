// src/features/boards/components/UpdateBoard.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const UpdateBoard = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' }); // Thêm trạng thái lỗi
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(token, id);
        setTitle(data.title);
        setDescription(data.description || '');
      } catch (err) {
        setMessage(err.response?.data.message || 'Failed to fetch board');
        toast.error(err.response?.data.message || 'Failed to fetch board');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, token]);

  const validate = () => {
    const newErrors = { title: '', description: '' };
    let isValid = true;

    // Kiểm tra title
    if (title.length <= 5) {
      newErrors.title = 'Title must be more than 5 characters';
      isValid = false;
    }

    // Kiểm tra description
    if (description.length <= 5) {
      newErrors.description = 'Description must be more than 5 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    // Kiểm tra điều kiện trước khi gửi
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await updateBoard(token, id, title, description);
      setMessage('Board updated successfully!');
      toast.success('Board updated successfully!');
      setTimeout(() => navigate(`/boards/${id}`), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to update board');
      toast.error(err.response?.data.message || 'Failed to update board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Update Board
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
        <form onSubmit={handleUpdate}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Updating...' : 'Update Board'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${id}`)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateBoard;