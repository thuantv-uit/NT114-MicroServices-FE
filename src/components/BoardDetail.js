import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getBoardById, deleteBoard } from '../api/boardApi';

function BoardDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardById(token, id);
        setBoard(data);
      } catch (err) {
        setError('Không thể tải thông tin board');
      }
    };
    if (token && id) fetchBoard();
  }, [token, id]);

  const handleDelete = async () => {
    try {
      await deleteBoard(token, id);
      navigate('/profile');
    } catch (err) {
      setError('Không thể xóa board');
    }
  };

  if (!board) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{board.title}</h2>
      <p>{board.description}</p>
      <button onClick={() => navigate(`/update-board/${id}`)}>Cập nhật</button>
      <button onClick={handleDelete}>Xóa</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default BoardDetail;