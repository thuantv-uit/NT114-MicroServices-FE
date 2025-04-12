// src/features/columns/components/ColumnList.js
import React, { useState, useEffect } from 'react';
import { fetchColumns } from '../services/columnService';
import { toast } from 'react-toastify';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import CardList from '../../cards/components/CardList';
import { useNavigate } from 'react-router-dom';
import ColumnMenu from './ColumnMenu';
import { COLUMN_CARD_STYLE } from '../../../constants/styles';

const ColumnList = ({ boardId, token, onRefresh }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const data = await fetchColumns(token, boardId);
      setColumns(data);
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, token]);

  return (
    <Box sx={{ my: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2, width: '100%', mx: 'auto' }}>
          <Box sx={{ display: 'inline-flex', gap: 2 }}>
            {columns.length > 0 ? (
              columns.map((column) => (
                <Card key={column._id} sx={COLUMN_CARD_STYLE}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{column.title}</Typography>
                      <ColumnMenu
                        column={column}
                        boardId={boardId}
                        onEdit={() => navigate(`/columns/${column._id}/edit`, { state: { title: column.title, position: column.position, boardId } })}
                        onDelete={() => navigate(`/columns/${column._id}/delete`, { state: { boardId } })}
                        onAddCard={() => navigate(`/columns/${column._id}/cards/create`, { state: { boardId } })}
                        onRefresh={loadColumns}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Position: {column.position}
                    </Typography>
                    <CardList columnId={column._id} token={token} boardId={boardId} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No columns found.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ColumnList;