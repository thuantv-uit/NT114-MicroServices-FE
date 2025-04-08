import React, { useState } from 'react';
import axios from 'axios';

const ColumnCreate = ({ boardId, token, onColumnCreated }) => {
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3003/api/columns',
        { title, boardId, position },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Column created successfully!');
      setTitle('');
      setPosition(0);
      onColumnCreated(res.data); // Gọi callback để cập nhật danh sách
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to create column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4>Create New Column</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Column Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Column'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ColumnCreate;