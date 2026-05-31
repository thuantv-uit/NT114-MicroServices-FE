import React from 'react';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';
import '../styles/column.css';

const CreateColumn = ({ boardId, onClose }) => {
  return (
    <FormContainer title="Create New Column">
      <GenericForm
        initialValues={{ title: '' }}
        validate={validateColumnForm}
        onSubmit={async (values) => {
          try {
            await createColumn(values.title, boardId);
            showToast('Column created successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }}
        submitLabel="Create Column"
        cancelPath={null}
        onCancel={onClose}
        fields={[{ name: 'title', label: 'Column Title', required: true }]}
      />
    </FormContainer>
  );
};

export default CreateColumn;