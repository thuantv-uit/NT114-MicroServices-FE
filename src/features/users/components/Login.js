// src/features/users/components/Login.js
import React from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import useForm from '../../../hooks/useForm';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';

const Login = ({ setToken }) => {
  const initialValues = { email: '', password: '' };
  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email is invalid';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const data = await loginUser(values.email, values.password);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      showToast('Login successful!', 'success');
    },
    onError: (err) => {
      showToast(err.response?.data.message || 'Login failed', 'error');
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;