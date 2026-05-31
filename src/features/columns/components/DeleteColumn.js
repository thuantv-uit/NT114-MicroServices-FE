import React, { useState } from 'react';
import { deleteColumn, updateBoardColumnOrder } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { showToast } from '../../../utils/toastUtils';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon  from '@mui/icons-material/WarningAmber';
import '../styles/column.css';
import '../../../features/boards/styles/board.css';

const DeleteColumn = ({ token, columnId, boardId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteColumn(columnId);
      const board = await fetchBoard(boardId);
      const newOrder = board.columnOrderIds.filter((id) => id !== columnId);
      await updateBoardColumnOrder(boardId, newOrder);
      showToast('Column deleted successfully!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-dialog">
      <div className="col-delete-icon">
        <DeleteOutlineIcon style={{ fontSize: 22 }} />
      </div>
      <h2 className="col-dialog__title">Delete Column</h2>
      <p className="col-delete-body">
        Are you sure you want to delete this column? All cards inside will be permanently removed.
      </p>
      <div className="col-delete-warning">
        <WarningAmberIcon style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }} />
        <span>This action <strong>cannot be undone</strong>.</span>
      </div>
      <div className="dialog-actions">
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting…' : 'Yes, delete column'}
        </button>
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteColumn;