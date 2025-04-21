import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { deleteCard } from '../services/cardService';
import DeleteConfirmation from '../../../components/DeleteConfirmation';

/**
 * Component to delete a card
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const DeleteCardPage = ({ token }) => {
  const { cardId } = useParams();
  const { state } = useLocation();
  const boardId = state?.boardId || '';

  return (
    <DeleteConfirmation
      title="Delete Card"
      message="Are you sure you want to delete this card? This action cannot be undone."
      onDelete={() => deleteCard(cardId)}
      cancelPath={`/boards/${boardId}`}
    />
  );
};

export default DeleteCardPage;