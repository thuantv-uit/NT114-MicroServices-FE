import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import ColumnList from '../../columns/components/ColumnList';
import InviteToBoard from '../../invitations/components/InviteToBoard';
import UpdateBoard from './UpdateBoard';
import ChangeBackground from './ChangeColor';
import DeleteBoard from './DeleteBoard';
import CreateColumn from '../../columns/components/CreateColumn';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  styled,
  Tooltip,
  Dialog,
  Divider,
  Button,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

// Styled components
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

const NavItem = styled(Box)(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#172B4D',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(9, 30, 66, 0.1)',
  },
  ...(isActive && {
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-12px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#00FF00',
    },
  }),
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
  const location = useLocation();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openInviteBoard, setOpenInviteBoard] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openBackgroundDialog, setOpenBackgroundDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateColumnDialog, setOpenCreateColumnDialog] = useState(false);
  const columnsWrapperRef = useRef(null); // Ref để scroll

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
  }, [id, setBackgroundColor, location?.state?.refresh]);

  // Handle dialog close and refresh board
  const handleDialogClose = async () => {
    setOpenUpdateDialog(false);
    setOpenBackgroundDialog(false);
    setOpenDeleteDialog(false);
    setOpenCreateColumnDialog(false);
    try {
      const data = await fetchBoard(id);
      setBoard(data);
      setBackgroundColor(data.backgroundColor || '#FFFFFF');
      // Scroll đến cuối columnsWrapper khi tạo cột mới
      if (openCreateColumnDialog) {
        setTimeout(() => {
          if (columnsWrapperRef.current) {
            columnsWrapperRef.current.scrollTo({
              left: columnsWrapperRef.current.scrollWidth,
              behavior: 'smooth',
            });
          }
        }, 0);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Determine which background to use based on latest update
  const isImageLatest =
    board?.backgroundImageUpdatedAt &&
    board?.backgroundColorUpdatedAt &&
    new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

  // Navigation items - Định nghĩa các item navigation, với path dẫn đến route trong App.js
  const navItems = [
    { name: 'Summary', icon: <SummarizeIcon sx={{ mr: 0.5 }} />, path: `/boards/${id}/summary` },
    { name: 'Board', icon: <ViewKanbanIcon sx={{ mr: 0.5 }} />, path: `/boards/${id}` },
    { name: 'Calendar', icon: <CalendarTodayIcon sx={{ mr: 0.5 }} />, path: `/boards/${id}/calendar` }
  ];

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: isImageLatest ? 'transparent' : board?.backgroundColor || '#FFFFFF',
        backgroundImage: isImageLatest ? `url(${board?.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 64px)',
        color: '#172B4D',
      }}
    >
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        {board ? (
          <>
            <Box sx={{ flex: 1 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1, color: '#5E6C84' }} />
                <Typography
                  variant="body2"
                  sx={{ color: '#5E6C84', lineHeight: 1.4 }}
                >
                  {board.description || 'Không có mô tả.'}
                </Typography>
              </Box>
              {/* Navigation items - Khi click, navigate đến path tương ứng trong App.js */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)} // Chuyển hướng đến route Summary hoặc Calendar khi click
                  >
                    {item.icon}
                    <Typography variant="body1">{item.name}</Typography>
                  </NavItem>
                ))}
              </Box>
            </Box>
            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Đổi nền">
                <IconButton
                  color="primary"
                  onClick={() => setOpenBackgroundDialog(true)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                    p: 1,
                  }}
                >
                  <PaletteIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cập nhật bảng">
                <IconButton
                  color="primary"
                  onClick={() => setOpenUpdateDialog(true)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                    p: 1,
                  }}
                >
                  <EditIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa bảng">
                <IconButton
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': { bgcolor: 'rgba(235, 90, 90, 0.2)' },
                    p: 1,
                  }}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mời người dùng">
                <IconButton
                  color="primary"
                  onClick={() => setOpenInviteBoard(true)}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                    p: 1,
                  }}
                >
                  <PersonAddIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        ) : (
          <Typography variant="h5">Đang tải...</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2, borderColor: '#EBECF0' }} />

      {location.pathname === `/boards/${id}` && (
        <>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {board ? (
            <ColumnsWrapper sx={{ mt: 1 }} ref={columnsWrapperRef}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 0.5,
                  mr: 1,
                  alignItems: 'flex-start',
                }}
              >
                <ColumnList
                  boardId={id}
                  token={token}
                  ColumnContainer={ColumnContainer}
                  CardContainer={CardContainer}
                />
                {/* Nút tạo cột mới */}
                <Box sx={{ minWidth: 270, maxWidth: 270 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateColumnDialog(true)}
                    sx={{
                      width: '100%',
                      borderRadius: '8px',
                      textTransform: 'none',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      color: '#172B4D',
                      '&:hover': { bgcolor: 'rgba(9, 30, 66, 0.2)' },
                    }}
                  >
                    Create Column
                  </Button>
                </Box>
              </Box>
            </ColumnsWrapper>
          ) : (
            <Typography color="error">Không tìm thấy bảng</Typography>
          )}
        </>
      )}

      {/* Dialogs */}
      <Dialog open={openUpdateDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <UpdateBoard token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openBackgroundDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <ChangeBackground token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DeleteBoard token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openCreateColumnDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <CreateColumn token={token} onClose={handleDialogClose} />
      </Dialog>
      <InviteToBoard
        boardId={id}
        board={board}
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </Box>
  );
};

export default BoardDetail;