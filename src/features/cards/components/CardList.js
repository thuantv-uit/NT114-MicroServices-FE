/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import { showToast } from '../../../utils/toastUtils';
import { updateColumn } from '../../columns/services/columnService';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Slider,
  FormHelperText,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import ImageIcon from '@mui/icons-material/Image';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { updateProcess, updateCardImage } from '../services/cardService';
import { getUserById } from '../../users/services/userService';
import { useNavigate } from 'react-router-dom';

// Hàm tính màu sắc dựa trên process
const getCardBackgroundColor = (process) => {
  const colors = {
    0: { r: 255, g: 0, b: 0 },
    25: { r: 255, g: 128, b: 0 },
    50: { r: 255, g: 255, b: 0 },
    75: { r: 128, g: 255, b: 0 },
    100: { r: 0, g: 255, b: 0 },
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

// Hàm xử lý Drag and Drop (giữ nguyên logic gốc)
const useDragAndDrop = (cards, setCards, columnId, columnTitle, onRefresh) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

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
      await updateColumn(columnId, columnTitle, newCardOrderIds);
      showToast('Cập nhật thứ tự thẻ thành công!', 'success');
      onRefresh();
    } catch (err) {
      setCards(cards);
      showToast(err.message || 'Không thể cập nhật thứ tự thẻ', 'error');
    }
  };

  return {
    sensors,
    activeCardId,
    activeCardData,
    handleDragStart,
    handleDragEnd,
  };
};

// Hàm format ngày tháng
const formatDate = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

// Component Card
const Card = ({ card, boardId, columnId, token, onEdit, onDelete, onInviteUser, onRefresh }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });
  const navigate = useNavigate();

  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [processValue, setProcessValue] = useState(card.process);
  const [processError, setProcessError] = useState('');
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Lấy thông tin user tạo card
  useEffect(() => {
    const fetchUser = async () => {
      if (card.userId) {
        try {
          const userData = await getUserById(card.userId);
          setUser(userData);
        } catch (err) {
          showToast(err.message || 'Không thể tải thông tin user', 'error');
        }
      }
    };
    fetchUser();
  }, [card.userId]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Xử lý click vào tiêu đề để chuyển hướng đến trang chỉnh sửa
  const handleTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/cards/${card._id}/edit`, {
      state: {
        title: card.title,
        description: card.description,
        boardId,
        columnId,
      },
    });
  };

  const handleOpenProcessDialog = (e) => {
    e.stopPropagation();
    setProcessValue(card.process);
    setProcessError('');
    setOpenProcessDialog(true);
    setAnchorEl(null);
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
      await updateProcess(card._id, { process: processNum }, token);
      showToast('Cập nhật mức độ hoàn thành thành công!', 'success');
      handleCloseProcessDialog();
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật mức độ hoàn thành', 'error');
    }
  };

  const handleOpenImageDialog = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setOpenImageDialog(true);
    setAnchorEl(null);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpdateImage = async () => {
    if (!imageFile) {
      showToast('Vui lòng chọn một file ảnh', 'error');
      return;
    }

    try {
      const response = await updateCardImage(card._id, imageFile);
      showToast('Cập nhật ảnh thẻ thành công!', 'success');
      handleCloseImageDialog();
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật ảnh thẻ', 'error');
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(card._id);
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 0.5,
          p: 0,
          bgcolor: getCardBackgroundColor(card.process),
          borderRadius: '4px',
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
        {/* Phần hình ảnh phía trên */}
        {card.image && (
          <Box
            sx={{
              width: '100%',
              height: '120px',
              borderRadius: '4px 4px 0 0',
              overflow: 'hidden',
            }}
          >
            <Avatar
              src={card.image}
              alt={card.title}
              variant="square"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        {/* Phần nội dung phía dưới */}
        <Box sx={{ flexGrow: 1, p: 1.5 }}>
          {/* Title và IconButton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography
              variant="h6"
              onClick={handleTitleClick}
              sx={{
                fontSize: '16px',
                color: '#172B4D',
                textAlign: 'left',
                overflow: 'hidden',
                whiteSpace: 'normal',
                flexGrow: 1,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {card.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                bgcolor: '#F0F0F0',
                '&:hover': { bgcolor: '#E0E0E0' },
                padding: '4px',
              }}
            >
              <MoreHorizIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
          {/* Ngày với icon, bọc trong khung */}
          <Box
            sx={{
              display: 'inline-flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              mb: 1,
              border: '1px solid #000000',
              borderRadius: '4px',
              padding: '2px 4px',
            }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: '14px', color: '#5E6C84' }} />
              <Typography
                variant="body2"
                sx={{
                  color: '#5E6C84',
                  textAlign: 'left',
                }}
              >
                {formatDate(card.updatedAt)}
              </Typography>
            </Stack>
          </Box>
        </Box>
        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Xóa
          </MenuItem>
          <MenuItem onClick={handleOpenProcessDialog}>
            <ListItemIcon>
              <LinearScaleIcon fontSize="small" />
            </ListItemIcon>
            Cập nhật tiến độ
          </MenuItem>
          <MenuItem onClick={handleOpenImageDialog}>
            <ListItemIcon>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            Cập nhật ảnh
          </MenuItem>
        </Menu>
      </Box>

      {/* Dialog để chỉnh sửa process */}
      <Dialog open={openProcessDialog} onClose={handleCloseProcessDialog}>
        <DialogTitle>Chỉnh sửa mức độ hoàn thành</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography gutterBottom>Mức độ hoàn thành (%): {processValue}</Typography>
            <Slider
              value={Number(processValue)}
              onChange={(e, newValue) => {
                setProcessValue(newValue);
                setProcessError('');
              }}
              aria-label="Mức độ hoàn thành"
              valueLabelDisplay="auto"
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              min={0}
              max={100}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                },
              }}
            />
            {processError && (
              <FormHelperText error sx={{ mt: 1 }}>
                {processError}
              </FormHelperText>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessDialog}>Hủy</Button>
          <Button onClick={handleUpdateProcess} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog để cập nhật ảnh */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
        <DialogTitle>Cập nhật ảnh thẻ</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ px: 2, py: 1 }}>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ mb: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog}>Hủy</Button>
          <Button onClick={handleUpdateImage} color="primary" disabled={!imageFile}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { Card, useDragAndDrop, getCardBackgroundColor };