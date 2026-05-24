import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import '../styles/board.css';

const DeleteBoard = ({ token, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBoard(id);
      showToast('Board deleted successfully!', 'success');
      onClose();
      navigate('/boards');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-page delete-dialog">
      <div className="delete-dialog__icon">
        <DeleteOutlineIcon style={{ fontSize: 24 }} />
      </div>
      <h2 className="delete-dialog__title">Delete Board</h2>
      <p className="delete-dialog__body">
        Are you sure you want to delete this board? All columns and cards inside will be permanently removed.
      </p>
      <div className="delete-dialog__warning">
        <WarningAmberIcon style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} />
        <span>This action <strong>cannot be undone</strong>.</span>
      </div>
      <div className="dialog-actions">
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting…' : 'Yes, delete board'}
        </button>
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBoard;