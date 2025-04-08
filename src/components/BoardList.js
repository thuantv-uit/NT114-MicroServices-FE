import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BoardList = ({ token }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách boards
  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3002/api/boards/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [token]);

  // Xóa board
  const handleDelete = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await axios.delete(`http://localhost:3002/api/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(boards.filter((board) => board._id !== boardId));
      setError('');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to delete board');
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Boards</h2>
      <Link to="/boards/create">
        <button>Create New Board</button>
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {boards.map((board) => (
          <li key={board._id}>
            <Link to={`/boards/${board._id}`}>
              {board.title} - {board.description || 'No description'}
            </Link>
            <button
              onClick={() => handleDelete(board._id)}
              style={{ backgroundColor: 'red', marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;