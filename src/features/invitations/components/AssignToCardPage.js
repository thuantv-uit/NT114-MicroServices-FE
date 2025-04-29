import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AssignToCard from './AssignToCard';

/**
 * Page to assign a user to a card
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const AssignToCardPage = ({ token }) => {
  const { cardId } = useParams();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || '';

  return (
    <AssignToCard boardId={boardId} columnId={columnId} cardId={cardId} open={true} onClose={() => {}} />
  );
};

export default AssignToCardPage;