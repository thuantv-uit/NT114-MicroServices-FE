import React from 'react';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateCardForm } from '../../../utils/validateUtils';
import { createCard } from '../services/cardService';

/**
 * Component to create a new card
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {string} props.columnId - Column ID
 * @param {string} props.boardId - Board ID
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const CreateCard = ({ token, columnId, boardId, onClose }) => {
  const initialValues = { title: '', description: '' };
  const fields = [
    { name: 'title', label: 'Card Title', required: true },
    { name: 'description', label: 'Description (optional)', multiline: true, rows: 2 },
  ];

  return (
    <FormContainer title="Create New Card">
      <GenericForm
        initialValues={initialValues}
        validate={validateCardForm}
        onSubmit={async (values) => {
          if (!token) {
            showToast('Authentication token is missing', 'error');
            return;
          }
          if (!columnId) {
            showToast('ID cột là bắt buộc', 'error');
            return;
          }
          try {
            await createCard(values.title, values.description, columnId);
            showToast('Card created successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message || 'Failed to create card', 'error');
          }
        }}
        submitLabel="Create Card"
        cancelPath={null}
        onCancel={onClose}
        fields={fields}
      />
    </FormContainer>
  );
};

export default CreateCard;