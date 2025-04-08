import React, { useState } from 'react';
import axios from 'axios';

const BoardInvite = ({ boardId, token }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3002/api/boards/invite',
        { boardId, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Invite User to Board</h3>
      <form onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Inviting...' : 'Invite'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BoardInvite;