import React from 'react';
import { createBoard, fetchLatestBoardId } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import '../styles/board.css';

const ConfirmBoardCreation = ({ title, description, onClose, onBoardCreated }) => {
  const handleConfirm = async () => {
    try {
      await createBoard(title, description, '#FFFFFF');
      showToast('Board created successfully!', 'success');
      const response = await fetchLatestBoardId();
      const boardId = response?.boardId;
      if (boardId && onBoardCreated) onBoardCreated(boardId);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="board-page confirm-creation">
      <h3 className="confirm-creation__title">
        <CheckCircleOutlineIcon style={{ fontSize: 18, marginRight: 6, verticalAlign: 'middle', color: 'var(--c-primary)' }} />
        Confirm Board Creation
      </h3>
      <div className="confirm-creation__row">
        <span className="confirm-creation__label">Title</span>
        <span className="confirm-creation__value">{title || '—'}</span>
      </div>
      <div className="confirm-creation__row">
        <span className="confirm-creation__label">Description</span>
        <span className="confirm-creation__value">{description || '—'}</span>
      </div>
      <div className="dialog-actions" style={{ marginTop: 20 }}>
        <button className="btn btn-primary" onClick={handleConfirm}>Create board</button>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmBoardCreation;