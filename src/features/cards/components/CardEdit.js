// src/features/cards/components/CardEdit.js
import React, { useState } from 'react';
import { updateCard } from '../services/cardService';

const CardEdit = ({ card, token, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [position, setPosition] = useState(card.position);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const updatedCard = await updateCard(token, card._id, title, description, position);
      setMessage('Card updated successfully!');
      onUpdate(updatedCard);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to update card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CardEdit;