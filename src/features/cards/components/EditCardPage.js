/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCard, fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateCardForm } from '../../../utils/validateUtils';

/**
 * Component to edit a card
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const EditCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || '';
  const [initialValues, setInitialValues] = useState({
    title: state?.title || '',
    description: state?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: 'title', label: 'Card Title', required: true },
    { name: 'description', label: 'Description (optional)', multiline: true, rows: 2 },
  ];

  useEffect(() => {
    const loadCard = async () => {
      if (!token) {
        showToast('Authentication token is missing', 'error');
        navigate(`/boards/${boardId}`);
        return;
      }
      setLoading(true);
      try {
        const cards = await fetchCards(columnId);
        const card = cards.find(c => c._id === cardId);
        if (card) {
          setInitialValues({ title: card.title, description: card.description || '' });
        } else {
          showToast('Card not found', 'error');
          navigate(`/boards/${boardId}`);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load card', 'error');
        navigate(`/boards/${boardId}`);
      } finally {
        setLoading(false);
      }
    };
    if (!state?.title && columnId) {
      loadCard();
    }
  }, [cardId, columnId, boardId, token]);

  const handleSubmit = async (values) => {
    if (!token) {
      showToast('Authentication token is missing', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateCard(cardId, values.title, values.description);
      showToast('Card updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to update card', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Edit Card" loading={loading}>
      <GenericForm
        initialValues={initialValues}
        validate={validateCardForm}
        onSubmit={handleSubmit}
        submitLabel="Update Card"
        cancelPath={`/boards/${boardId}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default EditCardPage;