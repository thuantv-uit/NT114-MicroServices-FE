import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
 * Component to display UI for inviting a user to a board
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @returns {JSX.Element}
 */
const InviteToBoard = ({ boardId, open, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState('');

  const handleSubmit = () => {
    setSubmitEmail(email);
  };

  const handleSuccess = () => {
    showToast('User invited to board successfully!', 'success');
    setEmail('');
    setSubmitEmail('');
    onClose();
    setTimeout(() => navigate(`/boards/${boardId}`), 2000);
  };

  const handleError = (err) => {
    showToast(err.message, 'error');
    setSubmitEmail('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Invite User to Board</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          email={submitEmail}
          action="inviteToBoard"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default InviteToBoard;