import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';

/**
 * Component to create a new column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const CreateColumn = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialValues = { title: '' };
  const fields = [
    { name: 'title', label: 'Column Title', required: true },
  ];

  return (
    <FormContainer title="Create New Column">
      <GenericForm
        initialValues={initialValues}
        validate={validateColumnForm}
        onSubmit={async (values) => {
          await createColumn(values.title, id);
          showToast('Column created successfully!', 'success');
          setTimeout(() => navigate(`/boards/${id}`), 2000);
        }}
        submitLabel="Create Column"
        cancelPath={`/boards/${id}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default CreateColumn;