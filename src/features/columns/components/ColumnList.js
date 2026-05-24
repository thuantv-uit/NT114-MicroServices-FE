/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { fetchColumns, updateBoardColumnOrder, updateColumn } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { CircularProgress, Dialog } from '@mui/material';
import Column   from './Column';
import CreateCard from '../../cards/components/CreateCard';
import ColumnEdit   from './ColumnEdit';
import DeleteColumn from './DeleteColumn';
import Card from '../../cards/components/Card';
import {
  DndContext, useSensor, useSensors, DragOverlay,
  defaultDropAnimationSideEffects, closestCorners,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import '../styles/column.css';

const ColumnList = ({ boardId, token, ColumnContainer, CardContainer }) => {
  const [columns,           setColumns]           = useState([]);
  const [orderedColumnIds,  setOrderedColumnIds]  = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [activeDragItemId,   setActiveDragItemId]   = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [sourceColumn,       setSourceColumn]       = useState(null);
  const [openEditDialog,       setOpenEditDialog]       = useState(false);
  const [openDeleteDialog,     setOpenDeleteDialog]     = useState(false);
  const [openCreateCardDialog, setOpenCreateCardDialog] = useState(false);
  const [selectedColumn,       setSelectedColumn]       = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors     = useSensors(mouseSensor, touchSensor);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const [data, board] = await Promise.all([fetchColumns(boardId), fetchBoard(boardId)]);
      setColumns(data);
      setOrderedColumnIds(board.columnOrderIds || data.map((c) => c._id));
    } catch (err) {
      showToast(err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadColumns(); }, [boardId]);

  const findColumnByCardId = (cardId) =>
    columns.find((col) => col?.cardOrderIds?.includes(cardId));

  const handleDragStart = ({ active }) => {
    setActiveDragItemId(active.id);
    setActiveDragItemType(active.data.current.type);
    setActiveDragItemData(active.data.current);
    if (active.data.current.type === 'CARD')
      setSourceColumn(findColumnByCardId(active.id));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragItemId(null); setActiveDragItemType(null);
    setActiveDragItemData(null); setSourceColumn(null);
    if (!active || !over || active.id === over.id) return;

    if (activeDragItemType === 'COLUMN') {
      const oldIdx = orderedColumnIds.indexOf(active.id);
      const newIdx = orderedColumnIds.indexOf(over.id);
      const next   = arrayMove(orderedColumnIds, oldIdx, newIdx);
      const prev   = [...orderedColumnIds];
      setOrderedColumnIds(next);
      try { await updateBoardColumnOrder(boardId, next); showToast('Column order updated!', 'success'); }
      catch (err) { setOrderedColumnIds(prev); showToast(err.message, 'error'); }
    } else if (activeDragItemType === 'CARD') {
      const srcCol  = findColumnByCardId(active.id);
      const destCol = findColumnByCardId(over.id) || findColumnByCardId(over.data.current?.columnId);
      if (!srcCol || !destCol) return;

      if (srcCol._id === destCol._id) {
        const oi = srcCol.cardOrderIds.indexOf(active.id);
        const ni = srcCol.cardOrderIds.indexOf(over.id);
        const next = arrayMove(srcCol.cardOrderIds, oi, ni);
        setColumns((p) => p.map((c) => c._id === srcCol._id ? { ...c, cardOrderIds: next } : c));
        try { await updateColumn(srcCol._id, srcCol.title, next); showToast('Card reordered!', 'success'); }
        catch (err) { setColumns(columns); showToast(err.message, 'error'); }
      } else {
        const srcIds  = srcCol.cardOrderIds.filter((id) => id !== active.id);
        const destIds = [...destCol.cardOrderIds];
        const oi = destCol.cardOrderIds.indexOf(over.id);
        destIds.splice(oi >= 0 ? oi : destIds.length, 0, active.id);
        setColumns((p) => p.map((c) =>
          c._id === srcCol._id  ? { ...c, cardOrderIds: srcIds  } :
          c._id === destCol._id ? { ...c, cardOrderIds: destIds } : c
        ));
        try {
          await Promise.all([
            updateColumn(srcCol._id,  srcCol.title,  srcIds),
            updateColumn(destCol._id, destCol.title, destIds),
          ]);
          showToast('Card moved!', 'success');
        } catch (err) { setColumns(columns); showToast(err.message, 'error'); }
      }
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false); setOpenDeleteDialog(false);
    setOpenCreateCardDialog(false); setSelectedColumn(null);
    loadColumns();
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <CircularProgress size={36} style={{ color: '#3B5BDB' }} />
        </div>
      ) : (
        <SortableContext items={orderedColumnIds} strategy={horizontalListSortingStrategy}>
          <div className="col-list-wrapper">
            {orderedColumnIds.length > 0 ? (
              orderedColumnIds.map((colId) => {
                const col = columns.find((c) => c._id === colId);
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