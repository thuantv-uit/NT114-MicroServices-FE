// // src/features/columns/components/ColumnEdit.js
// import React, { useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { updateColumn } from '../services/columnService';
// import { toast } from 'react-toastify';
// import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

// const ColumnEdit = ({ token }) => {
//   const { columnId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Lấy dữ liệu từ query string
//   const query = new URLSearchParams(location.search);
//   const initialTitle = query.get('title') || '';
//   const initialPosition = Number(query.get('position')) || 0;
//   const boardId = query.get('boardId') || '';

//   const [title, setTitle] = useState(initialTitle);
//   const [position, setPosition] = useState(initialPosition);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       // eslint-disable-next-line no-unused-vars
//       const updatedColumn = await updateColumn(token, columnId, title, position);
//       setMessage('Column updated successfully!');
//       toast.success('Column updated successfully!');
//       setTimeout(() => navigate(`/boards/${boardId}`), 2000);
//     } catch (err) {
//       setMessage(err.response?.data.message || 'Failed to update column');
//       toast.error(err.response?.data.message || 'Failed to update column');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Edit Column
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
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Column Title"
//             variant="outlined"
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Position"
//             variant="outlined"
//             fullWidth
//             type="number"
//             value={position}
//             onChange={(e) => setPosition(Number(e.target.value))}
//             required
//             sx={{ mb: 2 }}
//           />
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               fullWidth
//             >
//               {loading ? 'Updating...' : 'Update'}
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => navigate(`/boards/${boardId}`)}
//               fullWidth
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default ColumnEdit;

// src/features/columns/components/ColumnEdit.js
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateColumn } from '../services/columnService';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const ColumnEdit = ({ token }) => {
  const { columnId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ query string
  const query = new URLSearchParams(location.search);
  const initialTitle = query.get('title') || '';
  const initialPosition = Number(query.get('position')) || 0;
  const boardId = query.get('boardId') || '';

  const [title, setTitle] = useState(initialTitle);
  const [position, setPosition] = useState(initialPosition);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // eslint-disable-next-line no-unused-vars
      const updatedColumn = await updateColumn(token, columnId, title, position);
      setMessage('Column updated successfully!');
      toast.success('Column updated successfully!');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000); // Điều hướng về BoardDetail
    } catch (err) {
      setMessage(err.response?.data.message || 'Failed to update column');
      toast.error(err.response?.data.message || 'Failed to update column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Edit Column
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Column Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/boards/${boardId}`)} // Điều hướng về BoardDetail
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ColumnEdit;