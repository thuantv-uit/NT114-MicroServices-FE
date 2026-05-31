import React, { useState, useEffect } from 'react';
import { updateColumn, fetchColumns } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';
import '../styles/column.css';

const ColumnEdit = ({ token, columnId, boardId, initialValues, onClose }) => {
  const [formValues, setFormValues] = useState(initialValues || { title: '', backgroundColor: '#EBECF0' });
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (initialValues?.title) return;
    const load = async () => {
      setLoading(true);
      try {
        const cols = await fetchColumns(boardId);
        const col  = cols.find((c) => c._id === columnId);
        if (col) setFormValues({ title: col.title, backgroundColor: col.backgroundColor || '#EBECF0' });
        else showToast('Column not found', 'error');
      } catch (err) {
        showToast(err.message, 'error');
      } finally { setLoading(false); }
    };
    load();
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
        fields={[
          { name: 'title',           label: 'Column Title',      required: true  },
          { name: 'backgroundColor', label: 'Background Color',  type: 'color', required: false },
        ]}
      />
    </FormContainer>
  );
};

export default ColumnEdit;