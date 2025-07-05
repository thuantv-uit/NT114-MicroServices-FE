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
      <Box
        sx={{
          ...COLUMN_STYLE,
          bgcolor: '#EBECF0', // Đảm bảo nền xám nhạt
          borderRadius: '8px', // Bo góc 8px
          p: 1, // Padding 8px, hỗ trợ khung bao phủ
          minWidth: '272px', // Chiều rộng giống Trello
          maxWidth: '272px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            ...COLUMN_HEADER_STYLE,
            mb: 0.5, // Giảm khoảng cách xuống 4px
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
              onEdit={() => navigate(`/columns/${column._id}/edit`, { state: { title: column.title, boardId } })}
              onDelete={() => navigate(`/columns/${column._id}/delete`, { state: { boardId } })}
              onAddCard={() => navigate(`/columns/${column._id}/cards/create`, { state: { boardId } })}
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