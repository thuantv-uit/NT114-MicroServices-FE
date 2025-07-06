import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { showToast } from '../../../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from './Invitation';

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

        // Log dữ liệu để kiểm tra cấu trúc
        console.log('Board Invitations:', boardInvites);
        console.log('Column Invitations:', columnInvites);

        setBoardInvitations(boardInvites || []);
        setColumnInvitations(columnInvites || []);
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

  const renderInvitationList = (invitations, type) => (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {type} Invitations
      </Typography>
      {invitations.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No pending {type.toLowerCase()} invitations.
        </Typography>
      ) : (
        <List>
          {invitations.map((invitation) => {
            // Sử dụng _id thay vì id, hoặc id nếu API trả về id
            const invitationId = invitation._id || invitation.id;

            return (
              <React.Fragment key={invitationId || Math.random()}>
                <ListItem
                  button
                  onClick={() => handleInvitationClick(invitationId)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText primary={`Pending ${type.toLowerCase()} invitation`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Invitations
      </Typography>

      {renderInvitationList(boardInvitations, 'Board')}
      {renderInvitationList(columnInvitations, 'Column')}
    </Box>
  );
};

export default PendingInvitations;