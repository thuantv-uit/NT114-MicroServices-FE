import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

/**
 * Generic form container for consistent layout
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {React.ReactNode} props.children - Form content
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element}
 */
const FormContainer = ({ title, children, loading }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        {children}
      </Paper>
    </Box>
  );
};

export default FormContainer;