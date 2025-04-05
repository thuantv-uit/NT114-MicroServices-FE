import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Trang chủ</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ marginRight: '10px' }}>Hồ sơ</Link>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : (
        <>
          <Link to="/register" style={{ marginRight: '10px' }}>Đăng ký</Link>
          <Link to="/login">Đăng nhập</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;