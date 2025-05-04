import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards } from '../services/cardService';
import { updateColumn } from '../../columns/services/columnService';
import { showToast } from '../../../utils/toastUtils';
import { Box, IconButton, Stack, Typography } from '@mui/material'; // Thay Button bằng IconButton
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Component Card để hiển thị title và các icon hành động
const Card = ({ card, boardId, columnId, token, onEdit, onDelete, onInviteUser }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        mb: 1,
        p: 1.5,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333' : '#fff'),
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#f9f9f9'),
        },
      }}
    >
      {/* Tiêu đề của card */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: '500',
          fontSize: '14px',
          mb: 1,
          color: (theme) => (theme.palette.mode === 'dark' ? '#ddd' : '#172b4d'),
        }}
      >
        {card.title}
      </Typography>

      {/* Các icon hành động (luôn hiện) */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'),
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#555' : '#e0e0e0'),
            },
          }}
        >
          <EditIcon sx={{ fontSize: '16px' }} />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card._id);
          }}
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'),
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#555' : '#e0e0e0'),
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: '16px' }} />
        </IconButton>
        <IconButton
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onInviteUser(card);
          }}
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#f0f0f0'),
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#555' : '#e0e0e0'),
            },
          }}
        >
          <PersonAddIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

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

  const handleInviteUser = (card) => {
    showToast(`Invite user for card ${card._id} (not implemented)`, 'info');
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
                onInviteUser={handleInviteUser}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No cards in this column.</Typography>
          )}
        </Box>
      </SortableContext>
      <DragOverlay dropAnimation={customDropAnimation}>
        {activeCardId && activeCardData ? (
          <Card
            card={activeCardData}
            boardId={boardId}
            columnId={columnId}
            token={token}
            onEdit={() => {}}
            onDelete={() => {}}
            onInviteUser={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CardList;