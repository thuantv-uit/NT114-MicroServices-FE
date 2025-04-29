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
  Divider,
  IconButton,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddIcon from '@mui/icons-material/Add';

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
    <Box sx={{ backgroundColor: board?.backgroundColor || '#FFFFFF', minHeight: '100vh', height: '100vh', width: '100%', position: 'fixed', top: 0, left: 0, p: 2, overflow: 'auto' }}>
      {/* Header Section: Board Title and Description */}
      <Box sx={{ mb: 2 }}>
        {board ? (
          <>
            <Typography variant="h4" gutterBottom>
              {board.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {board.description || 'No description provided.'}
            </Typography>
          </>
        ) : (
          <Typography variant="h4" gutterBottom>
            Loading...
          </Typography>
        )}
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Main Content: Action Buttons (Vertical) and Columns (Horizontal) Side by Side */}
      {board ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Vertical Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 60 }}>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/change-color`)}
              title="Change Color"
            >
              <PaletteIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/update`)}
              title="Update Board"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleNavigation(`/boards/${id}/delete`)}
              title="Delete Board"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/invite-to-board`)}
              title="Invite User to Board"
            >
              <PersonAddIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/invite-to-column`)}
              title="Invite User to Column"
            >
              <GroupAddIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/assign-to-card`)}
              title="Assign User to Card"
            >
              <AssignmentIndIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleNavigation(`/boards/${id}/columns/create`)}
              title="Create Column"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Columns Section (Horizontal) */}
          <Box sx={{ flex: 1, display: 'flex', overflowX: 'auto', gap: 2, pb: 2 }}>
            <Paper
              elevation={3}
              sx={{
                minWidth: 270,
                p: 2,
                borderRadius: 1,
                height: 'fit-content',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Columns in this Board
              </Typography>
              <Divider sx={{ my: 1 }} />
              <ColumnList boardId={id} token={token} />
            </Paper>
          </Box>
        </Box>
      ) : (
        <Typography color="error">Board not found</Typography>
      )}

      {/* Dialog để mời user vào board (sẽ được chuyển sang page riêng) */}
      <InviteToBoard
        boardId={id}
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </Box>
  );
};

export default BoardDetail;