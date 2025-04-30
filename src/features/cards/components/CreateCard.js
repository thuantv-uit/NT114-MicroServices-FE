import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateCardForm } from '../../../utils/validateUtils';

/**
 * Component to create a new card
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const CreateCard = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const initialValues = { title: '', description: '' };
  const fields = [
    { name: 'title', label: 'Card Title', required: true },
    { name: 'description', label: 'Description (optional)', multiline: true, rows: 2 },
  ];

  const handleSubmit = async (values) => {
    if (!token) {
      showToast('Authentication token is missing', 'error');
      return;
    }
    try {
      await createCard(values.title, values.description, columnId);
      showToast('Card created successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to create card', 'error');
    }
  };

  return (
    <FormContainer title="Create New Card">
      <GenericForm
        initialValues={initialValues}
        validate={validateCardForm}
        onSubmit={handleSubmit}
        submitLabel="Create Card"
        cancelPath={`/boards/${boardId}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default CreateCard;