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
 * Component to display UI for inviting a user to a board
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {Object} props.board - Board data containing owner and members
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @returns {JSX.Element}
 */
const InviteToBoard = ({ boardId, board, open, onClose }) => {
  const navigate = useNavigate();
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
    showToast('User invited to board successfully!', 'success');
    setEmail('');
    setSubmitEmail('');
    onClose();
    setTimeout(() => navigate(`/boards/${boardId}`), 2000);
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to invite user', 'error');
    setSubmitEmail('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Share Board</DialogTitle>
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
                Board Members
              </Typography>
              <List>
                {/* Owner */}
                {board?.owner && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={board.owner.avatar || 'https://via.placeholder.com/24'}
                        alt={board.owner.username}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={board.owner.username || 'Unknown'}
                      secondary="Owner"
                    />
                  </ListItem>
                )}
                {/* Members */}
                {board?.members?.length > 0 ? (
                  board.members.map((member) => (
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