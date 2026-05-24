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
  MenuItem,
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

const COLUMN_ROLES = [
  { value: 'admin', label: 'Admin', description: 'Xem, chỉnh sửa và xóa column' },
  { value: 'member', label: 'Member', description: 'Xem và chỉnh sửa column' },
  { value: 'viewer', label: 'Viewer', description: 'Chỉ xem column' },
];

const InviteToColumn = ({ boardId, column, open, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [submitEmail, setSubmitEmail] = useState('');
  const [submitRole, setSubmitRole] = useState('member');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitEmail(email);
      setSubmitRole(role);
    } else {
      showToast('Please enter a valid email', 'error');
    }
  };

  const handleSuccess = () => {
    showToast('User invited to column successfully!', 'success');
    setEmail('');
    setRole('member');
    setSubmitEmail('');
    setSubmitRole('member');
    onClose();
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to invite user', 'error');
    setSubmitEmail('');
    setSubmitRole('member');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Share Column</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            {/* Email + Role + Share button */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                label="User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                type="email"
                autoFocus
                required
                error={!email.trim() && !!submitEmail}
                helperText={!email.trim() && submitEmail ? 'Email is required' : ''}
              />
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                margin="normal"
                sx={{ minWidth: 130 }}
              >
                {COLUMN_ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {r.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={!email.trim()}
                sx={{ minWidth: 100, height: 'fit-content', mt: 2, py: 1 }}
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
                      <ListItemText
                        primary={member.username || 'Unknown'}
                        secondary={
                          COLUMN_ROLES.find((r) => r.value === member.role)?.label || 'Member'
                        }
                      />
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
          role={submitRole}
          action="inviteToColumn"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default InviteToColumn;