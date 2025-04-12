// src/features/users/components/Register.js
import React from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { registerUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';

const Register = () => {
  const initialValues = { username: '', email: '', password: '' };
  const validate = (values) => {
    const errors = {};
    // Kiểm tra username
    if (!values.username) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    // Kiểm tra email
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    // Kiểm tra password
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      await registerUser(values.username, values.email, values.password);
      showToast('Registration successful! Please login.', 'success');
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Unable to connect to server User', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={values.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;