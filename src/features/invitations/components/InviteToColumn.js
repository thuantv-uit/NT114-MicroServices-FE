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
 * Component to display UI for inviting a user to a column
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {string} props.columnId - Column ID
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @returns {JSX.Element}
 */
const InviteToColumn = ({ boardId, columnId, open, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState('');

  const handleSubmit = () => {
    setSubmitEmail(email);
  };

  const handleSuccess = () => {
    showToast('User invited to column successfully!', 'success');
    setEmail('');
    setSubmitEmail('');
    onClose();
  };

  const handleError = (err) => {
    showToast(err.message, 'error');
    setSubmitEmail('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Invite User to Column</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Column ID"
              value={columnId}
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Invite
          </Button>
        </DialogActions>
      </Dialog>

      {submitEmail && (
        <Invitation
          boardId={boardId}
          columnId={columnId}
          email={submitEmail}
          action="inviteToColumn"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default InviteToColumn;