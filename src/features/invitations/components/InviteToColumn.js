import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import Invitation from './Invitation';

/**
 * Component to display UI for inviting a user to a column
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {Object} props.column - Column data containing id, owner, and members
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @returns {JSX.Element}
 */
const InviteToColumn = ({ boardId, column, open, onClose }) => {
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
    showToast('User invited to column successfully!', 'success');
    setEmail('');
    setSubmitEmail('');
    onClose();
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to invite user', 'error');
    setSubmitEmail('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Share Column</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Email input and Share button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={!email.trim()}
                sx={{ minWidth: 100, height: 'fit-content', py: 1 }}
              >
                Share
              </Button>
            </Box>
            {/* Owner and Members list */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Column Members
              </Typography>
              <List>
                {/* Owner */}
                {column?.owner && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={column.owner.avatar || 'https://via.placeholder.com/24'}
                        alt={column.owner.username}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={column.owner.username || 'Unknown'}
                      secondary="Owner"
                    />
                  </ListItem>
                )}
                {/* Members */}
                {column?.members?.length > 0 ? (
                  column.members.map((member) => (
                    <ListItem key={member._id || member.id}>
                      <ListItemAvatar>
                        <Avatar
                          src={member.avatar || 'https://via.placeholder.com/24'}
                          alt={member.username}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={member.username || 'Unknown'} secondary="Member" />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No members yet.
                  </Typography>
                )}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {submitEmail && (
        <Invitation
          boardId={boardId}
          columnId={column._id}
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