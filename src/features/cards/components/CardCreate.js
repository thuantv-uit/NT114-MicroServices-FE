// src/features/cards/components/CardCreate.js
import React, { useState } from 'react';
import { createCard } from '../services/cardService';
import { toast } from 'react-toastify';
import {
  Box, TextField, Button, Typography, Modal
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CardCreate = ({ columnId, token, onCardCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setPosition(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createCard(token, title, description, columnId, position);
      toast.success('Card created successfully!');
      setTitle('');
      setDescription('');
      setPosition(0);
      onCardCreated(data);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Card
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Create New Card</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Card Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description (optional)"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Position"
              variant="outlined"
              fullWidth
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Creating...' : 'Create Card'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CardCreate;