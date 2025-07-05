import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import ColumnList from '../../columns/components/ColumnList';
import InviteToBoard from '../../invitations/components/InviteToBoard';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';

// Thành phần định kiểu cho Khung Cột
const ColumnContainer = styled(Box)(({ theme }) => ({
  minWidth: 270,
  maxWidth: 270,
  backgroundColor: '#EBECF0', // Màu xám nhạt tiêu chuẩn của Trello
  borderRadius: '12px', // Bo góc giống Trello
  padding: theme.spacing(1),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', // Đổ bóng nhẹ hơn
  },
}));

// Thành phần định kiểu cho Thẻ
const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF', // Màu trắng giống thẻ Trello
  borderRadius: '8px', // Bo góc nhẹ hơn, giống Trello
  padding: theme.spacing(1),
  marginBottom: theme.spacing(0.5), // Giảm khoảng cách giữa thẻ
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)', // Đổ bóng nhẹ
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)', // Đổ bóng nhẹ khi hover
  },
}));

// Thành phần định kiểu cho Khung chứa Cột
const ColumnsWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: 'transparent', // Nền trong suốt để hòa hợp với nền bảng
  borderRadius: '12px',
  boxShadow: 'none', // Không đổ bóng
  width: '100%',
  maxWidth: 'calc(100vw - 32px)', // Giảm lề để giống Trello
  minHeight: 'calc(100vh - 120px)', // Tối ưu chiều cao
  overflowX: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
}));

/**
 * Thành phần hiển thị chi tiết bảng
 * @param {Object} props
 * @param {string} props.token - Mã xác thực
 * @param {Function} props.setBackgroundColor - Hàm đặt màu nền trong App.js
 * @returns {JSX.Element}
 */
const BoardDetail = ({ token, setBackgroundColor }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openInviteBoard, setOpenInviteBoard] = useState(false);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setBoard(data);
        setBackgroundColor(data.backgroundColor || '#FFFFFF');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, setBackgroundColor]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        backgroundColor: board?.backgroundColor || '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        pt: 0, // Không padding-top để sát thanh điều hướng
        px: 1, // Giảm lề ngang còn 8px, giống Trello
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      {/* Phần tiêu đề: Tên bảng, mô tả và các nút hành động */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1, // Tăng margin-bottom để cách khung cột 8px
          minHeight: 'auto',
          mt: 1, // 8px, sát thanh điều hướng
        }}
      >
        <Box>
          {board ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#172B4D', // Màu chữ đậm giống Trello
                  lineHeight: 1.4, // Tăng khoảng cách chữ
                }}
              >
                {board.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#5E6C84', lineHeight: 1.4 }} // Màu nhạt hơn, giống Trello
              >
                {board.description || 'Không có mô tả.'}
              </Typography>
            </>
          ) : (
            <Typography variant="h5">Đang tải...</Typography>
          )}
        </Box>
        {/* Nút hành động */}
        <Box sx={{ display: 'flex', gap: 0.5 }}> {/* Giảm gap để nút sát nhau hơn */}
          <Tooltip title="Đổi màu nền">
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/change-color`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' }, // Hover giống Trello
                p: 0.5, // Nút nhỏ gọn
              }}
            >
              <PaletteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cập nhật bảng">
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/update`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                p: 0.5,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa bảng">
            <IconButton
              color="error"
              onClick={() => handleNavigation(`/boards/${id}/delete`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(235, 90, 90, 0.2)' },
                p: 0.5,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mời người dùng">
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/invite-to-board`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                p: 0.5,
              }}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tạo cột mới">
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/columns/create`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                p: 0.5,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Chỉ báo tải */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Phần cột */}
      {board ? (
        <ColumnsWrapper
          sx={{
            mt: 1, // 8px, cách tiêu đề giống Trello
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1, // 8px giữa các cột
              p: 0.5, // 4px lề
              mr: 1, // Thêm lề phải để tránh cột cuối sát mép
            }}
          >
            <ColumnList
              boardId={id}
              token={token}
              ColumnContainer={ColumnContainer}
              CardContainer={CardContainer}
            />
          </Box>
        </ColumnsWrapper>
      ) : (
        <Typography color="error">Không tìm thấy bảng</Typography>
      )}

      {/* Hộp thoại mời người dùng vào bảng */}
      <InviteToBoard
        boardId={id}
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </Box>
  );
};

export default BoardDetail;