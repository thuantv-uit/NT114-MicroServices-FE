import React from 'react';
import { createBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateBoardForm } from '../../../utils/validateUtils';

/**
 * Component to create a new board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const BoardCreate = ({ token, onClose }) => {
  const initialValues = { title: '', description: '', backgroundColor: '#FFFFFF' };
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