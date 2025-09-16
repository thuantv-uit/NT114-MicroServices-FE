import React from 'react';
import { createBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateBoardForm } from '../../../utils/validateUtils';

/**
 * Component to create a new board
 * Supports two ways to create a board:
 * 1. Manual input: User enters title, description, and background color directly in the form.
 * 2. From chatbot: Handled separately in ConfirmBoardCreation.js with Yes/No confirmation.
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the dialog
 * @param {string} [props.title=''] - Pre-filled title (not used in this component, used in ConfirmBoardCreation)
 * @param {string} [props.description=''] - Pre-filled description (not used in this component, used in ConfirmBoardCreation)
 * @returns {JSX.Element}
 */
const BoardCreate = ({ onClose, title = '', description = '' }) => {
  // Initialize form with empty values for manual input (ignore title/description props)
  const initialValues = {
    title: '',
    description: '',
    backgroundColor: '#FFFFFF',
  };
  const fields = [
    { name: 'title', label: 'Board Title', required: true },
    { name: 'description', label: 'Description', required: true, multiline: true, rows: 4 },
    { name: 'backgroundColor', label: 'Background Color', type: 'color', required: true },
  ];

  return (
    <FormContainer title="Create New Board">
      <GenericForm
        initialValues={initialValues}
        validate={validateBoardForm}
        onSubmit={async (values) => {
          try {
            // Giả định token được xử lý trong createBoard hoặc lấy từ context/hook
            await createBoard(values.title, values.description, values.backgroundColor);
            showToast('Board created successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }}
        submitLabel="Create Board"
        cancelPath={null} // No navigation, use onClose
        onCancel={onClose} // Pass onClose as cancel handler
        fields={fields}
      />
    </FormContainer>
  );
};

export default BoardCreate;