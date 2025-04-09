// src/features/boards/components/BoardDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard } from '../services/boardService';
import { toast } from 'react-toastify';
import ColumnList from '../../columns/components/ColumnList';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const BoardDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(token, id);
        setBoard(data);
      } catch (err) {
        setMessage(err.response?.data.message || 'Failed to fetch board');
        toast.error(err.response?.data.message || 'Failed to fetch board');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, token]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ maxWidth: 1800, mx: 'auto', mt: 4, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Thay "Board Details" bằng title và description của board */}
        <Box>
          {board ? (
            <>
              <Typography variant="h4" gutterBottom>
                {board.title}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {board.description || 'No description provided.'}
              </Typography>
            </>
          ) : (
            <Typography variant="h4" gutterBottom>
              Loading...
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          onClick={handleMenuClick}
          startIcon={<MoreVertIcon />}
        >
          Actions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/update`)}>Update Board</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/delete`)}>Delete Board</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/invite`)}>Invite User</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/columns/create`)}>Create Column</MenuItem>
        </Menu>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {message && (
        <Typography color={message.includes('successfully') ? 'success.main' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      {board ? (
        <>
          {/* Board Details Section - Đã được thay thế bằng title và description ở trên */}
          {/* Columns Section */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Columns in this Board
            </Typography>
            <Divider sx={{ my: 2 }} />
            <ColumnList boardId={id} token={token} />
          </Paper>

          {/* Members Section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <List>
              {board.memberIds && board.memberIds.length > 0 ? (
                board.memberIds.map((memberId) => (
                  <ListItem key={memberId}>
                    <ListItemText primary={memberId} />
                  </ListItem>
                ))
              ) : (
                <Typography>No members found.</Typography>
              )}
            </List>
          </Paper>
        </>
      ) : (
        <Typography color="error">Board not found</Typography>
      )}
    </Box>
  );
};

export default BoardDetail;