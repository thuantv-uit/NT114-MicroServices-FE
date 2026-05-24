import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Avatar, MenuItem, Typography,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import Invitation from './Invitation';
import '../styles/invitation.css';

const COLUMN_ROLES = [
  { value: 'admin',  label: 'Admin',  color: '#f87171', description: 'Can manage and delete column' },
  { value: 'member', label: 'Member', color: '#6366f1', description: 'Can view and edit column' },
  { value: 'viewer', label: 'Viewer', color: '#4ade80', description: 'Can view column only' },
];

const InviteToColumn = ({ boardId, column, open, onClose }) => {
  const [email,       setEmail]       = useState('');
  const [role,        setRole]        = useState('member');
  const [submitEmail, setSubmitEmail] = useState('');
  const [submitRole,  setSubmitRole]  = useState('member');

  const selectedRole = COLUMN_ROLES.find((r) => r.value === role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { showToast('Please enter a valid email', 'error'); return; }
    setSubmitEmail(email);
    setSubmitRole(role);
  };

  const handleSuccess = () => {
    showToast('User invited to column successfully!', 'success');
    setEmail(''); setRole('member');
    setSubmitEmail(''); setSubmitRole('member');
    onClose();
  };

  const handleError = (err) => {
    showToast(err.message || 'Failed to invite user', 'error');
    setSubmitEmail(''); setSubmitRole('member');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle className="inv-dialog-title">Share Column</DialogTitle>

        <DialogContent className="inv-dialog-content">

          {/* ── Email + Role + Share ── */}
          <div className="inv-input-row">
            <TextField
              label="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              type="email"
              autoFocus
              required
              size="small"
              error={!email.trim() && !!submitEmail}
              helperText={!email.trim() && submitEmail ? 'Email is required' : ''}
            />
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              size="small"
              sx={{ minWidth: 120, flexShrink: 0 }}
            >
              {COLUMN_ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    {r.label}
                  </div>
                </MenuItem>
              ))}
            </TextField>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!email.trim()}
              sx={{
                height: 40, minWidth: 80, flexShrink: 0,
                borderRadius: '8px', textTransform: 'none',
                fontFamily: 'DM Sans', fontWeight: 500,
                background: '#3B5BDB',
                '&:hover': { background: '#2F4AC5' },
              }}
            >
              Share
            </Button>
          </div>

          {/* ── Role hint ── */}
          {selectedRole && (
            <div className="inv-role-hint">
              <span
                className="inv-role-chip"
                style={{ background: selectedRole.color + '22', color: selectedRole.color }}
              >
                {selectedRole.label}
              </span>
              <span className="inv-role-desc">{selectedRole.description}</span>
            </div>
          )}

          {/* ── Member list ── */}
          <Typography className="inv-section-title">Column Members</Typography>

          {column?.owner && (
            <div className="inv-member-item">
              <Avatar className="inv-member-avatar"
                src={column.owner.avatar || 'https://via.placeholder.com/36'}
                alt={column.owner.username}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="inv-member-name">{column.owner.username || 'Unknown'}</p>
                <p className="inv-member-sub">Owner</p>
              </div>
              <span className="inv-member-chip" style={{ background: '#EEF2FF', color: '#3B5BDB' }}>Owner</span>
            </div>
          )}

          {column?.members?.length > 0 ? (
            column.members.map((m) => {
              const mr = COLUMN_ROLES.find((r) => r.value === m.role) || COLUMN_ROLES[1];
              return (
                <div key={m._id || m.id} className="inv-member-item">
                  <Avatar className="inv-member-avatar"
                    src={m.avatar || 'https://via.placeholder.com/36'}
                    alt={m.username}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="inv-member-name">{m.username || 'Unknown'}</p>
                    <p className="inv-member-sub">{m.email || ''}</p>
                  </div>
                  <span className="inv-member-chip"
                    style={{ background: mr.color + '22', color: mr.color }}
                  >{mr.label}</span>
                </div>
              );
            })
          ) : (
            !column?.owner && <p className="inv-empty-members">No members yet.</p>
          )}
        </DialogContent>

        <DialogActions className="inv-dialog-actions">
          <Button onClick={onClose} variant="outlined" size="small"
            sx={{ borderRadius: '8px', textTransform: 'none', fontFamily: 'DM Sans', color: '#4A5568', borderColor: '#E4E7ED' }}
          >
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