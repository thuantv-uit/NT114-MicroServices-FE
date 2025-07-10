import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from './Invitation';
import { getUserById } from '../../users/services/userService';
import { getBoardById } from '../../boards/services/boardService';
import { getColumndById } from '../../columns/services/columnService';

/**
 * Component to display a list of pending invitations for a user
 * @param {Object} props
 * @param {string} props.userId - User ID
 * @returns {JSX.Element}
 */
const PendingInvitations = ({ userId }) => {
  const [boardInvitations, setBoardInvitations] = useState([]);
  const [columnInvitations, setColumnInvitations] = useState([]);
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
              console.log('User data:', inviter); // Debug
              console.log('Column data:', column); // Debug
              console.log('Column Title', column.data.title);
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

  const handleInvitationClick = (invitationId) => {
    if (!invitationId) {
      showToast('Invalid invitation ID', 'error');
      return;
    }
    navigate(`/invitations/${invitationId}`);
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
      <Typography variant="h6" sx={{ mt: 2 }}>
        Board Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No pending board invitations.
        </Typography>
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
                  bgcolor: '#fff',
                  borderRadius: 2,
                  p: 2,
                  width: 200,
                  height: 200,
                  boxShadow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {invitation.inviterAvatar && (
                      <img
                        src={invitation.inviterAvatar}
                        alt={invitation.inviterUsername}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                    )}
                    <Typography variant="h6">Invitation Board</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {`Date: ${formatDate(invitation.createdAt)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Invited by: ${invitation.inviterUsername}`}
                  </Typography>
                  <Typography variant="body1">
                    {`Board: ${invitation.boardTitle}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    <Button
                      onClick={() => handleInvitationClick(invitationId)}
                      sx={{ cursor: 'pointer' }}
                    >
                      Click to view details
                    </Button>
                  </Typography>
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
      <Typography variant="h6" sx={{ mt: 2 }}>
        Column Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No pending column invitations.
        </Typography>
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
                  bgcolor: '#fff',
                  borderRadius: 2,
                  p: 2,
                  width: 200,
                  height: 200,
                  boxShadow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {invitation.inviterAvatar && (
                      <img
                        src={invitation.inviterAvatar}
                        alt={invitation.inviterUsername}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                    )}
                    <Typography variant="h6">Invitation Column</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {`Date: ${formatDate(invitation.createdAt)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Invited by: ${invitation.inviterUsername}`}
                  </Typography>
                  <Typography variant="body1">
                    {`Column: ${invitation.columnTitle}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    <Button
                      onClick={() => handleInvitationClick(invitationId)}
                      sx={{ cursor: 'pointer' }}
                    >
                      Click to view details
                    </Button>
                  </Typography>
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
      <Typography variant="h4" gutterBottom>
        Pending Invitations
      </Typography>

      {renderBoardInvitations(boardInvitations)}
      {renderColumnInvitations(columnInvitations)}
    </Box>
  );
};

export default PendingInvitations;