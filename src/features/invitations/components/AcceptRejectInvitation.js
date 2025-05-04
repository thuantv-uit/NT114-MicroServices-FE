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
 * @param {string} props.action - Action ('accept' or 'reject')
 * @returns {JSX.Element}
 */
const AcceptRejectInvitation = ({ invitationId, open, onClose, action }) => {
  const navigate = useNavigate();
  const [submitAction, setSubmitAction] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAction(action);
  };

  const handleSuccess = () => {
    const message = action === 'accept' ? 'Invitation accepted successfully!' : 'Invitation rejected successfully!';
    showToast(message, 'success');
    setSubmitAction('');
    onClose();
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const handleError = (err) => {
    showToast(err.message || `Failed to ${action} invitation`, 'error');
    setSubmitAction('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: action === 'accept' ? 'primary.light' : 'error.light', color: 'white' }}>
          {action === 'accept' ? 'Accept Invitation' : 'Reject Invitation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="body1">
              Are you sure you want to <strong>{action === 'accept' ? 'accept' : 'reject'}</strong> this invitation?
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
            onClick={handleSubmit}
            color={action === 'accept' ? 'primary' : 'error'}
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            {action === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {submitAction && (
        <Invitation
          invitationId={invitationId}
          action={submitAction}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default AcceptRejectInvitation;