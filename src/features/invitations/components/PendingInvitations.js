import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
// import TitleIcon from '@mui/icons-material/Title';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import InboxIcon from '@mui/icons-material/Inbox';
import { showToast } from '../../../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from './Invitation';
import { getUserById } from '../../users/services/userService';
import { getBoardById } from '../../boards/services/boardService';
import { getColumndById } from '../../columns/services/columnService';
import Invitation from './Invitation';

/**
 * Component to display a list of pending invitations for a user
 * @param {Object} props
 * @param {string} props.userId - User ID
 * @returns {JSX.Element}
 */
const PendingInvitations = ({ userId }) => {
  const [boardInvitations, setBoardInvitations] = useState([]);
  const [columnInvitations, setColumnInvitations] = useState([]);
  const [actionInvitationId, setActionInvitationId] = useState(null);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const boardInvites = await getPendingBoardInvitations(userId);
        const columnInvites = await getPendingColumnInvitations(userId);

        const enhancedBoardInvites = await Promise.all(
          (boardInvites || []).map(async (invite) => {
            if (invite.userId) {
              const inviter = await getUserById(invite.userId);
              const board = await getBoardById(invite.boardId);
              return {
                ...invite,
                inviterUsername: inviter?.username || 'Unknown',
                inviterAvatar: inviter?.avatar || 'https://via.placeholder.com/24',
                boardTitle: board?.data?.title || 'No Title',
              };
            }
            return invite;
          })
        );

        const enhancedColumnInvites = await Promise.all(
          (columnInvites || []).map(async (invite) => {
            if (invite.userId) {
              const inviter = await getUserById(invite.userId);
              const column = await getColumndById(invite.columnId);
              return {
                ...invite,
                inviterUsername: inviter?.username || 'Unknown',
                inviterAvatar: inviter?.avatar || 'https://via.placeholder.com/24',
                columnTitle: column?.data?.title || 'No Title',
              };
            }
            return invite;
          })
        );

        setBoardInvitations(enhancedBoardInvites);
        setColumnInvitations(enhancedColumnInvites);
      } catch (err) {
        showToast(err.message || 'Failed to fetch pending invitations', 'error');
      }
    };

    if (userId) {
      fetchInvitations();
    }
  }, [userId]);

  const handleAction = (invitationId, action) => {
    if (!invitationId) {
      showToast('Invalid invitation ID', 'error');
      return;
    }
    setActionInvitationId(invitationId);
    setActionType(action);
  };

  const handleSuccess = (action) => {
    showToast(
      action === 'accept' ? 'Invitation accepted successfully!' : 'Invitation rejected successfully!',
      'success'
    );
    setActionInvitationId(null);
    setActionType('');
    const fetchInvitations = async () => {
      try {
        const boardInvites = await getPendingBoardInvitations(userId);
        const columnInvites = await getPendingColumnInvitations(userId);
        setBoardInvitations(boardInvites);
        setColumnInvitations(columnInvites);
      } catch (err) {
        showToast(err.message || 'Failed to fetch pending invitations', 'error');
      }
    };
    fetchInvitations();
    if (action === 'accept') {
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handleError = (err, action) => {
    showToast(err.message || `Failed to ${action} invitation`, 'error');
    setActionInvitationId(null);
    setActionType('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
    });
  };

  const renderBoardInvitations = (invitations) => (
    <>
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          mb: 1,
          color: '#1976d2',
          fontWeight: 'bold',
          borderBottom: '2px solid #1976d2',
          pb: 1,
        }}
      >
        Board Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <InboxIcon sx={{ fontSize: 48, color: '#757575' }} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {invitations.map((invitation) => {
            const invitationId = invitation._id || invitation.id;

            return (
              <Box
                key={invitationId || Math.random()}
                sx={{
                  bgcolor: '#e3f2fd',
                  borderRadius: 2,
                  p: 1.5,
                  width: 'fit-content',
                  minWidth: 180,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background-color 0.3s, transform 0.2s',
                  '&:hover': {
                    bgcolor: '#bbdefb',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {invitation.inviterAvatar && (
                      <img
                        src={invitation.inviterAvatar}
                        alt={invitation.inviterUsername}
                        style={{ width: 24, height: 24, marginRight: 8, borderRadius: '50%' }}
                      />
                    )}
                    <Typography variant="h6" sx={{ color: '#1976d2' }}>
                      Invite to Board
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(invitation.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body2">{invitation.inviterUsername}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SubtitlesIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body1">{invitation.boardTitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleAction(invitationId, 'accept')}
                      title="Accept"
                      sx={{ bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#c8e6c9' } }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleAction(invitationId, 'reject')}
                      title="Reject"
                      sx={{ bgcolor: '#ffebee', '&:hover': { bgcolor: '#ef9a9a' } }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );

  const renderColumnInvitations = (invitations) => (
    <>
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          mb: 1,
          color: '#1976d2',
          fontWeight: 'bold',
          borderBottom: '2px solid #1976d2',
          pb: 1,
        }}
      >
        Column Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <InboxIcon sx={{ fontSize: 48, color: '#757575' }} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {invitations.map((invitation) => {
            const invitationId = invitation._id || invitation.id;

            return (
              <Box
                key={invitationId || Math.random()}
                sx={{
                  bgcolor: '#fce4ec',
                  borderRadius: 2,
                  p: 1.5,
                  width: 'fit-content',
                  minWidth: 180,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background-color 0.3s, transform 0.2s',
                  '&:hover': {
                    bgcolor: '#f8bbd0',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {invitation.inviterAvatar && (
                      <img
                        src={invitation.inviterAvatar}
                        alt={invitation.inviterUsername}
                        style={{ width: 24, height: 24, marginRight: 8, borderRadius: '50%' }}
                      />
                    )}
                    <Typography variant="h6" sx={{ color: '#c2185b' }}>
                      Invite to Column
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(invitation.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body2">{invitation.inviterUsername}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SubtitlesIcon sx={{ fontSize: 18, mr: 1, color: '#757575' }} />
                    <Typography variant="body1">{invitation.columnTitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleAction(invitationId, 'accept')}
                      title="Accept"
                      sx={{ bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#c8e6c9' } }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleAction(invitationId, 'reject')}
                      title="Reject"
                      sx={{ bgcolor: '#ffebee', '&:hover': { bgcolor: '#ef9a9a' } }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#1976d2',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          fontWeight: 'bold',
        }}
      >
        Pending Invitations
      </Typography>

      {renderBoardInvitations(boardInvitations)}
      {renderColumnInvitations(columnInvitations)}

      {actionInvitationId && actionType && (
        <Invitation
          invitationId={actionInvitationId}
          action={actionType}
          onSuccess={() => handleSuccess(actionType)}
          onError={(err) => handleError(err, actionType)}
        />
      )}
    </Box>
  );
};

export default PendingInvitations;