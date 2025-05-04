import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import Invitation from './Invitation';

/**
 * Component to display UI for accepting/rejecting an invitation
 * @param {Object} props
 * @param {string} props.invitationId - Invitation ID
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @returns {JSX.Element}
 */
const AcceptRejectInvitation = ({ invitationId, open, onClose }) => {
  const navigate = useNavigate();
  const [submitAction, setSubmitAction] = useState('');

  const handleSubmit = (action) => (event) => {
    event.preventDefault();
    setSubmitAction(action);
  };

  const handleSuccess = (action) => {
    const message = action === 'accept' ? 'Invitation accepted successfully!' : 'Invitation rejected successfully!';
    showToast(message, 'success');
    setSubmitAction('');
    onClose();
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const handleError = (err, action) => {
    showToast(err.message || `Failed to ${action} invitation`, 'error');
    setSubmitAction('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage Invitation</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="body1">
              Would you like to accept or reject this invitation?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit('reject')}
            color="error"
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            Reject
          </Button>
          <Button
            onClick={handleSubmit('accept')}
            color="primary"
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {submitAction && (
        <Invitation
          invitationId={invitationId}
          action={submitAction}
          onSuccess={() => handleSuccess(submitAction)}
          onError={(err) => handleError(err, submitAction)}
        />
      )}
    </>
  );
};

export default AcceptRejectInvitation;