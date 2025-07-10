import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import CardList from '../../cards/components/Card';
import { COLUMN_STYLE, COLUMN_HEADER_STYLE } from '../../../constants/styles';

/**
 * Component to display a column
 * @param {Object} props
 * @param {Object} props.column - Column data
 * @param {string} props.boardId - Board ID
 * @param {string} props.token - Authentication token
 * @param {Function} props.onRefresh - Refresh callback
 * @param {Function} props.onEdit - Edit column callback
 * @param {Function} props.onDelete - Delete column callback
 * @param {Function} props.onAddCard - Add card callback
 * @returns {JSX.Element}
 */
function Column({ column, boardId, token, onRefresh, onEdit, onDelete, onAddCard }) {
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
      <Box
        sx={{
          ...COLUMN_STYLE,
          bgcolor: column.backgroundColor,
          borderRadius: '8px',
          p: 1,
          minWidth: '272px',
          maxWidth: '272px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            ...COLUMN_HEADER_STYLE,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#172B4D',
              fontSize: '14px',
            }}
          >
            {column.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddCard={onAddCard}
            />
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: 'pointer' }} {...listeners} />
            </Tooltip>
          </Box>
        </Box>
        <CardList
          columnId={column._id}
          boardId={boardId}
          token={token}
          column={column}
          onRefresh={onRefresh}
        />
      </Box>
    </div>
  );
}

export default Column;