import React, { useState } from 'react';
import axios from 'axios';

const ColumnEdit = ({ column, token, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(column.title);
  const [position, setPosition] = useState(column.position);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.put(
        `http://localhost:3003/api/columns/${column._id}`,
        { title, position },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Column updated successfully!');
      onUpdate(res.data);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to update column');
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

export default ColumnEdit;