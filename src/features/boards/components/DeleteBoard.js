import React from 'react';
import { useParams } from 'react-router-dom';
import { deleteBoard } from '../services/boardService';
import DeleteConfirmation from '../../../components/DeleteConfirmation';

/**
 * Component to delete a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const DeleteBoard = ({ token }) => {
  const { id } = useParams();

  return (
    <DeleteConfirmation
      title="Delete Board"
      message="Are you sure you want to delete this board? This action cannot be undone."
      onDelete={() => deleteBoard(id)}
      cancelPath={`/boards/${id}`}
    />
  );
};

export default DeleteBoard;