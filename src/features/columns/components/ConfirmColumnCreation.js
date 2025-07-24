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
    <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">Confirm Column Creation</Typography>
      <Typography variant="body1"><strong>Title:</strong> {title || 'Not provided'}</Typography>
      <Typography variant="body1"><strong>Board ID:</strong> {boardId || 'Not provided'}</Typography>
      <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onConfirm}>
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