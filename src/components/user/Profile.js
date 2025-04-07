import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getBoards } from '../../api/boardApi';
import { getCurrentUser } from '../../api/userApi';

function Profile() {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser(token);
        setUserData(user);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } finally {
        setLoading(false);
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
      setLoading(false);
    }
  }, [token, logout, navigate]);

  if (!token) {
    return <p>Vui lòng đăng nhập để xem hồ sơ của bạn.</p>;
  }

  if (loading) {
    return <p>Đang tải...</p>;
  }

  // Danh sách màu ngẫu nhiên cho các thanh tiêu đề của board
  const colors = [
    '#FF5733', '#28A745', '#17A2B8', '#FD7E14', '#FFC107', 
    '#F8C1CC', '#6F42C1', '#E83E8C', '#FF851B', '#20C997'
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar bên trái */}
      <div
        style={{
          width: '250px',
          backgroundColor: '#F5F5F5',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <div
          style={{
            backgroundColor: '#E6F0FA',
            padding: '10px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ width: '10px', height: '10px', backgroundColor: '#007BFF', display: 'inline-block' }}></span>
          <span>Boards</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: '#007BFF', display: 'inline-block' }}></span>
          <span>Templates</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: '#007BFF', display: 'inline-block' }}></span>
          <span>Home</span>
        </div>
        <Link
          to="/create-board"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          <span style={{ width: '10px', height: '10px', backgroundColor: 'black', display: 'inline-block' }}></span>
          <span>Create a new board</span>
        </Link>
      </div>

      {/* Khu vực nội dung chính */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Hồ sơ</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {userData ? (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Tên người dùng:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        ) : (
          <p>Không có thông tin người dùng</p>
        )}

        <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Your boards:</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {boards.map((board, index) => (
            <div
              key={board._id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D3D3D3',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundColor: colors[index % colors.length],
                  color: 'white',
                  padding: '10px',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                  fontWeight: 'bold',
                }}
              >
                {board.title}
              </div>
              <div style={{ padding: '10px', flex: 1 }}>
                <p>{board.description}</p>
              </div>
              <div style={{ padding: '10px', textAlign: 'right' }}>
                <Link to={`/boards/${board._id}`}>
                  <button
                    style={{
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Go to board
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;