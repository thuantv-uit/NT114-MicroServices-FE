import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AcceptRejectInvitation from './AcceptRejectInvitation';

/**
 * Page to accept or reject an invitation
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const AcceptRejectInvitationPage = ({ token }) => {
  const { invitationId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard'); // Điều hướng về dashboard khi đóng
  };

  return (
    <AcceptRejectInvitation
      invitationId={invitationId}
      open={true}
      onClose={handleClose}
    />
  );
};

export default AcceptRejectInvitationPage;