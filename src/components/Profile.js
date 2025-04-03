import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getBoards } from '../api/boardApi'; // Import hàm getBoards

function Profile() {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [otherUserId, setOtherUserId] = useState('');
  const [otherUserData, setOtherUserData] = useState(null);
  const [otherUserError, setOtherUserError] = useState('');
  const [boards, setBoards] = useState([]); // State cho danh sách board
  const [loadingBoards, setLoadingBoards] = useState(true); // State loading cho board
  const [boardError, setBoardError] = useState(''); // State error cho board
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      }
    };

    const fetchBoards = async () => {
      try {
        const data = await getBoards(token);
        setBoards(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setBoardError('Không thể tải danh sách board');
        }
      } finally {
        setLoadingBoards(false);
      }
    };

    if (token) {
      fetchUser();
      fetchBoards();
    }
  }, [token, logout, navigate]);

  const fetchOtherUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOtherUserData(response.data);
      setOtherUserError('');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setOtherUserError('Không thể tải thông tin người dùng');
        setOtherUserData(null);
      }
    }
  };

  if (!token) {
    return <p>Vui lòng đăng nhập để xem hồ sơ của bạn.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hồ sơ</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData ? (
        <>
          <p><strong>Tên người dùng:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </>
      ) : (
        <p>Đang tải...</p>
      )}

      <h3>Danh sách Board</h3>
      {loadingBoards ? (
        <p>Đang tải danh sách board...</p>
      ) : boardError ? (
        <p style={{ color: 'red' }}>{boardError}</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board._id}>
              <h4>{board.title}</h4>
              <p>{board.description}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/create-board')}>Tạo Board mới</button>

      <h3>Xem thông tin người dùng khác</h3>
      <input
        type="text"
        value={otherUserId}
        onChange={(e) => setOtherUserId(e.target.value)}
        placeholder="Nhập ID người dùng"
      />
      <button onClick={fetchOtherUser}>Tìm kiếm</button>
      {otherUserError && <p style={{ color: 'red' }}>{otherUserError}</p>}
      {otherUserData && (
        <div>
          <p><strong>Tên người dùng:</strong> {otherUserData.username}</p>
          <p><strong>Email:</strong> {otherUserData.email}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;