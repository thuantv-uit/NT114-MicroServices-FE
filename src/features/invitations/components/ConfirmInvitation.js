// ConfirmInvitation.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';

/**
 * Component để xác nhận việc mời user vào board (chỉ cho board)
 * @param {Object} props
 * @param {string} props.email - Email của user cần mời
 * @param {string} props.boardId - ID của board
 * @param {Function} props.onConfirm - Callback khi xác nhận (Yes)
 * @param {Function} props.onCancel - Callback khi hủy (No)
 * @returns {JSX.Element}
 */
const ConfirmInvitation = ({ email, boardId, onConfirm, onCancel }) => {
  return (
    <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">Confirm Invitation</Typography>
      <Typography variant="body1"><strong>Email:</strong> {email || 'Not provided'}</Typography>
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

export default ConfirmInvitation;