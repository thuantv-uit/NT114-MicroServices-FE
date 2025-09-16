import React, { useState } from 'react';
import { deleteColumn, updateBoardColumnOrder } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Button, Typography } from '@mui/material';

/**
 * Component to delete a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {string} props.columnId - Column ID
 * @param {string} props.boardId - Board ID
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const DeleteColumn = ({ token, columnId, boardId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteColumn(columnId);
      const board = await fetchBoard(boardId);
      const newColumnOrderIds = board.columnOrderIds.filter(id => id !== columnId);
      await updateBoardColumnOrder(boardId, newColumnOrderIds);
      showToast('Column deleted successfully!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Delete Column
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Are you sure you want to delete this column? This action cannot be undone.
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

export default DeleteColumn;