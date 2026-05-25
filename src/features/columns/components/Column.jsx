import React from 'react';
import { Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddIcon from '@mui/icons-material/Add';
import CardList from '../../cards/components/Card';
import '../styles/column.css';

// Fake column colors — TODO: replace with column.color from API
const COLUMN_COLORS = ['#E53E3E','#D97706','#38A169','#3B5BDB','#7C3AED','#0891B2','#DB2777'];
const getColumnColor = (id) => {
  const idx = parseInt(id?.slice(-2) || '0', 16) % COLUMN_COLORS.length;
  return COLUMN_COLORS[idx];
};

function Column({ column, boardId, token, onRefresh, onEdit, onDelete, onAddCard }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column, type: 'COLUMN' },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
  };

  const color    = column.color || getColumnColor(column._id);
  const cardCount = column.cardOrderIds?.length ?? 0;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`col-card${isDragging ? ' col-card--dragging' : ''}`}>

        {/* ── Header ── */}
        <div className="col-header">
          <div className="col-header-dot" style={{ background: color }} />
          <span className="col-title">{column.title}</span>
          <span className="col-card-count">{cardCount}</span>
          <div className="col-header-actions">
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <Tooltip title="Drag to reorder" placement="top">
              <DragHandleIcon className="col-drag-handle" {...listeners} />
            </Tooltip>
          </div>
        </div>

        {/* ── Cards area ── */}
        <div className="col-cards-area" data-column-id={column._id}>
          <CardList
            columnId={column._id}
            boardId={boardId}
            token={token}
            column={column}
            onRefresh={onRefresh}
          />
        </div>

        {/* ── Add card ── */}
        <div className="col-footer">
          <button className="col-add-card-btn" onClick={onAddCard}>
            <AddIcon style={{ fontSize: 16 }} />
            Create Card
          </button>
        </div>

      </div>
    </div>
  );
}

export default Column;