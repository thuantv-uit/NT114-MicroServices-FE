import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import CardList from '../../cards/components/CardList';
import { COLUMN_STYLE, COLUMN_HEADER_STYLE } from '../../../constants/styles';

/**
 * Component to display a column
 * @param {Object} props
 * @param {Object} props.column - Column data
 * @param {string} props.boardId - Board ID
 * @param {string} props.token - Authentication token
 * @param {Function} props.onRefresh - Refresh callback
 * @returns {JSX.Element}
 */
function Column({ column, boardId, token, onRefresh }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column, type: 'COLUMN' },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box sx={COLUMN_STYLE}>
        <Box sx={COLUMN_HEADER_STYLE}>
          <Typography variant="h6">{column.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={() => navigate(`/columns/${column._id}/edit`, { state: { title: column.title, boardId } })}
              onDelete={() => navigate(`/columns/${column._id}/delete`, { state: { boardId } })}
              onAddCard={() => navigate(`/columns/${column._id}/cards/create`, { state: { boardId } })}
            />
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: 'pointer' }} {...listeners} />
            </Tooltip>
          </Box>
        </Box>
        <CardList columnId={column._id} boardId={boardId} token={token} column={column} onRefresh={onRefresh} />
      </Box>
    </div>
  );
}

export default Column;