// src/features/columns/components/ColumnList.js
import React, { useState, useEffect } from 'react';
import { fetchColumns, updateBoardColumnOrder, updateColumn } from '../services/columnService';
import { fetchBoard } from '../../boards/services/boardService';
import { toast } from 'react-toastify';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const ColumnList = ({ boardId, token }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [orderedColumnIds, setOrderedColumnIds] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [sourceColumn, setSourceColumn] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const data = await fetchColumns(token, boardId);
      const board = await fetchBoard(token, boardId);
      setColumns(data);
      setOrderedColumnIds(board.columnOrderIds || data.map((c) => c._id));
    } catch (err) {
      toast.error(err.response?.data.message || 'Không thể tải danh sách cột');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, token]);

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
        await updateBoardColumnOrder(token, boardId, newOrderedColumnIds);
        toast.success('Cập nhật thứ tự cột thành công!');
      } catch (err) {
        setOrderedColumnIds(prevOrderedColumnIds);
        toast.error(err.response?.data.message || 'Không thể cập nhật thứ tự cột');
      }
    } else if (activeDragItemType === 'CARD') {
      const sourceCol = findColumnByCardId(active.id);
      const destCol = findColumnByCardId(over.id) || findColumnByCardId(over.data.current?.columnId);

      if (!sourceCol || !destCol) return;

      if (sourceCol._id === destCol._id) {
        // Sắp xếp lại trong cùng cột
        const oldIndex = sourceCol.cardOrderIds.findIndex((id) => id === active.id);
        const newIndex = sourceCol.cardOrderIds.findIndex((id) => id === over.id);
        const newCardOrderIds = arrayMove(sourceCol.cardOrderIds, oldIndex, newIndex);

        setColumns((prev) =>
          prev.map((col) =>
            col._id === sourceCol._id ? { ...col, cardOrderIds: newCardOrderIds } : col
          )
        );

        try {
          await updateColumn(token, sourceCol._id, sourceCol.title, newCardOrderIds);
          toast.success('Cập nhật thứ tự card thành công!');
        } catch (err) {
          setColumns(columns); // Khôi phục
          toast.error(err.response?.data.message || 'Không thể cập nhật thứ tự card');
        }
      } else {
        // Di chuyển giữa các cột
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
            updateColumn(token, sourceCol._id, sourceCol.title, sourceCardOrderIds),
            updateColumn(token, destCol._id, destCol.title, destCardOrderIds),
          ]);
          toast.success('Di chuyển card thành công!');
        } catch (err) {
          setColumns(columns); // Khôi phục
          toast.error(err.response?.data.message || 'Không thể cập nhật thứ tự card');
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
                    <Typography>Không tìm thấy cột nào.</Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/boards/${boardId}/columns/create`)}
                    >
                      Tạo cột mới
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