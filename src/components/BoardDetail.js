import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardInvite from './BoardInvite';
import ColumnList from './ColumnList';
import ColumnCreate from './ColumnCreate';

const BoardDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy chi tiết board
  useEffect(() => {
    const fetchBoard = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3002/api/boards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
      } catch (err) {
        setMessage(err.response?.data.message || 'Failed to fetch board');
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id, token]);

  // Cập nhật board
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.put(
        `http://localhost:3002/api/boards/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoard(res.data);
      setMessage('Board updated successfully!');
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to update board');
    } finally {
      setLoading(false);
    }
  };

  // Xóa board
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    setMessage('');
    setLoading(true);

    try {
      await axios.delete(`http://localhost:3002/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Board deleted successfully!');
      setTimeout(() => navigate('/boards'), 2000);
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to delete board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>Board Details</h2>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      {board ? (
        <>
          {/* Form cập nhật board */}
          <form onSubmit={handleUpdate}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Board'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{ backgroundColor: 'red', marginLeft: '10px' }}
            >
              Delete Board
            </button>
          </form>

          {/* Mời user vào board */}
          <BoardInvite boardId={id} token={token} />

          {/* Quản lý columns */}
          <div style={{ marginTop: '20px' }}>
            <h3>Columns in this Board</h3>
            <ColumnCreate boardId={id} token={token} onColumnCreated={() => {}} />
            <ColumnList boardId={id} token={token} />
          </div>

          {/* Hiển thị danh sách members */}
          <div>
            <h3>Members</h3>
            <ul>
              {board.memberIds.map((memberId) => (
                <li key={memberId}>{memberId}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Board not found</p>
      )}
    </div>
  );
};

export default BoardDetail;