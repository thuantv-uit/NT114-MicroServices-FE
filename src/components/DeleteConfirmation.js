import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import useForm from '../hooks/useForm';
import { showToast } from '../utils/toastUtils';

/**
 * Generic delete confirmation component
 * @param {Object} props
 * @param {string} props.title - Title of the delete action
 * @param {string} props.message - Confirmation message
 * @param {Function} props.onDelete - Delete handler
 * @param {string} props.cancelPath - Cancel button navigation path
 * @returns {JSX.Element}
 */
const DeleteConfirmation = ({ title, message, onDelete, cancelPath }) => {
  const navigate = useNavigate();
  const { loading, handleSubmit } = useForm({
    initialValues: {},
    onSubmit: async () => {
      if (!window.confirm('Are you sure you want to proceed? This action cannot be undone.')) return;
      await onDelete();
      showToast(`${title} deleted successfully!`, 'success');
      setTimeout(() => navigate(cancelPath), 2000);
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" gutterBottom>{message}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {title}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(cancelPath)}
            sx={{ flex: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeleteConfirmation;