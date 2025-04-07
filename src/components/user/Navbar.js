import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Cập nhật đường dẫn hiện tại mỗi khi location thay đổi
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Kiểu dáng cho Navbar
  const navStyle = {
    padding: '10px 20px',
    background: '#f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  // Kiểu dáng cho các liên kết
  const linkStyle = (path) => ({
    marginRight: '15px',
    padding: '8px 12px',
    textDecoration: 'none',
    color: currentPath === path ? '#fff' : '#333',
    backgroundColor: currentPath === path ? '#1976d2' : 'transparent',
    borderRadius: '4px',
    transition: 'background-color 0.3s, color 0.3s',
  });

  // Kiểu dáng cho nút Đăng xuất
  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle('/')}>Trang chủ</Link>
        {user ? (
          <>
            <Link to="/profile" style={linkStyle('/profile')}>Hồ sơ</Link>
          </>
        ) : (
          <>
            <Link to="/register" style={linkStyle('/register')}>Đăng ký</Link>
            <Link to="/login" style={linkStyle('/login')}>Đăng nhập</Link>
          </>
        )}
      </div>
      {user && (
        <button onClick={handleLogout} style={buttonStyle}>Đăng xuất</button>
      )}
    </nav>
  );
}

export default Navbar;