import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';

/**
 * Component to confirm board creation with Yes/No buttons
 * @param {Object} props
 * @param {string} props.title - Board title from chatbot
 * @param {string} props.description - Board description from chatbot
 * @param {Function} props.onClose - Function to close the confirmation dialog
 * @returns {JSX.Element}
 */
const ConfirmBoardCreation = ({ title, description, onClose }) => {
  const handleConfirm = async () => {
    try {
      // Giả định token được xử lý trong createBoard
      await createBoard(title, description, '#FFFFFF'); // Mặc định backgroundColor
      showToast('Board created successfully!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">Confirm Board Creation</Typography>
      <Typography variant="body1"><strong>Title:</strong> {title || 'Not provided'}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {description || 'Not provided'}</Typography>
      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Yes
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          No
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmBoardCreation;