import React from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import '../styles/invitation.css';

const ConfirmInvitation = ({ email, boardId, onConfirm, onCancel }) => (
  <div className="inv-confirm">
    <div className="inv-confirm__icon">
      <PersonAddIcon style={{ fontSize: 22 }} />
    </div>
    <h3 className="inv-confirm__title">Confirm Invitation</h3>
    <div className="inv-confirm__row">
      <span className="inv-confirm__label">Email</span>
      <span className="inv-confirm__value">{email || '—'}</span>
    </div>
    {boardId && (
      <div className="inv-confirm__row">
        <span className="inv-confirm__label">Board</span>
        <span className="inv-confirm__value">{boardId}</span>
      </div>
    )}
    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
      <button className="inv-action-btn inv-action-btn--accept"
        style={{ flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 14 }}
        onClick={onConfirm}
      >
        Send invitation
      </button>
      <button className="inv-action-btn inv-action-btn--reject"
        style={{ flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 14 }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ConfirmInvitation;