import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateBoardForm } from '../../../utils/validateUtils';

/**
 * Component to update a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const UpdateBoard = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: 'title', label: 'Board Title', required: true },
    { name: 'description', label: 'Description', required: true, multiline: true, rows: 4 },
  ];

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setInitialValues({ title: data.title, description: data.description || '' });
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id]);

  return (
    <FormContainer title="Update Board" loading={loading}>
      <GenericForm
        initialValues={initialValues}
        validate={validateBoardForm}
        onSubmit={async (values) => {
          await updateBoard(id, values.title, values.description);
          showToast('Board updated successfully!', 'success');
          setTimeout(() => navigate(`/boards/${id}`), 2000);
        }}
        submitLabel="Update Board"
        cancelPath={`/boards/${id}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default UpdateBoard;