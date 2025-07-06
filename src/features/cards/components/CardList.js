import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards, updateCard } from '../services/cardService'; // Thêm updateCard
import { updateColumn } from '../../columns/services/columnService';
import { showToast } from '../../../utils/toastUtils';
import { Box, IconButton, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
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
import LinearScaleIcon from '@mui/icons-material/LinearScale'; // Icon cho chỉnh sửa process

// Hàm tính màu sắc dựa trên process (0: đỏ, 100: xanh lá)
const getCardBackgroundColor = (process) => {
  const colors = {
    0: { r: 255, g: 0, b: 0 }, // Đỏ
    25: { r: 255, g: 128, b: 0 }, // Cam
    50: { r: 255, g: 255, b: 0 }, // Vàng
    75: { r: 128, g: 255, b: 0 }, // Xanh lá nhạt
    100: { r: 0, g: 255, b: 0 }, // Xanh lá
  };

  const processValues = Object.keys(colors).map(Number).sort((a, b) => a - b);
  let lower = processValues.find((val) => val <= process) || 0;
  let upper = processValues.find((val) => val > process) || 100;

  if (process <= lower) return `rgb(${colors[lower].r}, ${colors[lower].g}, ${colors[lower].b})`;
  if (process >= upper) return `rgb(${colors[upper].r}, ${colors[upper].g}, ${colors[upper].b})`;

  const ratio = (process - lower) / (upper - lower);
  const r = Math.round(colors[lower].r + (colors[upper].r - colors[lower].r) * ratio);
  const g = Math.round(colors[lower].g + (colors[upper].g - colors[lower].g) * ratio);
  const b = Math.round(colors[lower].b + (colors[upper].b - colors[lower].b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
};

// Component Card để hiển thị title và các icon hành động
const Card = ({ card, boardId, columnId, token, onEdit, onDelete, onInviteUser, onRefresh }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [processValue, setProcessValue] = useState(card.process);
  const [processError, setProcessError] = useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleOpenProcessDialog = (e) => {
    e.stopPropagation();
    setProcessValue(card.process);
    setProcessError('');
    setOpenProcessDialog(true);
  };

  const handleCloseProcessDialog = () => {
    setOpenProcessDialog(false);
    setProcessError('');
  };

  const handleUpdateProcess = async () => {
    const processNum = Number(processValue);
    if (isNaN(processNum) || processNum < 0 || processNum > 100) {
      setProcessError('Mức độ hoàn thành phải là số từ 0 đến 100');
      return;
    }

    try {
      await updateCard(card._id, { process: processNum }, token);
      showToast('Cập nhật mức độ hoàn thành thành công!', 'success');
      handleCloseProcessDialog();
      onRefresh(); // Làm mới danh sách thẻ
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật mức độ hoàn thành', 'error');
    }
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 1,
          p: 0.5,
          bgcolor: getCardBackgroundColor(card.process),
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
            filter: 'brightness(95%)',
          },
        }}
      >
        {/* Tiêu đề của card, căn giữa chiều ngang */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            color: '#172B4D',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexGrow: 1,
            padding: '2px 0',
          }}
        >
          {card.title}
        </Typography>

        {/* Các icon hành động, chỉ hiển thị khi hover, căn giữa chiều ngang */}
        <Stack
          direction="row"
          spacing={0.2}
          sx={{
            justifyContent: 'center',
            opacity: 0,
            '&:hover': {
              opacity: 1,
            },
            mt: 0.25,
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
              padding: '2px',
            }}
          >
            <EditIcon sx={{ fontSize: '12px' }} />
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
            onClick={handleOpenProcessDialog}
            sx={{
              bgcolor: '#F0F0F0',
              '&:hover': { bgcolor: '#E0E0E0' },
              padding: '2px',
            }}
          >
            <LinearScaleIcon sx={{ fontSize: '12px' }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Dialog để chỉnh sửa process */}
      <Dialog open={openProcessDialog} onClose={handleCloseProcessDialog}>
        <DialogTitle>Chỉnh sửa mức độ hoàn thành</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mức độ hoàn thành (%)"
            type="number"
            fullWidth
            value={processValue}
            onChange={(e) => {
              setProcessValue(e.target.value);
              setProcessError('');
            }}
            error={!!processError}
            helperText={processError}
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessDialog}>Hủy</Button>
          <Button onClick={handleUpdateProcess} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
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