import React, { useState, useEffect } from 'react';
import { fetchCards } from '../services/cardService';
import { updateColumn } from '../../columns/services/columnService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import Card from './Card';

const CardList = ({ columnId, token, boardId, column, onRefresh }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);
  const navigate = useNavigate();

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const data = await fetchCards(token, columnId);
        // Sắp xếp card theo cardOrderIds từ column
        const sortedCards = column.cardOrderIds
          ? column.cardOrderIds
              .map((cardId) => data.find((card) => card._id === cardId))
              .filter((card) => card) // Lọc bỏ card không tồn tại
          : data;
        setCards(sortedCards);
      } catch (err) {
        showToast(err.response?.data.message || 'Không thể tải danh sách card', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [columnId, token, column.cardOrderIds]);

  const handleEdit = (card) => {
    navigate(`/cards/${card._id}/edit`, {
      state: {
        title: card.title,
        description: card.description,
        boardId,
        columnId,
      },
    });
  };

  const handleDelete = (cardId) => {
    navigate(`/cards/${cardId}/delete`, { state: { boardId } });
  };

  const handleDragStart = (event) => {
    setActiveCardId(event?.active?.id);
    setActiveCardData(event?.active?.data?.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCardId(null);
    setActiveCardData(null);

    if (!active || !over || active.id === over.id) return;

    const oldIndex = cards.findIndex((card) => card._id === active.id);
    const newIndex = cards.findIndex((card) => card._id === over.id);

    const newCards = arrayMove(cards, oldIndex, newIndex);
    const newCardOrderIds = newCards.map((card) => card._id);

    setCards(newCards);

    try {
      await updateColumn(token, columnId, column.title, newCardOrderIds);
      showToast('Cập nhật thứ tự card thành công!', 'success');
      onRefresh();
    } catch (err) {
      setCards(cards); // Khôi phục nếu lỗi
      showToast(err.response?.data.message || 'Không thể cập nhật thứ tự card', 'error');
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
      <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ mb: 2 }}>
          {loading && <Typography variant="body2" color="textSecondary">Đang tải card...</Typography>}
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                boardId={boardId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">Không có card trong cột này.</Typography>
          )}
        </Box>
      </SortableContext>
      <DragOverlay dropAnimation={customDropAnimation}>
        {activeCardId && activeCardData ? (
          <Card card={activeCardData} boardId={boardId} onEdit={() => {}} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CardList;