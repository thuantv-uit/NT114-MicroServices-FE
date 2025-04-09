// import React, { useState, useEffect } from 'react';
// import { fetchColumns } from '../services/columnService';
// import { toast } from 'react-toastify';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   CircularProgress,
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import CardList from '../../cards/components/CardList';
// import { useNavigate } from 'react-router-dom';

// const ColumnList = ({ boardId, token }) => {
//   const navigate = useNavigate();
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedColumnId, setSelectedColumnId] = useState(null);

//   const loadColumns = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchColumns(token, boardId);
//       setColumns(data);
//     } catch (err) {
//       toast.error(err.response?.data.message || 'Failed to fetch columns');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadColumns();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [boardId, token]);

//   const handleMenuClick = (event, columnId) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedColumnId(columnId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedColumnId(null);
//   };

//   const handleMenuItemClick = (path) => {
//     navigate(path);
//     handleMenuClose();
//   };

//   return (
//     <Box sx={{ my: 4 }}>
//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2 }}>
//           <Box sx={{ display: 'inline-flex', gap: 2 }}>
//             {columns.length > 0 ? (
//               columns.map((column) => (
//                 <Card
//                   key={column._id}
//                   sx={{
//                     width: 250,
//                     minHeight: 300,
//                     maxHeight: 400,
//                     overflowY: 'auto',
//                     display: 'inline-block',
//                     verticalAlign: 'top',
//                   }}
//                 >
//                   <CardContent>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                       <Typography variant="h6">{column.title}</Typography>
//                       <IconButton
//                         aria-label="more"
//                         onClick={(event) => handleMenuClick(event, column._id)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     </Box>
//                     <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//                       Position: {column.position}
//                     </Typography>
//                     <CardList columnId={column._id} token={token} />
//                     <Menu
//                       anchorEl={anchorEl}
//                       open={Boolean(anchorEl) && selectedColumnId === column._id}
//                       onClose={handleMenuClose}
//                     >
//                       <MenuItem
//                         onClick={() =>
//                           handleMenuItemClick(
//                             `/columns/${column._id}/edit?title=${encodeURIComponent(column.title)}&position=${column.position}&boardId=${boardId}`
//                           )
//                         }
//                       >
//                         Edit Column
//                       </MenuItem>
//                       <MenuItem
//                         onClick={() =>
//                           handleMenuItemClick(`/columns/${column._id}/delete?boardId=${boardId}`)
//                         }
//                       >
//                         Delete Column
//                       </MenuItem>
//                       <MenuItem
//                         onClick={() =>
//                           handleMenuItemClick(`/columns/${column._id}/cards/create?boardId=${boardId}`)
//                         }
//                       >
//                         Add Card
//                       </MenuItem>
//                     </Menu>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <Typography>No columns found.</Typography>
//             )}
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ColumnList;

// src/features/columns/components/ColumnList.js
import React, { useState, useEffect } from 'react';
import { fetchColumns } from '../services/columnService';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CardList from '../../cards/components/CardList';
import { useNavigate } from 'react-router-dom';

const ColumnList = ({ boardId, token }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const data = await fetchColumns(token, boardId);
      setColumns(data);
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, token]);

  const handleMenuClick = (event, columnId) => {
    setAnchorEl(event.currentTarget);
    setSelectedColumnId(columnId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedColumnId(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ my: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            pb: 2,
            width: '100%', // Chiếm toàn bộ chiều rộng của container cha
            mx: 'auto', // Căn giữa
          }}
        >
          <Box sx={{ display: 'inline-flex', gap: 2 }}>
            {columns.length > 0 ? (
              columns.map((column) => (
                <Card
                  key={column._id}
                  sx={{
                    width: 250,
                    minHeight: 300,
                    maxHeight: 400,
                    overflowY: 'auto',
                    display: 'inline-block',
                    verticalAlign: 'top',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{column.title}</Typography>
                      <IconButton
                        aria-label="more"
                        onClick={(event) => handleMenuClick(event, column._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Position: {column.position}
                    </Typography>
                    <CardList columnId={column._id} token={token} />
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedColumnId === column._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() =>
                          handleMenuItemClick(
                            `/columns/${column._id}/edit?title=${encodeURIComponent(column.title)}&position=${column.position}&boardId=${boardId}`
                          )
                        }
                      >
                        Edit Column
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleMenuItemClick(`/columns/${column._id}/delete?boardId=${boardId}`)
                        }
                      >
                        Delete Column
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleMenuItemClick(`/columns/${column._id}/cards/create?boardId=${boardId}`)
                        }
                      >
                        Add Card
                      </MenuItem>
                    </Menu>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No columns found.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ColumnList;