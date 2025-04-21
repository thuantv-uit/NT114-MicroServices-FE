import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { deleteColumn, updateBoardColumnOrder } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import DeleteConfirmation from '../../../components/DeleteConfirmation';

/**
 * Component to delete a column
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const DeleteColumn = ({ token }) => {
  const { columnId } = useParams();
  const { state } = useLocation();
  const boardId = state?.boardId || '';

  const handleDelete = async () => {
    await deleteColumn(columnId);
    const board = await fetchBoard(boardId);
    const newColumnOrderIds = board.columnOrderIds.filter(id => id !== columnId);
    await updateBoardColumnOrder(boardId, newColumnOrderIds);
  };

  return (
    <DeleteConfirmation
      title="Delete Column"
      message="Are you sure you want to delete this column? This action cannot be undone."
      onDelete={handleDelete}
      cancelPath={`/boards/${boardId}`}
    />
  );
};

export default DeleteColumn;