import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { deleteCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
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
  const navigate = useNavigate();
  const boardId = state?.boardId || '';
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!token) {
      showToast('Authentication token is missing', 'error');
      navigate(`/boards/${boardId}`);
      return;
    }
    setLoading(true);
    try {
      await deleteCard(cardId);
      showToast('Card deleted successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to delete card', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteConfirmation
      title="Delete Card"
      message="Are you sure you want to delete this card? This action cannot be undone."
      onDelete={handleDelete}
      cancelPath={`/boards/${boardId}`}
      loading={loading}
    />
  );
};

export default DeleteCardPage;