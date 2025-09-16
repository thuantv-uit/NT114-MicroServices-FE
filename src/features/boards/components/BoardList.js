import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
} from '@mui/material';
import BoardCreate from './BoardCreate';

/**
 * Component to list all boards with image or color backgrounds
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const BoardList = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      try {
        const data = await fetchBoards();
        // console.log('Fetched boards:', data); // Debug
        setBoards(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, []);

  // Handle dialog close and refresh boards
  const handleDialogClose = async () => {
    setOpenCreateDialog(false);
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', my: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, color: 'primary.main' }}
      >
        Your Boards
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
        sx={{
          mb: 4,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
          px: 3,
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        Create New Board
      </Button>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {boards.length > 0 ? (
            boards.map((board) => {
              // Determine if backgroundImage is more recent
              const isImageLatest =
                board.backgroundImageUpdatedAt &&
                board.backgroundColorUpdatedAt &&
                new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

              return (
                <Grid item xs={12} sm={6} md={3} key={board._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      },
                      width: 210,
                      height: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Phần Background */}
                    <Box
                      sx={{
                        flex: '0 0 80%',
                        backgroundImage: isImageLatest && board.backgroundImage ? `url(${board.backgroundImage})` : 'none',
                        backgroundColor: isImageLatest ? 'transparent' : board.backgroundColor || '#f0f4f8',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />

                    {/* Phần Title */}
                    <CardContent
                      sx={{
                        flex: '0 0 20%',
                        p: 0.3,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'top',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'medium',
                          color: 'text.primary',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem',
                        }}
                        component={Link}
                        to={`/boards/${board._id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {board.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontSize: '1.125rem' }}
              >
                No boards available. Create one to get started!
              </Typography>
            </Box>
          )}
        </Grid>
      )}

      {/* Create Board Dialog */}
      <Dialog open={openCreateDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <BoardCreate token={token} onClose={handleDialogClose} />
      </Dialog>
    </Box>
  );
};

export default BoardList;