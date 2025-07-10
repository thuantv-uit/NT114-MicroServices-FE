import React from 'react';
import { useParams } from 'react-router-dom';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';

/**
 * Component to create a new column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const CreateColumn = ({ token, onClose }) => {
  const { id } = useParams();
  const initialValues = { title: '' };
  const fields = [
    { name: 'title', label: 'Column Title', required: true, InputProps: { sx: { fontSize: '16px' } } },
  ];

  return (
    <FormContainer title="Create New Column">
      <GenericForm
        initialValues={initialValues}
        validate={validateColumnForm}
        onSubmit={async (values) => {
          try {
            await createColumn(values.title, id);
            showToast('Column created successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }}
        submitLabel="Create Column"
        cancelPath={null}
        onCancel={onClose}
        fields={fields}
      />
    </FormContainer>
  );
};

export default CreateColumn;