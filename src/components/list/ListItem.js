import { useState } from 'react';
import { Paper, Typography, Button, TextField, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ListItem({ list, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleUpdate = () => {
    onUpdate(list._id, title);
    setIsEditing(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        {isEditing ? (
          <>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{ mr: 1 }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">{list.title}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ mt: 1, mr: 1 }}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onDelete(list._id)}
              sx={{ mt: 1 }}
            >
              Xóa
            </Button>
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
}

export default ListItem;