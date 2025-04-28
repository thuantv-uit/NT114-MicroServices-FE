import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

/**
 * Darken a hex color by a given percentage
 * @param {string} hexColor - Hex color code (e.g., #FF5733)
 * @param {number} percent - Percentage to darken (0 to 100)
 * @returns {string} Darkened hex color
 */
const darkenColor = (hexColor, percent) => {
  // Loại bỏ ký tự # và chuyển đổi hex thành RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Giảm độ sáng theo phần trăm
  const factor = 1 - percent / 100;
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  // Đảm bảo giá trị nằm trong khoảng 0-255
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Chuyển đổi lại thành hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Navigation bar component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {Function} props.logout - Logout function
 * @param {string} props.backgroundColor - Background color of the board
 * @returns {JSX.Element}
 */
const Navbar = ({ token, logout, backgroundColor = '#FFFFFF' }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Chỉ làm tối màu nếu đang ở trang BoardDetail (/boards/:id)
  const isBoardDetailPage = /^\/boards\/[0-9a-fA-F]{24}$/.test(location.pathname);
  const navbarColor = isBoardDetailPage ? darkenColor(backgroundColor, 20) : undefined;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: navbarColor }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Task Manager
        </Typography>
        <Box>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/boards">
                Boards
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;