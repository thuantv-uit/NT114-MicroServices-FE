import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CARD_PAPER_STYLE } from '../../../constants/styles';

/**
 * Component to display a card
 * @param {Object} props
 * @param {Object} props.card - Card data
 * @param {string} props.boardId - Board ID
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @returns {JSX.Element}
 */
const Card = ({ card, boardId, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card, type: 'CARD' },
  });

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}>
      <Paper elevation={1} sx={CARD_PAPER_STYLE}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2">{card.title}</Typography>
            {card.description && (
              <Typography variant="body2" color="textSecondary">{card.description}</Typography>
            )}
          </Box>
          <Box>
            <IconButton
              aria-label="edit"
              onClick={() => onEdit(card)}
              color="primary"
              data-no-dnd="true"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => onDelete(card._id)}
              color="error"
              data-no-dnd="true"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default Card;