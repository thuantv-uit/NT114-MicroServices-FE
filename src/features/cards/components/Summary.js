import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Component to display the Summary page
 * @returns {JSX.Element}
 */
const Summary = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ color: '#172B4D' }}>
        Summary
      </Typography>
    </Box>
  );
};

export default Summary;