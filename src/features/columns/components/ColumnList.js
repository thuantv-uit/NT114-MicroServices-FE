import React, { useState, useEffect } from 'react';
import { fetchColumns, updateBoardColumnOrder } from '../services/columnService';
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

const ColumnList = ({ boardId, token }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [orderedColumnIds, setOrderedColumnIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const data = await fetchColumns(token, boardId);
      const board = await fetchBoard(token, boardId);
      setColumns(data);
      setOrderedColumnIds(board.columnOrderIds || data.map(c => c._id));
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, token]);

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemData(event?.active?.data?.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) {
      setActiveDragItemId(null);
      setActiveDragItemData(null);
      return;
    }

    const oldIndex = orderedColumnIds.findIndex(id => id === active.id);
    const newIndex = orderedColumnIds.findIndex(id => id === over.id);
    const newOrderedColumnIds = arrayMove(orderedColumnIds, oldIndex, newIndex);

    const prevOrderedColumnIds = [...orderedColumnIds]; // Lưu trạng thái trước
    setOrderedColumnIds(newOrderedColumnIds);

    try {
      await updateBoardColumnOrder(token, boardId, newOrderedColumnIds);
      toast.success('Column order updated successfully!');
    } catch (err) {
      setOrderedColumnIds(prevOrderedColumnIds); // Rollback nếu lỗi
      toast.error(err.response?.data.message || 'Failed to update column order');
    } finally {
      setActiveDragItemId(null);
      setActiveDragItemData(null);
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
                    const column = columns.find(c => c._id === columnId);
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
                      Create Column
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </SortableContext>
        )}
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemId && activeDragItemData ? (
            <Column
              column={activeDragItemData}
              boardId={boardId}
              token={token}
              onRefresh={loadColumns}
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default ColumnList;
// import { fetchColumns, updateBoardColumnOrder, updateColumn } from '../services/columnService';
// import { fetchBoard } from '../../boards/services/boardService';
// import { toast } from 'react-toastify';
// import { Box, Typography, CircularProgress } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Column from './Column';
// import {
//   DndContext,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   defaultDropAnimationSideEffects,
//   closestCorners,
//   pointerWithin,
//   getFirstCollision,
// } from '@dnd-kit/core';
// import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
// import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
// import { arrayMove } from '@dnd-kit/sortable';
// import Card from '../../cards/components/Card';

// const ACTIVE_DRAG_ITEM_TYPE = {
//   COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
//   CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
// };

// const ColumnList = ({ boardId, token }) => {
//   const navigate = useNavigate();
//   const [columns, setColumns] = useState([]);
//   const [orderedColumnIds, setOrderedColumnIds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeDragItemId, setActiveDragItemId] = useState(null);
//   const [activeDragItemType, setActiveDragItemType] = useState(null);
//   const [activeDragItemData, setActiveDragItemData] = useState(null);
//   const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);

//   const lastOverId = useRef(null);

//   const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
//   const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
//   const sensors = useSensors(mouseSensor, touchSensor);

//   const loadColumns = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchColumns(token, boardId);
//       const board = await fetchBoard(token, boardId);
//       setColumns(data);
//       setOrderedColumnIds(board.columnOrderIds || data.map(c => c._id));
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//         navigate('/login');
//       } else {
//         toast.error(err.response?.data.message || 'Failed to fetch columns');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadColumns();
//   }, [boardId, token, navigate]);

//   const findColumnByCardId = (cardId) => {
//     return columns.find(column => column?.cardOrderIds?.includes(cardId));
//   };

//   const moveCardBetweenDifferentColumns = (
//     overColumn,
//     overCardId,
//     active,
//     over,
//     activeColumn,
//     activeDraggingCardId,
//     triggerFrom
//   ) => {
//     setColumns(prevColumns => {
//       const overCardIndex = overColumn?.cardOrderIds?.findIndex(id => id === overCardId);
//       const isBelowOverItem =
//         active.rect.current.translated &&
//         active.rect.current.translated.top > over.rect.top + over.rect.height;
//       const modifier = isBelowOverItem ? 1 : 0;
//       const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cardOrderIds?.length;

//       const nextColumns = [...prevColumns];
//       const nextActiveColumn = nextColumns.find(col => col._id === activeColumn._id);
//       const nextOverColumn = nextColumns.find(col => col._id === overColumn._id);

//       if (nextActiveColumn) {
//         nextActiveColumn.cardOrderIds = nextActiveColumn.cardOrderIds.filter(id => id !== activeDraggingCardId);
//         if (nextActiveColumn.cardOrderIds.length === 0) {
//           nextActiveColumn.cardOrderIds = [];
//         }
//       }

//       if (nextOverColumn) {
//         nextOverColumn.cardOrderIds = nextOverColumn.cardOrderIds.filter(id => id !== activeDraggingCardId);
//         nextOverColumn.cardOrderIds.splice(newCardIndex, 0, activeDraggingCardId);
//       }

//       if (triggerFrom === 'handleDragEnd') {
//         Promise.all([
//           updateColumn(token, nextActiveColumn._id, nextActiveColumn.title, nextActiveColumn.cardOrderIds),
//           updateColumn(token, nextOverColumn._id, nextOverColumn.title, nextOverColumn.cardOrderIds),
//         ]).catch(err => {
//           toast.error(err.response?.data.message || 'Failed to update card order');
//           loadColumns();
//         });
//       }

//       return nextColumns;
//     });
//   };

//   const handleDragStart = (event) => {
//     setActiveDragItemId(event?.active?.id);
//     setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
//     setActiveDragItemData(event?.active?.data?.current);

//     if (event?.active?.data?.current?.columnId) {
//       setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
//     }
//   };

//   const handleDragOver = (event) => {
//     if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

//     const { active, over } = event;
//     if (!active || !over) return;

//     const { id: activeDraggingCardId } = active;
//     const { id: overCardId } = over;

//     const activeColumn = findColumnByCardId(activeDraggingCardId);
//     const overColumn = findColumnByCardId(overCardId);

//     if (!activeColumn || !overColumn) return;

//     if (activeColumn._id !== overColumn._id) {
//       moveCardBetweenDifferentColumns(
//         overColumn,
//         overCardId,
//         active,
//         over,
//         activeColumn,
//         activeDraggingCardId,
//         'handleDragOver'
//       );
//     }
//   };

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!active || !over) return;

//     if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
//       const { id: activeDraggingCardId } = active;
//       const { id: overCardId } = over;

//       const activeColumn = findColumnByCardId(activeDraggingCardId);
//       const overColumn = findColumnByCardId(overCardId);

//       if (!activeColumn || !overColumn) return;

//       if (oldColumnWhenDraggingCard._id !== overColumn._id) {
//         moveCardBetweenDifferentColumns(
//           overColumn,
//           overCardId,
//           active,
//           over,
//           activeColumn,
//           activeDraggingCardId,
//           'handleDragEnd'
//         );
//       } else {
//         const oldCardIndex = activeColumn.cardOrderIds.findIndex(id => id === activeDraggingCardId);
//         const newCardIndex = overColumn.cardOrderIds.findIndex(id => id === overCardId);
//         const dndOrderedCardIds = arrayMove(activeColumn.cardOrderIds, oldCardIndex, newCardIndex);

//         setColumns(prevColumns => {
//           const nextColumns = [...prevColumns];
//           const targetColumn = nextColumns.find(col => col._id === overColumn._id);
//           targetColumn.cardOrderIds = dndOrderedCardIds;
//           return nextColumns;
//         });

//         try {
//           await updateColumn(token, overColumn._id, overColumn.title, dndOrderedCardIds);
//         } catch (err) {
//           toast.error(err.response?.data.message || 'Failed to update card order');
//           loadColumns();
//         }
//       }
//     }

//     if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
//       if (active.id !== over.id) {
//         const oldIndex = orderedColumnIds.findIndex(id => id === active.id);
//         const newIndex = orderedColumnIds.findIndex(id => id === over.id);
//         const newOrderedColumnIds = arrayMove(orderedColumnIds, oldIndex, newIndex);

//         setOrderedColumnIds(newOrderedColumnIds);
//         try {
//           await updateBoardColumnOrder(token, boardId, newOrderedColumnIds);
//         } catch (err) {
//           toast.error(err.response?.data.message || 'Failed to update column order');
//           loadColumns();
//         }
//       }
//     }

//     setActiveDragItemId(null);
//     setActiveDragItemType(null);
//     setActiveDragItemData(null);
//     setOldColumnWhenDraggingCard(null);
//   };

//   const customDropAnimation = {
//     sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
//   };

//   const collisionDetectionStrategy = useCallback((args) => {
//     if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
//       return closestCorners({ ...args });
//     }

//     const pointerIntersections = pointerWithin(args);
//     if (!pointerIntersections?.length) return;

//     let overId = getFirstCollision(pointerIntersections, 'id');
//     if (overId) {
//       const checkColumn = columns.find(column => column._id === overId);
//       if (checkColumn) {
//         overId = closestCorners({
//           ...args,
//           droppableContainers: args.droppableContainers.filter(container => {
//             return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id);
//           }),
//         })[0]?.id;
//       }

//       lastOverId.current = overId;
//       return [{ id: overId }];
//     }

//     return lastOverId.current ? [{ id: lastOverId.current }] : [];
//   }, [activeDragItemType, columns]);

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={collisionDetectionStrategy}
//       onDragStart={handleDragStart}
//       onDragOver={handleDragOver}
//       onDragEnd={handleDragEnd}
//     >
//       <Box sx={{ my: 4 }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <SortableContext items={orderedColumnIds} strategy={horizontalListSortingStrategy}>
//             <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2, width: '100%', mx: 'auto' }}>
//               <Box sx={{ display: 'inline-flex', gap: 2 }}>
//                 {orderedColumnIds.length > 0 ? (
//                   orderedColumnIds.map((columnId) => {
//                     const column = columns.find(c => c._id === columnId);
//                     return column ? (
//                       <Column
//                         key={column._id}
//                         column={column}
//                         boardId={boardId}
//                         token={token}
//                         onRefresh={loadColumns}
//                       />
//                     ) : null;
//                   })
//                 ) : (
//                   <Typography>No columns found.</Typography>
//                 )}
//               </Box>
//             </Box>
//           </SortableContext>
//         )}
//         <DragOverlay dropAnimation={customDropAnimation}>
//           {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && activeDragItemData ? (
//             <Column column={activeDragItemData} boardId={boardId} token={token} onRefresh={loadColumns} />
//           ) : activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && activeDragItemData ? (
//             <Card card={activeDragItemData} />
//           ) : null}
//         </DragOverlay>
//       </Box>
//     </DndContext>
//   );
// };

// export default ColumnList;