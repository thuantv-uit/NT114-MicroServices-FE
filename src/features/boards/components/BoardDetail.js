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
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';

// Styled component cho Column Container
const ColumnContainer = styled(Box)(({ theme }) => ({
  minWidth: 270,
  maxWidth: 270,
  backgroundColor: theme.palette.grey[200], // Màu xám nhạt giống Trello
  borderRadius: '8px', // Bo góc giống Trello
  padding: theme.spacing(1.5),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

// Styled component cho Card
const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Màu trắng giống card của Trello
  borderRadius: '20px', // Bo góc nhẹ cho card
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
  },
}));

// Styled component cho khung bao quanh Columns
const ColumnsWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Nền mờ giống Trello
  borderRadius: '12px',
  boxShadow: 'none', // Loại bỏ bóng để giống Trello
  width: '100%',
  maxWidth: 'calc(100vw - 64px)', // Trừ padding và margin
  minHeight: 'calc(100vh - 150px)', // Chiếm gần hết chiều cao
  overflowX: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
}));

/**
 * Component to display board details
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.setBackgroundColor - Function to set background color in App.js
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
        pt: 0, // Giảm padding-top để header sát navbar
        px: 2,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      {/* Header Section: Board Title, Description, and Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 0.5, // Giảm margin-bottom để ColumnsWrapper sát header
          minHeight: 'auto', // Thu nhỏ chiều cao khung
          // Điều chỉnh khoảng cách giữa navbar và title tại đây:
          // Thay đổi 'mt' (margin-top) để kiểm soát khoảng cách với navbar
          mt: 1, // 8px, sát navbar
        }}
      >
        <Box>
          {board ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  lineHeight: 1.2, // Bó sát chữ
                }}
              >
                {board.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ lineHeight: 1.2 }} // Bó sát chữ
              >
                {board.description || 'No description provided.'}
              </Typography>
            </>
          ) : (
            <Typography variant="h5">Loading...</Typography>
          )}
        </Box>
        {/* Action Buttons (bao gồm Create Column) */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="primary"
            onClick={() => handleNavigation(`/boards/${id}/change-color`)}
            title="Change Color"
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', '&:hover': { bgcolor: 'primary.light' } }}
          >
            <PaletteIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleNavigation(`/boards/${id}/update`)}
            title="Update Board"
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', '&:hover': { bgcolor: 'primary.light' } }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleNavigation(`/boards/${id}/delete`)}
            title="Delete Board"
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', '&:hover': { bgcolor: 'error.light' } }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleNavigation(`/boards/${id}/invite-to-board`)}
            title="Invite User to Board"
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', '&:hover': { bgcolor: 'primary.light' } }}
          >
            <PersonAddIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleNavigation(`/boards/${id}/columns/create`)}
            title="Create Column"
            sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', '&:hover': { bgcolor: 'primary.light' } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Columns Section */}
      {board ? (
        <ColumnsWrapper
          sx={{
            // Điều chỉnh khoảng cách giữa header (title) và ColumnsWrapper tại đây:
            // Thay đổi 'mt' (margin-top) để kiểm soát khoảng cách với header
            mt: 0.5, // 4px, sát header
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, p: 1 }}>
            <ColumnList
              boardId={id}
              token={token}
              ColumnContainer={ColumnContainer}
              CardContainer={CardContainer}
            />
          </Box>
        </ColumnsWrapper>
      ) : (
        <Typography color="error">Board not found</Typography>
      )}

      {/* Dialog để mời user vào board */}
      <InviteToBoard
        boardId={id}
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </Box>
  );
};

export default BoardDetail;
