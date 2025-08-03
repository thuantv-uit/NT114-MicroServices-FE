import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import EditSquareIcon from '@mui/icons-material/EditSquare';

const EditCardHeader = ({ onClose }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: '700', fontSize: '24px' }}>
          <EditSquareIcon></EditSquareIcon>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" disabled>
          <LockIcon />
        </IconButton>
        <IconButton size="small" disabled>
          <WatchLaterIcon />
        </IconButton>
        <IconButton size="small" disabled>
          <ShareIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EditCardHeader;