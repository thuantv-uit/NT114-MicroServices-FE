import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import InviteToColumn from './InviteToColumn';

/**
 * Page to invite a user to a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const InviteToColumnPage = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';

  const handleClose = () => {
    navigate(`/boards/${boardId}`); // Điều hướng về trang board
  };

  return (
    <InviteToColumn boardId={boardId} columnId={columnId} open={true} onClose={handleClose} />
  );
};

export default InviteToColumnPage;