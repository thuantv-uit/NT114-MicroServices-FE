import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateBoardForm } from '../../../utils/validateUtils';

/**
 * Component to create a new board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const BoardCreate = ({ token }) => {
  const navigate = useNavigate();
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
          await createBoard(values.title, values.description, values.backgroundColor);
          showToast('Board created successfully!', 'success');
          setTimeout(() => navigate('/boards'), 2000);
        }}
        submitLabel="Create Board"
        cancelPath="/boards"
        fields={fields}
      />
    </FormContainer>
  );
};

export default BoardCreate;