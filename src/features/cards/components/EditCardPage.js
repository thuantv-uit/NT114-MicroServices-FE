/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCard, fetchCardById, addComment } from '../services/cardService';
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
  const [processValue, setProcessValue] = useState(0);
  const [processError, setProcessError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const loadCard = async () => {
      if (!token) {
        showToast('Authentication token is missing', 'error');
        navigate(`/boards/${boardId || 'dashboard'}`);
        return;
      }
      if (!boardId || !columnId) {
        showToast('Missing board or column information', 'error');
        navigate('/dashboard');
        return;
      }
      setLoading(true);
      try {
        const card = await fetchCardById(cardId);
        if (card) {
          setFormValues({ title: card.title, description: card.description || '' });
          setProcessValue(card.process || 0);
          setComments(card.comments || []);
        } else {
          showToast('Card not found', 'error');
          navigate(`/boards/${boardId}`);
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        showToast(err.message || 'Failed to load card', 'error');
        navigate(`/boards/${boardId || 'dashboard'}`);
      } finally {
        setLoading(false);
      }
    };
    loadCard();
  }, [cardId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    const validationErrors = validateCardForm({ ...formValues, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCardForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    if (!token) {
      showToast('Authentication token is missing', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateCard(cardId, formValues);
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
      await updateCard(cardId, { process: processNum });
      showToast('Progress updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update progress', 'error');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setCommentError('Bình luận không được để trống');
      return;
    }
    if (commentText.length > 1000) {
      setCommentError('Bình luận không được vượt quá 1000 ký tự');
      return;
    }
    setCommentError('');
    setLoading(true);
    try {
      const newComment = await addComment(cardId, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      showToast('Comment added successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
    setCommentError('');
  };

  const handleClose = () => {
    navigate(`/boards/${boardId || 'dashboard'}`);
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
            comments={comments}
            commentText={commentText}
            commentError={commentError}
            handleCommentChange={handleCommentChange}
            handleAddComment={handleAddComment}
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