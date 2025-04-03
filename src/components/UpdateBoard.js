import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getBoardById, updateBoard } from '../api/boardApi';

function UpdateBoard() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardById(token, id);
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        setError('Không thể tải thông tin board');
      }
    };
    if (token && id) fetchBoard();
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBoard(token, id, { title, description });
      navigate(`/boards/${id}`);
    } catch (err) {
      setError('Không thể cập nhật board');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cập nhật Board</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}

export default UpdateBoard;