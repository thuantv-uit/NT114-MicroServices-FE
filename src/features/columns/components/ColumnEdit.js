import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateColumn, fetchColumns } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';

/**
 * Component to edit a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const ColumnEdit = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const [initialValues, setInitialValues] = useState({ title: state?.title || '' });
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: 'title', label: 'Column Title', required: true },
  ];

  useEffect(() => {
    const loadColumn = async () => {
      setLoading(true);
      try {
        const columns = await fetchColumns(boardId);
        const column = columns.find(c => c._id === columnId);
        if (column) {
          setInitialValues({ title: column.title });
        } else {
          showToast('Column not found', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    if (!state?.title) {
      loadColumn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnId, boardId]);

  return (
    <FormContainer title="Edit Column" loading={loading}>
      <GenericForm
        initialValues={initialValues}
        validate={validateColumnForm}
        onSubmit={async (values) => {
          await updateColumn(columnId, values.title, initialValues.cardOrderIds);
          showToast('Column updated successfully!', 'success');
          setTimeout(() => navigate(`/boards/${boardId}`), 2000);
        }}
        submitLabel="Update Column"
        cancelPath={`/boards/${boardId}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default ColumnEdit;