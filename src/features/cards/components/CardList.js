import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards } from '../services/cardService';
import { updateColumn } from '../../columns/services/columnService';
import { showToast } from '../../../utils/toastUtils';
import { Box, IconButton, Stack, Typography } from '@mui/material';
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
    opacity: isDragging ? 0.4 : 1, // Giảm opacity để giống Trello
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        mb: 1, // Tăng từ 0.5 (4px) lên 1 (8px) để có khoảng cách lớn hơn
        p: 0.5,
        bgcolor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 1px 0 rgba(9, 30, 66, 0.25)',
        cursor: 'grab',
        position: 'relative',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '40px',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(9, 30, 66, 0.2)',
          bgcolor: '#F4F5F7',
        },
      }}
    >
      {/* Tiêu đề của card, căn giữa chiều ngang */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600, // Đậm hơn, giống Trello
          fontSize: '14px',
          color: '#172B4D', // Màu chữ đậm của Trello
          textAlign: 'center', // Căn giữa chiều ngang
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', // Giới hạn tiêu đề trong 1 dòng
          flexGrow: 1, // Chiếm phần lớn không gian
          padding: '2px 0', // Thêm padding nhỏ để căn giữa dọc
        }}
      >
        {card.title}
      </Typography>

      {/* Các icon hành động, chỉ hiển thị khi hover, căn giữa chiều ngang */}
      <Stack
        direction="row"
        spacing={0.2} // Giảm khoảng cách giữa icon còn 1.6px
        sx={{
          justifyContent: 'center', // Căn giữa chiều ngang
          opacity: 0, // Ẩn mặc định
          '&:hover': {
            opacity: 1, // Hiển thị khi hover
          },
          mt: 0.25, // Khoảng cách từ tiêu đề còn 2px
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
            bgcolor: '#F0F0F0',
            '&:hover': { bgcolor: '#E0E0E0' },
            padding: '2px', // Giảm padding của icon
          }}
        >
          <EditIcon sx={{ fontSize: '12px' }} /> {/* Giảm kích thước icon xuống 12px */}
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card._id);
          }}
          sx={{
            bgcolor: '#F0F0F0',
            '&:hover': { bgcolor: '#E0E0E0' },
            padding: '2px',
          }}
        >
          <DeleteIcon sx={{ fontSize: '12px' }} />
        </IconButton>
        <IconButton
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onInviteUser(card);
          }}
          sx={{
            bgcolor: '#F0F0F0',
            '&:hover': { bgcolor: '#E0E0E0' },
            padding: '2px',
          }}
        >
          <PersonAddIcon sx={{ fontSize: '12px' }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

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
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);
  const navigate = useNavigate();

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

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
      showToast('Cập nhật thứ tự thẻ thành công!', 'success');
      onRefresh();
    } catch (err) {
      setCards(cards);
      showToast(err.message || 'Không thể cập nhật thứ tự thẻ', 'error');
    }
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }), // Giảm opacity giống Trello
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
          px: 1, // Giữ padding trái/phải 8px để thẻ có lề
          mt: 0, // Đảm bảo không có khoảng cách trên cùng
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
        />
      ) : null}
    </DragOverlay>
  </DndContext>
);
};

export default CardList;