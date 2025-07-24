import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createBoard, fetchLatestBoardId } from '../services/boardService';
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
      // Tạo board mới
      await createBoard(title, description, '#FFFFFF'); // Mặc định backgroundColor
      showToast('Board created successfully!', 'success');

      // Lấy board_id của board mới nhất
      const response = await fetchLatestBoardId();
      console.log('fetchLatestBoardId response:', response); // Debug toàn bộ phản hồi
      const boardId = response?.id || response?.board_id || response?.data?.id || response?.data?.board_id;
      
      if (boardId) {
        console.log('Board ID:', boardId); // In board_id ra console
      } else {
        console.log('Board ID not found in response. Full response:', response);
      }

      onClose();
    } catch (err) {
      showToast(err.message, 'error');
      console.error('Error creating board or fetching board ID:', err);
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