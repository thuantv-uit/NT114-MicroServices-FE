import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { createBoard } from '../../api/boardApi';

function CreateBoard() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBoard(token, { title, description });
      navigate('/profile');
    } catch (err) {
      setError('Không thể tạo board');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tạo Board mới</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50', // Màu xanh lá cây
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s', // Hiệu ứng chuyển màu mượt mà
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')} // Hover: xanh đậm hơn
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')} // Trở lại màu gốc
        >
          Tạo Board
        </button>
      </form>
    </div>
  );
}

export default CreateBoard;