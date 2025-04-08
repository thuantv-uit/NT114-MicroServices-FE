import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BoardCreate = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3002/api/boards',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Board created successfully!');
      setTimeout(() => navigate('/boards'), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create New Board</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Board Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Board'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BoardCreate;