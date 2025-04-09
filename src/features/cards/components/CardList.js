// src/features/cards/components/CardList.js
import React, { useState, useEffect } from 'react';
import { fetchCards, deleteCard } from '../services/cardService';
import CardEdit from './CardEdit';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CardList = ({ columnId, token }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const data = await fetchCards(token, columnId);
        setCards(data);
      } catch (err) {
        setError(err.response?.data.message || 'Failed to fetch cards');
        toast.error(err.response?.data.message || 'Failed to fetch cards');
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [columnId, token]);

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteCard(token, cardId);
      setCards(cards.filter((card) => card._id !== cardId));
      setError('');
      toast.success('Card deleted successfully!');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to delete card');
      toast.error(err.response?.data.message || 'Failed to delete card');
    }
  };

  const handleUpdate = (updatedCard) => {
    setCards(cards.map((card) => (card._id === updatedCard._id ? updatedCard : card)));
    setEditingCard(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      {loading && (
        <Typography variant="body2" color="textSecondary">
          Loading cards...
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      {cards.length > 0 ? (
        cards.map((card) => (
          <Paper
            key={card._id}
            elevation={1}
            sx={{
              p: 1,
              mb: 1,
              maxHeight: 100,
              overflowY: 'auto',
              wordBreak: 'break-word',
            }}
          >
            {editingCard === card._id ? (
              <CardEdit
                card={card}
                token={token}
                onUpdate={handleUpdate}
                onCancel={() => setEditingCard(null)}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2">{card.title}</Typography>
                  {card.description && (
                    <Typography variant="body2" color="textSecondary">
                      {card.description}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Position: {card.position}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    aria-label="edit"
                    onClick={() => setEditingCard(card._id)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(card._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No cards in this column.
        </Typography>
      )}
    </Box>
  );
};

export default CardList;