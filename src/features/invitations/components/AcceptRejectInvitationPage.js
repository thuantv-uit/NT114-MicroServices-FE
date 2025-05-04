import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AcceptRejectInvitation from './AcceptRejectInvitation';

/**
 * Page to accept or reject an invitation
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {string} props.action - Action ('accept' or 'reject')
 * @returns {JSX.Element}
 */
const AcceptRejectInvitationPage = ({ token, action }) => {
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
      action={action}
    />
  );
};

export default AcceptRejectInvitationPage;