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
  CircularProgress
} from '@mui/material';

/**
 * Component to list all boards
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const BoardList = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      setLoading(true);
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, []);

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
        component={Link}
        to="/boards/create"
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
            boards.map((board) => (
              <Grid item xs={12} sm={6} md={3} key={board._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    bgcolor: board.backgroundColor || '#f0f4f8', // Màu nền từ board
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    },
                    // Kích thước hình chữ nhật cố định
                    width: 280,
                    height: 200,
                    display: 'flex',
                    alignItems: 'flex-end', // Đẩy nội dung xuống cuối
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      width: '100%',
                      bgcolor: '#ffffff', // Nền trắng cho tiêu đề
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'medium',
                        color: 'text.primary', // Chữ đen để tương phản với nền trắng
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
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
            ))
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
    </Box>
  );
};

export default BoardList;