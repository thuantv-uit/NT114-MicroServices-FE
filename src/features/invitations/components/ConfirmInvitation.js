// ConfirmInvitation.js (cập nhật để trở thành component form xác nhận yes/no cho lời mời vào board)
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
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Xác nhận lời mời
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bạn có muốn mời user với email <strong>{email}</strong> vào board ID <strong>{boardId}</strong> không?
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

export default ConfirmInvitation;