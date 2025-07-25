import React from 'react';
import { Box, Button, Typography } from '@mui/material';

/**
 * Component to confirm column creation from chatbot
 * @param {Object} props
 * @param {string} props.title - Column title from chatbot
 * @param {string} props.boardId - Board ID from chatbot
 * @param {Function} props.onConfirm - Function to confirm creation
 * @param {Function} props.onCancel - Function to cancel creation
 * @returns {JSX.Element}
 */
const ConfirmColumnCreation = ({ title, boardId, onConfirm, onCancel }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Xác nhận tạo column
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bạn có muốn tạo column với title <strong>{title}</strong> cho board ID <strong>{boardId}</strong> không?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={onConfirm} sx={{ mr: 2 }}>
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