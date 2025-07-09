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

const ColumnList = ({ boardId, token, ColumnContainer, CardContainer }) => {
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
        showToast('Cập nhật thứ tự cột thành công!', 'success');
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
          showToast('Cập nhật thứ tự thẻ thành công!', 'success');
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
          showToast('Di chuyển thẻ thành công!', 'success');
        } catch (err) {
          setColumns(columns);
          showToast(err.message, 'error');
        }
      }
    }
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  // Định nghĩa ColumnContainer mặc định với kiểu dáng Trello
  const DefaultColumnContainer = ({ children, ...props }) => (
    <Box
      sx={{
        bgcolor: '#EBECF0', // Nền xám nhạt giống Trello
        borderRadius: '8px',
        p: 1, // Padding 8px cho tất cả cạnh
        minWidth: '272px', // Chiều rộng tối thiểu giống Trello
        maxWidth: '272px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
      }}
      {...props}
    >
      {children}
    </Box>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ my: 1, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SortableContext items={orderedColumnIds} strategy={horizontalListSortingStrategy}>
            <Box
              sx={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                pb: 1,
                width: '100%',
              }}
            >
              <Box sx={{ display: 'inline-flex', gap: 1.5 }}>
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
                        ColumnContainer={ColumnContainer || DefaultColumnContainer} // Sử dụng mặc định nếu không truyền
                        CardContainer={CardContainer}
                      />
                    ) : null;
                  })
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2, px: 2 }}>
                    <Typography sx={{ color: '#5E6C84', mb: 1 }}>
                      Không tìm thấy cột nào.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/boards/${boardId}/columns/create`)}
                      sx={{
                        bgcolor: '#0079BF',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 2,
                        '&:hover': { bgcolor: '#026AA7' },
                      }}
                    >
                      Thêm cột mới
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
              ColumnContainer={ColumnContainer || DefaultColumnContainer}
              CardContainer={CardContainer}
            />
          ) : activeDragItemType === 'CARD' && activeDragItemData ? (
            <Card
              card={activeDragItemData}
              boardId={boardId}
              onEdit={() => {}}
              onDelete={() => {}}
              CardContainer={CardContainer}
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default ColumnList;