/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCard, fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { validateCardForm } from '../../../utils/validateUtils';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditCardHeader from './EditCardHeader';
import EditCardLeftPanel from './EditCardLeftPanel';
import EditCardRightPanel from './EditCardRightPanel';

const EditCardPage = ({ token }) => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardId = state?.boardId || '';
  const columnId = state?.columnId || '';
  const [formValues, setFormValues] = useState({
    title: state?.title || '',
    description: state?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [processValue, setProcessValue] = useState(0); // Giả lập mức độ hoàn thành
  const [processError, setProcessError] = useState('');

  useEffect(() => {
    const loadCard = async () => {
      if (!token) {
        showToast('Authentication token is missing', 'error');
        navigate(`/boards/${boardId}`);
        return;
      }
      setLoading(true);
      try {
        const cards = await fetchCards(columnId);
        const card = cards.find((c) => c._id === cardId);
        if (card) {
          setFormValues({ title: card.title, description: card.description || '' });
          setProcessValue(card.process || 0); // Giả lập process từ card
        } else {
          showToast('Card not found', 'error');
          navigate(`/boards/${boardId}`);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load card', 'error');
        navigate(`/boards/${boardId}`);
      } finally {
        setLoading(false);
      }
    };
    if (!state?.title && columnId) {
      loadCard();
    }
  }, [cardId, columnId, boardId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target || e; // Hỗ trợ cả event và object
    setFormValues((prev) => ({ ...prev, [name]: value }));
    const validationErrors = validateCardForm({ ...formValues, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCardForm(formValues);
    setErrors(validationErrors);
    if (!token) {
      showToast('Authentication token is missing', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateCard(cardId, formValues.title, formValues.description);
      showToast('Card updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to update card', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProcess = async () => {
    const processNum = Number(processValue);
    if (isNaN(processNum) || processNum < 0 || processNum > 100) {
      setProcessError('Mức độ hoàn thành phải là số từ 0 đến 100');
      return;
    }
    setProcessError('');
    try {
      // Logic cập nhật process (giả lập, cần tích hợp API thực tế)
      showToast('Progress updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update progress', 'error');
    }
  };

  const handleClose = () => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <Modal
      disableScrollLock
      open={true}
      onClose={handleClose}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 1200,
          maxWidth: 1200,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          border: 'none',
          outline: 0,
          margin: '40px auto',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 80px)',
        }}
      >
        <EditCardHeader onClose={handleClose} />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <EditCardLeftPanel
            formValues={formValues}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
            loading={loading}
          />
          <EditCardRightPanel
            processValue={processValue}
            setProcessValue={setProcessValue}
            processError={processError}
            handleUpdateProcess={handleUpdateProcess}
            loading={loading}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCardPage;