import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

// Styled components (unchanged)
const ColumnContainer = styled(Box)(({ theme }) => ({
  minWidth: 270,
  maxWidth: 270,
  backgroundColor: '#EBECF0',
  borderRadius: '12px',
  padding: theme.spacing(1),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
}));

const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
  },
}));

const ColumnsWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: 'transparent',
  borderRadius: '12px',
  boxShadow: 'none',
  width: '100%',
  maxWidth: 'calc(100vw - 32px)',
  minHeight: 'calc(100vh - 120px)',
  overflowX: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
}));

/**
 * Component to display board details with Cloudinary image or color background
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.setBackgroundColor - Function to set background color in App.js
 * @returns {JSX.Element}
 */
const BoardDetail = ({ token, setBackgroundColor }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openInviteBoard, setOpenInviteBoard] = useState(false);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        console.log('Fetched board:', data); // Debug
        setBoard(data);
        setBackgroundColor(data.backgroundColor || '#FFFFFF');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, setBackgroundColor, state?.refresh]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Determine which background to use based on latest update
  const isImageLatest =
    board?.backgroundImageUpdatedAt &&
    board?.backgroundColorUpdatedAt &&
    new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

  return (
    <Box
      sx={{
        backgroundImage: isImageLatest && board?.backgroundImage ? `url(${board.backgroundImage})` : 'none',
        backgroundColor: !isImageLatest ? board?.backgroundColor || '#FFFFFF' : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        pt: 0,
        px: 1,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      {/* Header: Board title, description, and action buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1,
          minHeight: 'auto',
          mt: 1,
        }}
      >
        <Box>
          {board ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#172B4D',
                  lineHeight: 1.4,
                }}
              >
                {board.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#5E6C84', lineHeight: 1.4 }}
              >
                {board.description || 'Không có mô tả.'}
              </Typography>
            </>
          ) : (
            <Typography variant="h5">Đang tải...</Typography>
          )}
        </Box>
        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Đổi nền">
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/change-background`)}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                p: 0.5,
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
              onClick={() => setOpenInviteBoard(true)}
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

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Columns section */}
      {board ? (
        <ColumnsWrapper sx={{ mt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              p: 0.5,
              mr: 1,
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

      {/* Invite to board dialog */}
      <InviteToBoard
        boardId={id}
        board={board} // Pass board data for owner and members
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </Box>
  );
};

export default BoardDetail;