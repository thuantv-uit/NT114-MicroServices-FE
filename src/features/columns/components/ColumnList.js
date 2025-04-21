/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchColumns, updateBoardColumnOrder, updateColumn } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import Column from './Column';
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import Card from '../../cards/components/Card';

/**
 * Component to list columns in a board
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const ColumnList = ({ boardId, token }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [orderedColumnIds, setOrderedColumnIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const [data, board] = await Promise.all([
        fetchColumns(boardId),
        fetchBoard(boardId),
      ]);
      setColumns(data);
      setOrderedColumnIds(board.columnOrderIds || data.map((c) => c._id));
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  }, [boardId]);

  const findColumnByCardId = (cardId) => {
    return columns.find((column) => column?.cardOrderIds?.includes(cardId));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragItemId(active.id);
    setActiveDragItemType(active.data.current.type);
    setActiveDragItemData(active.data.current);
    if (active.data.current.type === 'CARD') {
      setSourceColumn(findColumnByCardId(active.id));
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setSourceColumn(null);

    if (!active || !over || active.id === over.id) return;

    if (activeDragItemType === 'COLUMN') {
      const oldIndex = orderedColumnIds.findIndex((id) => id === active.id);
      const newIndex = orderedColumnIds.findIndex((id) => id === over.id);
      const newOrderedColumnIds = arrayMove(orderedColumnIds, oldIndex, newIndex);

      const prevOrderedColumnIds = [...orderedColumnIds];
      setOrderedColumnIds(newOrderedColumnIds);

      try {
        await updateBoardColumnOrder(boardId, newOrderedColumnIds);
        showToast('Column order updated successfully!', 'success');
      } catch (err) {
        setOrderedColumnIds(prevOrderedColumnIds);
        showToast(err.message, 'error');
      }
    } else if (activeDragItemType === 'CARD') {
      const sourceCol = findColumnByCardId(active.id);
      const destCol = findColumnByCardId(over.id) || findColumnByCardId(over.data.current?.columnId);

      if (!sourceCol || !destCol) return;

      if (sourceCol._id === destCol._id) {
        const oldIndex = sourceCol.cardOrderIds.findIndex((id) => id === active.id);
        const newIndex = sourceCol.cardOrderIds.findIndex((id) => id === over.id);
        const newCardOrderIds = arrayMove(sourceCol.cardOrderIds, oldIndex, newIndex);

        setColumns((prev) =>
          prev.map((col) =>
            col._id === sourceCol._id ? { ...col, cardOrderIds: newCardOrderIds } : col
          )
        );

        try {
          await updateColumn(sourceCol._id, sourceCol.title, newCardOrderIds);
          showToast('Card order updated successfully!', 'success');
        } catch (err) {
          setColumns(columns);
          showToast(err.message, 'error');
        }
      } else {
        const sourceCardOrderIds = sourceCol.cardOrderIds.filter((id) => id !== active.id);
        const destCardOrderIds = [...destCol.cardOrderIds];
        const overIndex = destCol.cardOrderIds.findIndex((id) => id === over.id);
        const insertIndex = overIndex >= 0 ? overIndex : destCol.cardOrderIds.length;
        destCardOrderIds.splice(insertIndex, 0, active.id);

        setColumns((prev) =>
          prev.map((col) =>
            col._id === sourceCol._id
              ? { ...col, cardOrderIds: sourceCardOrderIds }
              : col._id === destCol._id
              ? { ...col, cardOrderIds: destCardOrderIds }
              : col
          )
        );

        try {
          await Promise.all([
            updateColumn(sourceCol._id, sourceCol.title, sourceCardOrderIds),
            updateColumn(destCol._id, destCol.title, destCardOrderIds),
          ]);
          showToast('Card moved successfully!', 'success');
        } catch (err) {
          setColumns(columns);
          showToast(err.message, 'error');
        }
      }
    }
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ my: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <SortableContext items={orderedColumnIds} strategy={horizontalListSortingStrategy}>
            <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2, width: '100%', mx: 'auto' }}>
              <Box sx={{ display: 'inline-flex', gap: 2 }}>
                {orderedColumnIds.length > 0 ? (
                  orderedColumnIds.map((columnId) => {
                    const column = columns.find((c) => c._id === columnId);
                    return column ? (
                      <Column
                        key={column._id}
                        column={column}
                        boardId={boardId}
                        token={token}
                        onRefresh={loadColumns}
                      />
                    ) : null;
                  })
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>No columns found.</Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/boards/${boardId}/columns/create`)}
                    >
                      Create New Column
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </SortableContext>
        )}
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemType === 'COLUMN' && activeDragItemData ? (
            <Column
              column={activeDragItemData}
              boardId={boardId}
              token={token}
              onRefresh={loadColumns}
            />
          ) : activeDragItemType === 'CARD' && activeDragItemData ? (
            <Card
              card={activeDragItemData}
              boardId={boardId}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default ColumnList;