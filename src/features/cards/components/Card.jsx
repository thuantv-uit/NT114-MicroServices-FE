import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Typography } from '@mui/material';
import {
  DndContext,
  closestCorners,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, useDragAndDrop } from './CardList'; // Import from Card.js

/**
 * Thành phần hiển thị danh sách thẻ trong cột
 * @param {Object} props
 * @param {string} props.columnId - ID của cột
 * @param {string} props.token - Mã xác thực
 * @param {string} props.boardId - ID của bảng
 * @param {Object} props.column - Dữ liệu cột
 * @param {Function} props.onRefresh - Hàm làm mới cột
 * @returns {JSX.Element}
 */
const CardList = ({ columnId, token, boardId, column, onRefresh }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sử dụng hàm Drag and Drop
  const { sensors, activeCardId, activeCardData, handleDragStart, handleDragEnd } = useDragAndDrop(
    cards,
    setCards,
    columnId,
    column.title,
    onRefresh
  );

  useEffect(() => {
    const loadCards = async () => {
      if (!token) {
        showToast('Thiếu mã xác thực', 'error');
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
        showToast(err.message || 'Không thể tải thẻ', 'error');
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
    showToast(`Mời người dùng cho thẻ ${card._id} (chưa triển khai)`, 'info');
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
        <Box
          sx={{
            mb: 0,
            px: 1,
            mt: 0,
          }}
        >
          {loading && (
            <Typography variant="body2" sx={{ color: '#5E6C84', textAlign: 'center' }}>
              Đang tải thẻ...
            </Typography>
          )}
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
                onRefresh={onRefresh}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#5E6C84', textAlign: 'center' }}>
              Không có thẻ trong cột này.
            </Typography>
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
            onRefresh={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CardList;