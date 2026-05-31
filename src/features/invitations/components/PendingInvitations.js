import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import CheckIcon    from '@mui/icons-material/Check';
import CloseIcon    from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon        from '@mui/icons-material/Person';
import SubtitlesIcon     from '@mui/icons-material/Subtitles';
import InboxIcon         from '@mui/icons-material/Inbox';
import { showToast } from '../../../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from './Invitation';
import { getUserById } from '../../users/services/userService';
import { getBoardById } from '../../boards/services/boardService';
import { getColumndById } from '../../columns/services/columnService';
import Invitation from './Invitation';
import '../styles/invitation.css';

const formatDate = (str) =>
  new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

const PendingInvitations = ({ userId }) => {
  const [boardInvitations,  setBoardInvitations]  = useState([]);
  const [columnInvitations, setColumnInvitations] = useState([]);
  const [actionInvitationId, setActionInvitationId] = useState(null);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const [boardInvites, columnInvites] = await Promise.all([
        getPendingBoardInvitations(userId),
        getPendingColumnInvitations(userId),
      ]);

      const enhanced = async (invites, getTarget, targetKey) =>
        Promise.all(
          (invites || []).map(async (inv) => {
            if (!inv.userId) return inv;
            const [inviter, target] = await Promise.all([
              getUserById(inv.userId),
              getTarget(inv[targetKey]),
            ]);
            return {
              ...inv,
              inviterUsername: inviter?.username || 'Unknown',
              inviterAvatar:   inviter?.avatar   || 'https://via.placeholder.com/36',
              targetTitle:     target?.data?.title || 'No Title',
            };
          })
        );

      setBoardInvitations(await enhanced(boardInvites, getBoardById, 'boardId'));
      setColumnInvitations(await enhanced(columnInvites, getColumndById, 'columnId'));
    } catch (err) {
      showToast(err.message || 'Failed to fetch invitations', 'error');
    }
  };

  useEffect(() => { if (userId) fetchAll(); }, [userId]);

  const handleAction = (id, type) => {
    if (!id) { showToast('Invalid invitation ID', 'error'); return; }
    setActionInvitationId(id);
    setActionType(type);
  };

  const handleSuccess = (action) => {
    showToast(action === 'accept' ? 'Invitation accepted!' : 'Invitation rejected!', 'success');
    setActionInvitationId(null); setActionType('');
    fetchAll();
    if (action === 'accept') setTimeout(() => navigate('/dashboard'), 1800);
  };

  const handleError = (err, action) => {
    showToast(err.message || `Failed to ${action} invitation`, 'error');
    setActionInvitationId(null); setActionType('');
  };

  const renderSection = (invites, type) => {
    const isBoard = type === 'board';
    return (
      <div>
        <h2 className="pending-section-title">
          {isBoard ? 'Board Invitations' : 'Column Invitations'}
          {invites.length > 0 && (
            <span className="pending-section-title__badge">{invites.length}</span>
          )}
        </h2>

        {invites.length === 0 ? (
          <div className="inv-empty">
            <div className="inv-empty__icon"><InboxIcon style={{ fontSize: 40 }} /></div>
            <span>No pending {type} invitations</span>
          </div>
        ) : (
          <div className="pending-grid">
            {invites.map((inv) => {
              const id = inv._id || inv.id;
              return (
                <div key={id || Math.random()} className={`inv-card inv-card--${type}`}>

                  {/* Header */}
                  <div className="inv-card__header">
                    <Avatar className="inv-card__avatar"
                      src={inv.inviterAvatar}
                      alt={inv.inviterUsername}
                    />
                    <span className={`inv-card__type inv-card__type--${type}`}>
                      {isBoard ? 'Invite to Board' : 'Invite to Column'}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="inv-card__meta">
                    <div className="inv-card__meta-row">
                      <CalendarTodayIcon className="inv-card__meta-icon" />
                      {formatDate(inv.createdAt)}
                    </div>
                    <div className="inv-card__meta-row">
                      <PersonIcon className="inv-card__meta-icon" />
                      {inv.inviterUsername}
                    </div>
                    <div className="inv-card__meta-row">
                      <SubtitlesIcon className="inv-card__meta-icon" />
                      <span className="inv-card__target">{inv.targetTitle}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="inv-card__actions">
                    <button
                      className="inv-action-btn inv-action-btn--accept"
                      onClick={() => handleAction(id, 'accept')}
                    >
                      <CheckIcon style={{ fontSize: 15 }} /> Accept
                    </button>
                    <button
                      className="inv-action-btn inv-action-btn--reject"
                      onClick={() => handleAction(id, 'reject')}
                    >
                      <CloseIcon style={{ fontSize: 15 }} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pending-page">
      <h1 className="pending-page__title">Pending Invitations</h1>
      {renderSection(boardInvitations,  'board')}
      {renderSection(columnInvitations, 'column')}

      {actionInvitationId && actionType && (
        <Invitation
          invitationId={actionInvitationId}
          action={actionType}
          onSuccess={() => handleSuccess(actionType)}
          onError={(err) => handleError(err, actionType)}
        />
      )}
    </div>
  );
};

export default PendingInvitations;