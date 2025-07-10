import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Button, Typography } from '@mui/material';

/**
 * Component to delete a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const DeleteBoard = ({ token, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBoard(id);
      showToast('Board deleted successfully!', 'success');
      onClose();
      navigate('/boards');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Delete Board
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Are you sure you want to delete this board? This action cannot be undone.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteBoard;