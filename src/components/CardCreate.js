import React, { useState } from 'react';
import axios from 'axios';

const CardCreate = ({ columnId, token, onCardCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3004/api/cards',
        { title, description, columnId, position },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Card created successfully!');
      setTitle('');
      setDescription('');
      setPosition(0);
      onCardCreated(res.data); // Gọi callback để cập nhật danh sách
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <h5>Create New Card</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Card Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Card'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CardCreate;