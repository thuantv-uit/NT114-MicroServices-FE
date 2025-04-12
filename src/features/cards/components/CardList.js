// src/features/cards/components/CardList.js
import React, { useState, useEffect } from 'react';
import { fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CARD_PAPER_STYLE } from '../../../constants/styles';
import { useNavigate } from 'react-router-dom';

const CardList = ({ columnId, token, boardId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const data = await fetchCards(token, columnId);
        setCards(data);
      } catch (err) {
        showToast(err.response?.data.message || 'Failed to fetch cards', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [columnId, token]);

  const handleEdit = (card) => {
    navigate(`/cards/${card._id}/edit`, {
      state: {
        title: card.title,
        description: card.description,
        position: card.position,
        boardId,
      },
    });
  };

  const handleDelete = (cardId) => {
    navigate(`/cards/${cardId}/delete`, { state: { boardId } });
  };

  return (
    <Box sx={{ mb: 2 }}>
      {loading && <Typography variant="body2" color="textSecondary">Loading cards...</Typography>}
      {cards.length > 0 ? (
        cards.map((card) => (
          <Paper key={card._id} elevation={1} sx={CARD_PAPER_STYLE}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2">{card.title}</Typography>
                {card.description && (
                  <Typography variant="body2" color="textSecondary">{card.description}</Typography>
                )}
                <Typography variant="body2" color="textSecondary">Position: {card.position}</Typography>
              </Box>
              <Box>
                <IconButton aria-label="edit" onClick={() => handleEdit(card)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(card._id)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">No cards in this column.</Typography>
      )}
    </Box>
  );
};

export default CardList;