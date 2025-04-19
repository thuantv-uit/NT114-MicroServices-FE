// src/features/columns/components/Column.jsx
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import CardList from '../../cards/components/CardList';

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
      <Box
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(100vh - ${theme.spacing(5)})`,
        }}
      >
        {/* Tiêu đề cột */}
        <Box
          sx={{
            height: '60px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{column.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={() => navigate(`/columns/${column._id}/edit`, { state: { title: column.title, boardId } })}
              onDelete={() => navigate(`/columns/${column._id}/delete`, { state: { boardId } })}
              onAddCard={() => navigate(`/columns/${column._id}/cards/create`, { state: { boardId } })}
              onRefresh={onRefresh}
            />
            <Tooltip title="Kéo để di chuyển">
              <DragHandleIcon sx={{ cursor: 'pointer' }} {...listeners} />
            </Tooltip>
          </Box>
        </Box>
        {/* Danh sách card */}
        <CardList columnId={column._id} boardId={boardId} token={token} column={column} onRefresh={onRefresh} />
      </Box>
    </div>
  );
}

export default Column;

