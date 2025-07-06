import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
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
 * Component for user registration
 * @returns {JSX.Element}
 */
const Register = () => {
  const navigate = useNavigate();
  const initialValues = { username: '', email: '', password: '', confirmPassword: '' };
  const fields = [
    { name: 'username', label: 'Username', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
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
          Sign up to get started
        </Typography>
        <GenericForm
          initialValues={initialValues}
          validate={(values) => {
            const errors = validateUserForm({ ...values });
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = 'Passwords do not match';
            }
            return {
              username: errors.username,
              email: errors.email,
              password: errors.password,
              confirmPassword: errors.confirmPassword,
            };
          }}
          onSubmit={async (values) => {
            await registerUser(values.username, values.email, values.password);
            showToast('Registration successful! Please login.', 'success');
            setTimeout(() => navigate('/login'), 2000);
          }}
          submitLabel="Register"
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
            Sign up with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Sign up with Facebook
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href="/login" variant="body2" sx={{ color: 'primary.main' }}>
            Already have an account? Sign in
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

export default Register;