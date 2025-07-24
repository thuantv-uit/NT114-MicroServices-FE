import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';
import { Box, Button, Typography } from '@mui/material';

/**
 * Component to create a new column
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the dialog
 * @param {string} [props.chatbotBoardId] - Board ID from chatbot (optional)
 * @param {string} [props.chatbotTitle] - Column title from chatbot (optional)
 * @returns {JSX.Element}
 */
const CreateColumn = ({ onClose, chatbotBoardId, chatbotTitle }) => {
  const { id } = useParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(!!chatbotBoardId && !!chatbotTitle);

  // Xử lý logic tạo column từ input người dùng
  const handleManualSubmit = async (values) => {
    try {
      await createColumn(values.title, id || chatbotBoardId);
      showToast('Column created successfully!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Xử lý logic tạo column từ chatbot
  const handleChatbotSubmit = async () => {
    if (!chatbotBoardId || !chatbotTitle) {
      showToast('Missing board ID or column title from chatbot.', 'error');
      return;
    }
    try {
      await createColumn(chatbotTitle, chatbotBoardId);
      showToast('Column created successfully from chatbot!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Xử lý xác nhận tạo column từ chatbot
  const handleConfirm = () => {
    handleChatbotSubmit();
    setIsConfirmOpen(false);
  };

  // Đóng form xác nhận
  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    onClose();
  };

  // Form cho input người dùng hoặc hiển thị xác nhận từ chatbot
  const initialValues = { title: chatbotTitle || '' };
  const fields = [
    { name: 'title', label: 'Column Title', required: true, InputProps: { sx: { fontSize: '16px' } } },
  ];

  return (
    <FormContainer title="Create New Column">
      {!isConfirmOpen ? (
        <GenericForm
          initialValues={initialValues}
          validate={validateColumnForm}
          onSubmit={handleManualSubmit}
          submitLabel="Create Column"
          cancelPath={null}
          onCancel={onClose}
          fields={fields}
        />
      ) : (
        <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6">Confirm Column Creation</Typography>
          <Typography variant="body1"><strong>Title:</strong> {chatbotTitle || 'Not provided'}</Typography>
          <Typography variant="body1"><strong>Board ID:</strong> {chatbotBoardId || 'Not provided'}</Typography>
          <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Yes
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelConfirm}>
              No
            </Button>
          </Box>
        </Box>
      )}
    </FormContainer>
  );
};

export default CreateColumn;