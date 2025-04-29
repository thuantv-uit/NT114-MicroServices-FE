import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import InviteToColumn from './InviteToColumn';

/**
 * Page to invite a user to a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const InviteToColumnPage = ({ token }) => {
  const { columnId } = useParams();
  const { state } = useLocation();
  const boardId = state?.boardId || '';

  return (
    <InviteToColumn boardId={boardId} columnId={columnId} open={true} onClose={() => {}} />
  );
};

export default InviteToColumnPage;