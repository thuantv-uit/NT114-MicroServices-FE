import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import {
  Box,
  Button,
  Paper,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';

/**
 * Component for user login
 * @param {Object} props
 * @param {Function} props.setToken - Function to set authentication token
 * @returns {JSX.Element}
 */
const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const initialValues = { email: '', password: '' };
  const fields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <img
            src="https://www.svgrepo.com/show/354463/trello.svg"
            alt="Thunio Logo"
            style={{ width: '30px', height: '30' }}
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Thunio
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Sign in to get started
        </Typography>
        <GenericForm
          initialValues={initialValues}
          validate={(values) => {
            const errors = validateUserForm({ ...values, username: 'dummy' });
            return { email: errors.email, password: errors.password };
          }}
          onSubmit={async (values) => {
            const { token } = await loginUser(values.email, values.password);
            setToken(token);
            localStorage.setItem('token', token);
            showToast('Login successful!', 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
          }}
          submitLabel="Login"
          cancelPath={null} // Bỏ nút Cancel
          fields={fields}
        />
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Sign in with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Sign in with Facebook
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href="/register" variant="body2" sx={{ color: 'primary.main' }}>
            Don't have an account? Sign up required
          </Link>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            NT114, Web Application for Creating Timelines
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/" variant="body2" sx={{ color: 'primary.main' }}>
              Home
            </Link>
            <Link href="/about" variant="body2" sx={{ color: 'primary.main' }}>
              About Us
            </Link>
            {/* <Link href="/contact" variant="body2" sx={{ color: 'primary.main' }}>
              Contact
            </Link> */}
            <Link href="/privacy" variant="body2" sx={{ color: 'primary.main' }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;