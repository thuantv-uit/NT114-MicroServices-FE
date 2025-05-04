import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import InviteToBoard from './InviteToBoard';

/**
 * Page to invite a user to a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const InviteToBoardPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || id;

  const handleClose = () => {
    navigate(`/boards/${boardId}`); // Điều hướng về trang board
  };

  return (
    <InviteToBoard boardId={boardId} open={true} onClose={handleClose} />
  );
};

export default InviteToBoardPage;