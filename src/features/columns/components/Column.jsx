import React from 'react';
import { Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddIcon from '@mui/icons-material/Add';
import CardList from '../../cards/components/Card';
import '../styles/column.css';

function Column({ column, boardId, token, onRefresh, onEdit, onDelete, onAddCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column, type: 'COLUMN' },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`col-card${isDragging ? ' col-card--dragging' : ''}`}>

        {/* ── Header ── */}
        <div className="col-header">
          <span className="col-title">{column.title}</span>
          <div className="col-header-actions">
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <Tooltip title="Drag to reorder" placement="top">
              <DragHandleIcon
                className="col-drag-handle"
                {...listeners}
              />
            </Tooltip>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="col-cards-area">
          <CardList
            columnId={column._id}
            boardId={boardId}
            token={token}
            column={column}
            onRefresh={onRefresh}
          />
        </div>

        {/* ── Add card ── */}
        <button className="col-add-card-btn" onClick={onAddCard}>
          <AddIcon />
          Create Card
        </button>

      </div>
    </div>
  );
}

export default Column;