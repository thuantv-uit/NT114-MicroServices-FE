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
  MenuItem,
  Chip,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import Invitation from './Invitation';

// ── Role config ────────────────────────────────────────────────────────────────
const ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage board settings and members',
    color: '#f87171',   // red
  },
  {
    value: 'member',
    label: 'Member',
    description: 'Can create and edit cards',
    color: '#6366f1',   // indigo
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can view board content only',
    color: '#4ade80',   // green
  },
];

/**
 * Component to display UI for inviting a user to a board.
 * @param {Object}   props
 * @param {string}   props.boardId  - Board ID
 * @param {Object}   props.board    - Board data (owner + members)
 * @param {boolean}  props.open     - Whether the dialog is open
 * @param {Function} props.onClose  - Callback to close the dialog
 */
const InviteToBoard = ({ boardId, board, open, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [role, setRole]             = useState('member');   // default role
  const [submitEmail, setSubmitEmail] = useState('');
  const [submitRole, setSubmitRole]   = useState('');

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
    showToast('User invited to board successfully!', 'success');
    setEmail('');
    setRole('member');
    setSubmitEmail('');
    setSubmitRole('');
    onClose();
    setTimeout(() => navigate(`/boards/${boardId}`), 2000);
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to invite user', 'error');
    setSubmitEmail('');
    setSubmitRole('');
  };

  const selectedRole = ROLES.find((r) => r.value === role);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Share Board</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            {/* ── Email + Role + Share ─────────────────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>

              {/* Email field */}
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
                sx={{ mt: 0 }}
              />

              {/* Role dropdown */}
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ minWidth: 130, mt: 0 }}
                margin="normal"
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: r.color,
                          flexShrink: 0,
                        }}
                      />
                      {r.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {/* Share button */}
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={!email.trim()}
                sx={{ minWidth: 90, height: 56, mt: 0, flexShrink: 0 }}
              >
                Share
              </Button>
            </Box>

            {/* Role description hint */}
            {selectedRole && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Chip
                  label={selectedRole.label}
                  size="small"
                  sx={{
                    background: selectedRole.color + '22',
                    color: selectedRole.color,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {selectedRole.description}
                </Typography>
              </Box>
            )}

            {/* ── Member list ──────────────────────────────────────────────── */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Board Members
              </Typography>
              <List disablePadding>

                {/* Owner */}
                {board?.owner && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
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
                    <Chip
                      label="Owner"
                      size="small"
                      sx={{ fontSize: 11, fontWeight: 600 }}
                    />
                  </ListItem>
                )}

                {/* Members */}
                {board?.members?.length > 0 ? (
                  board.members.map((member) => {
                    const memberRole = ROLES.find((r) => r.value === member.role) || ROLES[1];
                    return (
                      <ListItem disablePadding sx={{ py: 0.5 }} key={member._id || member.id}>
                        <ListItemAvatar>
                          <Avatar
                            src={member.avatar || 'https://via.placeholder.com/24'}
                            alt={member.username}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.username || 'Unknown'}
                          secondary={member.email || ''}
                        />
                        <Chip
                          label={memberRole.label}
                          size="small"
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            background: memberRole.color + '22',
                            color: memberRole.color,
                          }}
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
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

      {/* Fire invitation when submitEmail is set */}
      {submitEmail && (
        <Invitation
          boardId={boardId}
          email={submitEmail}
          role={submitRole}
          action="inviteToBoard"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
};

export default InviteToBoard;