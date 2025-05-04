import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PendingInvitations from './PendingInvitations';

/**
 * Page to display pending invitations for a user
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const PendingInvitationsPage = ({ token }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard'); // Điều hướng về dashboard khi đóng
  };

  return (
    <PendingInvitations userId={userId} onClose={handleClose} />
  );
};

export default PendingInvitationsPage;