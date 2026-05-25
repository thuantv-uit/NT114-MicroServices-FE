import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { deleteCard } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import WarningAmberIcon  from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import '../styles/card-edit.css';

const DeleteCardPage = ({ token, onClose, cardId: cardIdProp, boardId: boardIdProp }) => {
  // Hỗ trợ cả 2 cách dùng: qua Dialog (props) hoặc qua route (params)
  const params   = useParams();
  const { state } = useLocation();
  const navigate  = useNavigate();

  const cardId  = cardIdProp  || params.cardId;
  const boardId = boardIdProp || state?.boardId || '';

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(`/boards/${boardId}`);
  };

  const handleDelete = async () => {
    if (!token) { showToast('Authentication token is missing', 'error'); return; }
    setLoading(true);
    try {
      await deleteCard(cardId);
      showToast('Card deleted successfully!', 'success');
      handleClose();
    } catch (err) {
      showToast(err.message || 'Failed to delete card', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="col-dialog">
      <div className="col-delete-icon">
        <DeleteOutlineIcon style={{ fontSize: 22 }} />
      </div>
      <h2 className="col-dialog__title">Delete Card</h2>
      <p className="col-delete-body">
        Are you sure you want to delete this card? All comments and attachments will be permanently removed.
      </p>
      <div className="col-delete-warning">
        <WarningAmberIcon style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }} />
        <span>This action <strong>cannot be undone</strong>.</span>
      </div>
      <div className="dialog-actions">
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting…' : 'Yes, delete card'}
        </button>
        <button className="btn btn-ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteCardPage;