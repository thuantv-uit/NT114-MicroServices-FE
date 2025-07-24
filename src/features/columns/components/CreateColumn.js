import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createColumn } from '../services/columnService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateColumnForm } from '../../../utils/validateUtils';
import { Button, Box, Typography } from '@mui/material';

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmValues, setConfirmValues] = useState({ title: '', boardId: '' });

  // Xử lý logic tạo column từ input người dùng
  const handleManualSubmit = async (values) => {
    try {
      await createColumn(values.title, id);
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

  // Mở form xác nhận khi tạo từ chatbot
  const handleConfirmOpen = (title, boardId) => {
    setConfirmValues({ title, boardId });
    setIsConfirmOpen(true);
  };

  // Xử lý xác nhận tạo column
  const handleConfirm = () => {
    handleChatbotSubmit();
    setIsConfirmOpen(false);
  };

  // Đóng form xác nhận
  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  // Logic cho form mặc định (từ input người dùng)
  const initialValues = { title: '' };
  const fields = [
    { name: 'title', label: 'Column Title', required: true, InputProps: { sx: { fontSize: '16px' } } },
  ];

  return (
    <FormContainer title="Create New Column">
      {/* Form mặc định cho input người dùng */}
      <GenericForm
        initialValues={initialValues}
        validate={validateColumnForm}
        onSubmit={handleManualSubmit}
        submitLabel="Create Column"
        cancelPath={null}
        onCancel={onClose}
        fields={fields}
      />

      {/* Xử lý khi có dữ liệu từ chatbot */}
      {chatbotBoardId && chatbotTitle && !isConfirmOpen && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">
            Create column from chatbot: <strong>{chatbotTitle}</strong> on board ID: <strong>{chatbotBoardId}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConfirmOpen(chatbotTitle, chatbotBoardId)}
            sx={{ marginTop: 1 }}
          >
            Confirm Creation
          </Button>
        </Box>
      )}

      {/* Form xác nhận khi tạo từ chatbot */}
      {isConfirmOpen && (
        <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6">Confirm Column Creation</Typography>
          <Typography variant="body1"><strong>Title:</strong> {confirmValues.title}</Typography>
          <Typography variant="body1"><strong>Board ID:</strong> {confirmValues.boardId}</Typography>
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