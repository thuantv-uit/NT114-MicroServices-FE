import { useState } from 'react';
import {
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { AddCircleOutline, Clear } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function CreateListForm({ onCreate }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title);
      setTitle('');
    }
  };

  const handleClear = () => {
    setTitle('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 400,
          margin: '20px auto',
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Tạo List
        </Typography>
        
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề list"
            variant="outlined"
            fullWidth
            required
            InputProps={{
              endAdornment: title && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear input"
                    onClick={handleClear}
                    edge="end"
                    size="small"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            disabled={!title.trim()}
            sx={{
              alignSelf: 'flex-end',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              },
            }}
          >
            Tạo List
          </Button>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default CreateListForm;