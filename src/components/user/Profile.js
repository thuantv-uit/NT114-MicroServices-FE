import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getBoards } from '../../api/boardApi';
import { getCurrentUser } from '../../api/userApi'; // Import hàm API lấy thông tin user

function Profile() {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Thêm state để theo dõi trạng thái loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser(token); // Gọi API thực tế để lấy thông tin user
        setUserData(user);
      } catch (err) {
        if (err.response?.status === 401) {
          // Nếu token không hợp lệ, đăng xuất và chuyển về trang đăng nhập
          logout();
          navigate('/login');
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    const fetchBoards = async () => {
      try {
        const data = await getBoards(token);
        setBoards(data);
      } catch (err) {
        setError('Không thể tải danh sách boards');
      }
    };

    if (token) {
      fetchUserData();
      fetchBoards();
    } else {
      setLoading(false); // Nếu không có token, không cần loading
    }
  }, [token, logout, navigate]);

  // Nếu không có token, yêu cầu đăng nhập
  if (!token) {
    return <p>Vui lòng đăng nhập để xem hồ sơ của bạn.</p>;
  }

  // Hiển thị "Đang tải..." khi đang chờ dữ liệu
  if (loading) {
    return <p>Đang tải...</p>;
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
        <p>Không có thông tin người dùng</p>
      )}

      <h3>Danh sách Boards</h3>
      <ul>
        {boards.map((board) => (
          <li key={board._id}>
            <h4>{board.title}</h4>
            <p>{board.description}</p>
            <Link to={`/boards/${board._id}`}>
              <button>Vào Board</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;