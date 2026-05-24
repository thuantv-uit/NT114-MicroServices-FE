/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateCard, fetchCardById, addComment } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { validateCardForm } from '../../../utils/validateUtils';
import Modal from '@mui/material/Modal';
import EditCardHeader    from './EditCardHeader';
import EditCardLeftPanel  from './EditCardLeftPanel';
import EditCardRightPanel from './EditCardRightPanel';
import '../styles/card.css';

const EditCardPage = ({ token }) => {
  const { cardId }  = useParams();
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const boardId     = state?.boardId  || '';
  const columnId    = state?.columnId || '';

  const [formValues,   setFormValues]   = useState({ title: state?.title || '', description: state?.description || '' });
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);
  const [processValue, setProcessValue] = useState(0);
  const [processError, setProcessError] = useState('');
  const [comments,     setComments]     = useState([]);
  const [commentText,  setCommentText]  = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!token) { showToast('Authentication token is missing', 'error'); navigate(`/boards/${boardId || 'dashboard'}`); return; }
      if (!boardId || !columnId) { showToast('Missing board or column information', 'error'); navigate('/dashboard'); return; }
      setLoading(true);
      try {
        const card = await fetchCardById(cardId);
        if (card) {
          setFormValues({ title: card.title, description: card.description || '' });
          setProcessValue(card.process || 0);
          setComments(card.comments || []);
        } else {
          showToast('Card not found', 'error'); navigate(`/boards/${boardId}`);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load card', 'error');
        navigate(`/boards/${boardId || 'dashboard'}`);
      } finally { setLoading(false); }
    };
    load();
  }, [cardId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormValues((p) => ({ ...p, [name]: value }));
    const errs = validateCardForm({ ...formValues, [name]: value });
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateCardForm(formValues);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!token) { showToast('Authentication token is missing', 'error'); return; }
    setLoading(true);
    try {
      await updateCard(cardId, formValues);
      showToast('Card updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${boardId}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to update card', 'error');
    } finally { setLoading(false); }
  };

  const handleUpdateProcess = async () => {
    const num = Number(processValue);
    if (isNaN(num) || num < 0 || num > 100) { setProcessError('Progress must be 0–100'); return; }
    setProcessError('');
    try {
      await updateCard(cardId, { process: num });
      showToast('Progress updated!', 'success');
    } catch (err) { showToast(err.message || 'Failed to update progress', 'error'); }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) { setCommentError('Comment cannot be empty'); return; }
    if (commentText.length > 1000) { setCommentError('Max 1000 characters'); return; }
    setCommentError('');
    setLoading(true);
    try {
      const c = await addComment(cardId, commentText);
      setComments((p) => [...p, c]);
      setCommentText('');
      showToast('Comment added!', 'success');
    } catch (err) { showToast(err.message || 'Failed to add comment', 'error'); }
    finally { setLoading(false); }
  };

  const handleClose = () => navigate(`/boards/${boardId || 'dashboard'}`);

  return (
    <Modal
      disableScrollLock
      open
      onClose={handleClose}
      sx={{
        // MUI Modal backdrop phủ toàn màn hình, bao gồm cả sidebar
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        overflowY: 'auto',
      }}
    >
      <div className="edit-card-modal">
        <EditCardHeader onClose={handleClose} />
        <div className="edit-card-body">
          <EditCardLeftPanel
            formValues={formValues} errors={errors}
            handleChange={handleChange} handleSubmit={handleSubmit}
            handleClose={handleClose} loading={loading}
            comments={comments} commentText={commentText}
            commentError={commentError}
            handleCommentChange={(e) => { setCommentText(e.target.value); setCommentError(''); }}
            handleAddComment={handleAddComment}
          />
          <EditCardRightPanel
            processValue={processValue} setProcessValue={setProcessValue}
            processError={processError} handleUpdateProcess={handleUpdateProcess}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditCardPage;