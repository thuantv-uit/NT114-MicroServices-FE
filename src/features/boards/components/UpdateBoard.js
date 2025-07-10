import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateBoardForm } from '../../../utils/validateUtils';

/**
 * Component to update a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const UpdateBoard = ({ token, onClose }) => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({ title: '', description: '', backgroundColor: '#FFFFFF' });
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: 'title', label: 'Board Title', required: true },
    { name: 'description', label: 'Description', required: true, multiline: true, rows: 4 },
    { name: 'backgroundColor', label: 'Background Color', type: 'color', required: true },
  ];

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setInitialValues({
          title: data.title,
          description: data.description || '',
          backgroundColor: data.backgroundColor || '#FFFFFF',
        });
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
          setLoading(true);
          try {
            await updateBoard(id, values.title, values.description, values.backgroundColor);
            showToast('Board updated successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message, 'error');
          } finally {
            setLoading(false);
          }
        }}
        submitLabel="Update Board"
        cancelPath={null} // No navigation, use onClose
        fields={fields}
        onCancel={onClose} // Pass onClose as cancel handler
      />
    </FormContainer>
  );
};

export default UpdateBoard;