import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import Invitation from './Invitation';

/**
 * Component to display UI for assigning a user to a card
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {string} props.columnId - Column ID
 * @param {string} props.cardId - Card ID
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {Function} props.onRefresh - Refresh callback
 * @returns {JSX.Element}
 */
const AssignToCard = ({ boardId, columnId, cardId, open, onClose, onRefresh }) => {
  const [email, setEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitEmail(email);
    } else {
      showToast('Please enter a valid email', 'error');
    }
  };

  const handleSuccess = () => {
    showToast('User assigned to card successfully!', 'success');
    setEmail('');
    setSubmitEmail('');
    onClose();
    if (onRefresh) onRefresh();
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to assign user', 'error');
    setSubmitEmail('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Assign User to Card</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Column ID"
              value={columnId || ''}
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="Card ID"
              value={cardId || ''}
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              type="email"
              autoFocus
              required
              error={!email.trim() && submitEmail}
              helperText={!email.trim() && submitEmail ? 'Email is required' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={!email.trim()}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {submitEmail && (
        <Invitation
          boardId={boardId}
          columnId={columnId}
          cardId={cardId}
          email={submitEmail}
          action="assignToCard"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default AssignToCard;