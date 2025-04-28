import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
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
  TextField,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * Component to display board details
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const BoardDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setBoard(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id]);

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

  const handleColorChange = async (event) => {
    const newColor = event.target.value;
    try {
      const updatedBoard = await updateBoard(id, board.title, board.description, newColor);
      setBoard(updatedBoard);
      showToast('Background color updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 1800, mx: 'auto', mt: 4, p: 2, backgroundColor: board?.backgroundColor || '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/update`)}>Update Board</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/delete`)}>Delete Board</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/invite`)}>Invite User</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(`/boards/${id}/columns/create`)}>Create Column</MenuItem>
        </Menu>
      </Box>

      {/* Background Color Picker Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Background Color
        </Typography>
        <TextField
          type="color"
          label="Select Background Color"
          value={board?.backgroundColor || '#FFFFFF'}
          onChange={handleColorChange}
          sx={{ width: 200 }}
          InputLabelProps={{ shrink: true }}
        />
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {board ? (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Columns in this Board
            </Typography>
            <Divider sx={{ my: 2 }} />
            <ColumnList boardId={id} token={token} />
          </Paper>

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