// src/features/boards/components/BoardList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards, deleteBoard } from '../services/boardService';
import { toast } from 'react-toastify';
import {
  Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BoardList = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      try {
        const data = await fetchBoards(token);
        setBoards(data);
      } catch (err) {
        toast.error(err.response?.data.message || 'Failed to fetch boards');
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, [token]);

  const handleDelete = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteBoard(token, boardId);
      setBoards(boards.filter((board) => board._id !== boardId));
      toast.success('Board deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to delete board');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>Your Boards</Typography>
      <Button variant="contained" color="primary" component={Link} to="/boards/create" sx={{ mb: 2 }}>
        Create New Board
      </Button>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <List>
            {boards.map((board) => (
              <ListItem key={board._id} divider>
                <ListItemText
                  primary={<Link to={`/boards/${board._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>{board.title}</Link>}
                  secondary={board.description || 'No description'}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(board._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BoardList;