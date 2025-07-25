import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';

/**
 * Component to confirm column creation from chatbot
 * @param {Object} props
 * @param {string} props.title - Column title from chatbot
 * @param {string} props.boardId - Board ID from chatbot
 * @param {Function} props.onColumnCreated - Function to handle after creation
 * @param {Function} props.onCancel - Function to cancel creation
 * @returns {JSX.Element}
 */
const ConfirmColumnCreation = ({ title, boardId, onColumnCreated, onCancel }) => {
  const handleConfirm = async () => {
    try {
      await createColumn(title, boardId);
      showToast('Column created successfully!', 'success');
      if (onColumnCreated) {
        onColumnCreated();
      }
      onCancel();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Xác nhận tạo column
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bạn có muốn tạo column với title <strong>{title}</strong> cho board ID <strong>{boardId}</strong> không?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleConfirm} sx={{ mr: 2 }}>
          Yes
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          No
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmColumnCreation;