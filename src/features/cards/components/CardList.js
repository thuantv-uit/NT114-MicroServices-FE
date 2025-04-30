import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards } from '../services/cardService';
import { updateColumn } from '../../columns/services/columnService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Typography } from '@mui/material';
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

/**
 * Component to list cards in a column
 * @param {Object} props
 * @param {string} props.columnId - Column ID
 * @param {string} props.token - Authentication token
 * @param {string} props.boardId - Board ID
 * @param {Object} props.column - Column data
 * @param {Function} props.onRefresh - Refresh callback
 * @returns {JSX.Element}
 */
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
      if (!token) {
        showToast('Authentication token is missing', 'error');
        return;
      }
      setLoading(true);
      try {
        const data = await fetchCards(columnId);
        const sortedCards = column.cardOrderIds
          ? column.cardOrderIds
              .map((cardId) => data.find((card) => card._id === cardId))
              .filter((card) => card)
          : data;
        setCards(sortedCards);
      } catch (err) {
        showToast(err.message || 'Failed to load cards', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [columnId, column.cardOrderIds, token]);

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
      await updateColumn(columnId, column.title, newCardOrderIds);
      showToast('Card order updated successfully!', 'success');
      onRefresh();
    } catch (err) {
      setCards(cards);
      showToast(err.message || 'Failed to update card order', 'error');
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
          {loading && <Typography variant="body2" color="textSecondary">Loading cards...</Typography>}
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                boardId={boardId}
                columnId={columnId}
                token={token}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={onRefresh}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No cards in this column.</Typography>
          )}
        </Box>
      </SortableContext>
      <DragOverlay dropAnimation={customDropAnimation}>
        {activeCardId && activeCardData ? (
          <Card card={activeCardData} boardId={boardId} columnId={columnId} token={token} onEdit={() => {}} onDelete={() => {}} onRefresh={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CardList;