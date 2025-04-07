import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/userApi';
import {
  Box,
  Button,
  Avatar,
  TextField,
  Typography,
  Card as MuiCard,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await registerUser({ username, email, password });
      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <MuiCard sx={{ width: '100%', maxWidth: 380, margin: '6em auto', padding: '1em' }}>
        {/* Header với avatar và icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginBottom: '1em' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockIcon />
          </Avatar>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <span>T</span> {/* Thay thế TrelloIcon bằng chữ "T" */}
          </Avatar>
        </Box>

        {/* Tác giả */}
        <Typography sx={{ textAlign: 'center', color: 'grey.500', marginBottom: '1em' }}>
          Author: Thuan Tran
        </Typography>

        {/* Trường nhập liệu Tên người dùng */}
        <Box sx={{ marginBottom: '1em' }}>
          <TextField
            fullWidth
            label="Tên người dùng"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Trường nhập liệu Email */}
        <Box sx={{ marginBottom: '1em' }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Trường nhập liệu Mật khẩu */}
        <Box sx={{ marginBottom: '1em' }}>
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
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
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Nút đăng ký */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ padding: '0.8em', fontSize: '1em' }}
        >
          Đăng ký
        </Button>

        {/* Liên kết đăng nhập */}
        <Box sx={{ textAlign: 'center', marginTop: '1em' }}>
          <Typography>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'primary.main', textDecoration: 'none' }}>
              Đăng nhập!
            </Link>
          </Typography>
        </Box>
      </MuiCard>
      <ToastContainer />
    </form>
  );
}

export default Register;