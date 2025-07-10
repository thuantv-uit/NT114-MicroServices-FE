import React, { useState, useEffect } from 'react';
import { updateColumn, fetchColumns } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';

/**
 * Component to edit a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {string} props.columnId - Column ID
 * @param {string} props.boardId - Board ID
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onClose - Function to close the dialog
 * @returns {JSX.Element}
 */
const ColumnEdit = ({ token, columnId, boardId, initialValues, onClose }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: 'title', label: 'Column Title', required: true, InputProps: { sx: { fontSize: '16px' } } },
    { name: 'backgroundColor', label: 'Background Color', type: 'color', required: false, InputProps: { sx: { fontSize: '16px' } } },
  ];

  useEffect(() => {
    const loadColumn = async () => {
      setLoading(true);
      try {
        const columns = await fetchColumns(boardId);
        const column = columns.find(c => c._id === columnId);
        if (column) {
          setFormValues({ 
            title: column.title,
            backgroundColor: column.backgroundColor || '#ffffff'
          });
        } else {
          showToast('Column not found', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    if (!initialValues.title) {
      loadColumn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnId, boardId]);

  return (
    <FormContainer title="Edit Column" loading={loading}>
      <GenericForm
        initialValues={formValues}
        validate={validateColumnForm}
        onSubmit={async (values) => {
          try {
            await updateColumn(columnId, values.title, formValues.cardOrderIds, values.backgroundColor);
            showToast('Column updated successfully!', 'success');
            onClose();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }}
        submitLabel="Update Column"
        cancelPath={null}
        onCancel={onClose}
        fields={fields}
      />
    </FormContainer>
  );
};

export default ColumnEdit;