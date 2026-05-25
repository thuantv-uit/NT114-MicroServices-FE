/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { fetchColumns, updateBoardColumnOrder, updateColumn } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { CircularProgress, Dialog } from '@mui/material';
import Column      from './Column';
import CreateCard  from '../../cards/components/CreateCard';
import ColumnEdit  from './ColumnEdit';
import DeleteColumn from './DeleteColumn';
import Card from '../../cards/components/Card';
import {
  DndContext, useSensor, useSensors, DragOverlay,
  defaultDropAnimationSideEffects, closestCorners,
  pointerWithin, rectIntersection,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import '../styles/column.css';

// ── Custom collision detection ────────────────────────────────────
// Ưu tiên pointerWithin (chính xác hơn khi hover vào column trống)
// fallback về rectIntersection
const customCollision = (args) => {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) return pointerHits;
  return rectIntersection(args);
};

const ColumnList = ({ boardId, token, ColumnContainer, CardContainer }) => {
  const [columns,            setColumns]            = useState([]);
  const [orderedColumnIds,   setOrderedColumnIds]   = useState([]);
  const [loading,            setLoading]            = useState(false);
  const [activeDragItemId,   setActiveDragItemId]   = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [sourceColumn,       setSourceColumn]       = useState(null);
  const [openEditDialog,        setOpenEditDialog]        = useState(false);
  const [openDeleteDialog,      setOpenDeleteDialog]      = useState(false);
  const [openCreateCardDialog,  setOpenCreateCardDialog]  = useState(false);
  const [selectedColumn,        setSelectedColumn]        = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors     = useSensors(mouseSensor, touchSensor);

  const loadColumns = useCallback(async () => {
    setLoading(true);
    try {
      const [data, board] = await Promise.all([
        fetchColumns(boardId),
        fetchBoard(boardId),
      ]);
      setColumns(data);
      setOrderedColumnIds(board.columnOrderIds || data.map(c => c._id));
    } catch (err) {
      showToast(err.message, 'error');
    } finally { setLoading(false); }
  }, [boardId]);

  useEffect(() => { loadColumns(); }, [loadColumns]);

  // ── Find column by cardId (search in cardOrderIds) ────────────
  const findColumnByCardId = useCallback((cardId) =>
    columns.find(col => col?.cardOrderIds?.includes(cardId)),
  [columns]);

  // ── Find column by columnId directly ─────────────────────────
  const findColumnById = useCallback((colId) =>
    columns.find(col => col._id === colId),
  [columns]);

  // ── Determine if an id belongs to a column or a card ─────────
  const isColumnId = useCallback((id) =>
    columns.some(col => col._id === id),
  [columns]);

  // ─────────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => {
    setActiveDragItemId(active.id);
    setActiveDragItemType(active.data.current?.type);
    setActiveDragItemData(active.data.current);
    if (active.data.current?.type === 'CARD')
      setSourceColumn(findColumnByCardId(active.id));
  };

  // ── handleDragOver: live-update khi kéo card sang column khác ─
  const handleDragOver = ({ active, over }) => {
    if (!over || activeDragItemType !== 'CARD') return;

    const activeId = active.id;
    const overId   = over.id;
    if (activeId === overId) return;

    const srcCol  = findColumnByCardId(activeId);
    // over có thể là card hoặc column
    const destCol = isColumnId(overId)
      ? findColumnById(overId)
      : findColumnByCardId(overId);

    if (!srcCol || !destCol || srcCol._id === destCol._id) return;

    // Di chuyển card tạm thời trong state để có visual feedback
    setColumns(prev => {
      const srcCards  = srcCol.cardOrderIds.filter(id => id !== activeId);
      const destCards = [...destCol.cardOrderIds];

      // Tìm vị trí insert
      const overIdx = destCards.indexOf(overId);
      const insertAt = overIdx >= 0 ? overIdx : destCards.length;
      destCards.splice(insertAt, 0, activeId);

      return prev.map(col => {
        if (col._id === srcCol._id)  return { ...col, cardOrderIds: srcCards  };
        if (col._id === destCol._id) return { ...col, cardOrderIds: destCards };
        return col;
      });
    });
  };

  // ── handleDragEnd: persist thay đổi lên server ────────────────
  const handleDragEnd = async ({ active, over }) => {
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setSourceColumn(null);

    if (!active || !over || active.id === over.id) return;

    // ── Kéo COLUMN ──────────────────────────────────────────────
    if (activeDragItemType === 'COLUMN') {
      const oldIdx = orderedColumnIds.indexOf(active.id);
      const newIdx = orderedColumnIds.indexOf(over.id);
      if (oldIdx === newIdx) return;
      const next = arrayMove(orderedColumnIds, oldIdx, newIdx);
      const prev = [...orderedColumnIds];
      setOrderedColumnIds(next);
      try {
        await updateBoardColumnOrder(boardId, next);
        showToast('Column order updated!', 'success');
      } catch (err) {
        setOrderedColumnIds(prev);
        showToast(err.message, 'error');
      }
      return;
    }

    // ── Kéo CARD ────────────────────────────────────────────────
    if (activeDragItemType === 'CARD') {
      const activeId = active.id;
      const overId   = over.id;

      // Sau khi handleDragOver đã update state, tìm lại column
      const srcCol  = findColumnByCardId(activeId);
      const destCol = isColumnId(overId)
        ? findColumnById(overId)
        : findColumnByCardId(overId);

      if (!srcCol || !destCol) return;

      // ── Cùng column: reorder ─────────────────────────────────
      if (srcCol._id === destCol._id) {
        const oi   = srcCol.cardOrderIds.indexOf(activeId);
        const ni   = srcCol.cardOrderIds.indexOf(overId);
        if (oi === ni) return;
        const next = arrayMove(srcCol.cardOrderIds, oi, ni);
        setColumns(prev =>
          prev.map(col => col._id === srcCol._id ? { ...col, cardOrderIds: next } : col)
        );
        try {
          await updateColumn(srcCol._id, srcCol.title, next);
          showToast('Card reordered!', 'success');
        } catch (err) {
          setColumns(columns);
          showToast(err.message, 'error');
        }
        return;
      }

      // ── Khác column: đã được update trong handleDragOver ─────
      // Chỉ cần persist lên server
      const updatedSrc  = columns.find(c => c._id === srcCol._id);
      const updatedDest = columns.find(c => c._id === destCol._id);
      if (!updatedSrc || !updatedDest) return;

      try {
        await Promise.all([
          updateColumn(updatedSrc._id,  updatedSrc.title,  updatedSrc.cardOrderIds),
          updateColumn(updatedDest._id, updatedDest.title, updatedDest.cardOrderIds),
        ]);
        showToast('Card moved!', 'success');
        loadColumns(); // reload để sync với server
      } catch (err) {
        setColumns(columns);
        showToast(err.message || 'Cannot move card', 'error');
      }
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenCreateCardDialog(false);
    setSelectedColumn(null);
    loadColumns();
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.4' } },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollision}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <CircularProgress size={36} style={{ color: '#fff' }} />
        </div>
      ) : (
        <SortableContext items={orderedColumnIds} strategy={horizontalListSortingStrategy}>
          <div className="col-list-wrapper">
            {orderedColumnIds.length > 0 ? (
              orderedColumnIds.map(colId => {
                const col = columns.find(c => c._id === colId);
                return col ? (
                  <Column
                    key={col._id}
                    column={col}
                    boardId={boardId}
                    token={token}
                    onRefresh={loadColumns}
                    onEdit={() => { setSelectedColumn(col); setOpenEditDialog(true); }}
                    onDelete={() => { setSelectedColumn(col); setOpenDeleteDialog(true); }}
                    onAddCard={() => {
                      if (col?._id) { setSelectedColumn(col); setOpenCreateCardDialog(true); }
                      else showToast('Cannot create card: missing column ID', 'error');
                    }}
                    ColumnContainer={ColumnContainer}
                    CardContainer={CardContainer}
                  />
                ) : null;
              })
            ) : (
              <div className="col-empty">
                <div className="col-empty__icon">📋</div>
                <p>No columns yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </SortableContext>
      )}

      <DragOverlay dropAnimation={dropAnimation}>
        {activeDragItemType === 'COLUMN' && activeDragItemData ? (
          <Column
            column={activeDragItemData} boardId={boardId} token={token}
            onRefresh={loadColumns} onEdit={() => {}} onDelete={() => {}} onAddCard={() => {}}
            ColumnContainer={ColumnContainer} CardContainer={CardContainer}
          />
        ) : activeDragItemType === 'CARD' && activeDragItemData ? (
          <Card
            card={activeDragItemData} boardId={boardId}
            columnId={sourceColumn?._id} token={token}
            onEdit={() => {}} onDelete={() => {}} onInviteUser={() => {}} onRefresh={() => {}}
            CardContainer={CardContainer}
          />
        ) : null}
      </DragOverlay>

      {/* Dialogs */}
      {selectedColumn && (
        <>
          <Dialog open={openEditDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <ColumnEdit
              token={token} columnId={selectedColumn._id} boardId={boardId}
              initialValues={{ title: selectedColumn.title, backgroundColor: selectedColumn.backgroundColor || '#EBECF0' }}
              onClose={handleDialogClose}
            />
          </Dialog>
          <Dialog open={openDeleteDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DeleteColumn
              token={token} columnId={selectedColumn._id}
              boardId={boardId} onClose={handleDialogClose}
            />
          </Dialog>
          <Dialog open={openCreateCardDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <CreateCard
              token={token} columnId={selectedColumn._id}
              boardId={boardId} onClose={handleDialogClose}
            />
          </Dialog>
        </>
      )}
    </DndContext>
  );
};

export default ColumnList;