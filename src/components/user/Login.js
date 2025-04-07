import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { loginUser } from '../../api/userApi';
import { Box, Button, Typography, IconButton, InputAdornment, Zoom } from '@mui/material';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const { token, user } = response;
      login(user, token); // Lưu thông tin user và token vào AuthContext
      toast.success('Đăng nhập thành công!'); // Thông báo thành công (tùy chọn)
      navigate('/profile'); // Điều hướng đến trang profile
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại'); // Thông báo lỗi
    }
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
      <Box sx={{ padding: '20px', maxWidth: 380, margin: 'auto', marginTop: '6em' }}>
        <Typography variant="h5" align="center">Đăng nhập</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginTop: '1em' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ marginTop: '1em' }}>
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ marginTop: '1em' }}
          >
            Đăng nhập
          </Button>
        </form>
        <ToastContainer />
      </Box>
    </Zoom>
  );
}

export default Login;