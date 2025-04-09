// // src/features/columns/components/DeleteColumn.js
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { deleteColumn } from '../services/columnService';
// import { toast } from 'react-toastify';
// import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';

// const DeleteColumn = ({ token }) => { // Thêm token vào props
//   const { columnId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleDelete = async () => {
//     setMessage('');
//     setLoading(true);
//     try {
//       await deleteColumn(token, columnId); // Sử dụng token từ props
//       setMessage('Column deleted successfully!');
//       toast.success('Column deleted successfully!');
//       setTimeout(() => navigate('/boards'), 2000); // Điều hướng về danh sách boards
//     } catch (err) {
//       setMessage(err.response?.data.message || 'Failed to delete column');
//       toast.error(err.response?.data.message || 'Failed to delete column');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Delete Column
//       </Typography>

//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {message && (
//         <Typography color={message.includes('successfully') ? 'success.main' : 'error'} sx={{ mb: 2 }}>
//           {message}
//         </Typography>
//       )}

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="body1" gutterBottom>
//           Are you sure you want to delete this column? This action cannot be undone.
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDelete}
//             disabled={loading}
//             sx={{ flex: 1 }}
//           >
//             Delete Column
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => navigate(`/boards`)} // Điều hướng về danh sách boards
//             sx={{ flex: 1 }}
//           >
//             Cancel
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default DeleteColumn;

// src/features/columns/components/DeleteColumn.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteColumn } from '../services/columnService';
import { toast } from 'react-toastify';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';

const DeleteColumn = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const boardId = query.get('boardId') || '';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    setMessage('');
    setLoading(true);
    try {
      await deleteColumn(token, columnId);
      setMessage('Column deleted successfully!');
      toast.success('Column deleted successfully!');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000); // Điều hướng về BoardDetail
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to delete column');
      toast.error(err.response?.data.message || 'Failed to delete column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Delete Column
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {message && (
        <Typography color={message.includes('successfully') ? 'success.main' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this column? This action cannot be undone.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Delete Column
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(`/boards/${boardId}`)} // Điều hướng về BoardDetail
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeleteColumn;