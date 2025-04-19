import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import ColumnMenu from './ColumnMenu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import CardList from '../../cards/components/CardList';

function Column({ column, boardId, token, onRefresh }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(100vh - ${theme.spacing(5)})`,
        }}
      >
        {/* Column Header */}
        <Box
          sx={{
            height: '60px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{column.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColumnMenu
              column={column}
              boardId={boardId}
              token={token}
              onEdit={() => navigate(`/columns/${column._id}/edit`, { state: { title: column.title, boardId } })}
              onDelete={() => navigate(`/columns/${column._id}/delete`, { state: { boardId } })}
              onAddCard={() => navigate(`/columns/${column._id}/cards/create`, { state: { boardId } })}
              onRefresh={onRefresh}
            />
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: 'pointer' }} {...listeners} />
            </Tooltip>
          </Box>
        </Box>
        {/* Card List */}
        <CardList columnId={column._id} boardId={boardId} token={token} onRefresh={onRefresh} />
      </Box>
    </div>
  );
}

export default Column;
// import { Box, Typography, Tooltip, Button, TextField, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import CardList from '../../cards/components/CardList';
// import DragHandleIcon from '@mui/icons-material/DragHandle';
// import AddCardIcon from '@mui/icons-material/AddCard';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCut from '@mui/icons-material/ContentCut';
// import ContentCopy from '@mui/icons-material/ContentCopy';
// import ContentPaste from '@mui/icons-material/ContentPaste';
// import Cloud from '@mui/icons-material/Cloud';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import { useConfirm } from 'material-ui-confirm';
// import { deleteColumn, updateColumn, updateBoardColumnOrder } from '../services/columnService';
// import { createCard } from '../../cards/services/cardService';
// import { fetchBoard } from '../../boards/services/boardService';

// function Column({ column, boardId, token, onRefresh }) {
//   const navigate = useNavigate();
//   const confirmDeleteColumn = useConfirm();

//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
//     id: column._id,
//     data: { ...column },
//   });

//   const dndKitColumnStyles = {
//     transform: CSS.Translate.toString(transform),
//     transition,
//     height: '100%',
//     opacity: isDragging ? 0.5 : undefined,
//   };

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const [openNewCardForm, setOpenNewCardForm] = useState(false);
//   const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

//   const [newCardTitle, setNewCardTitle] = useState('');
//   const [newCardDescription, setNewCardDescription] = useState('');

//   const addNewCard = async () => {
//     if (!newCardTitle) {
//       toast.error('Please enter Card Title!', { position: 'bottom-right' });
//       return;
//     }

//     try {
//       const createdCard = await createCard(token, newCardTitle, newCardDescription, column._id);
//       const newCardOrderIds = [...(column.cardOrderIds || []), createdCard._id];
//       await updateColumn(token, column._id, column.title, newCardOrderIds);

//       onRefresh();
//       toggleOpenNewCardForm();
//       setNewCardTitle('');
//       setNewCardDescription('');
//     } catch (err) {
//       toast.error(err.message || 'Failed to create card');
//     }
//   };

//   const handleDeleteColumn = () => {
//     confirmDeleteColumn({
//       title: 'Delete Column?',
//       description: 'This action will permanently delete your Column and its Cards! Are you sure?',
//       confirmationText: 'Confirm',
//       cancellationText: 'Cancel',
//     })
//       .then(async () => {
//         await deleteColumn(token, column._id);
//         const board = await fetchBoard(token, boardId);
//         const newColumnOrderIds = board.columnOrderIds.filter(id => id !== column._id);
//         await updateBoardColumnOrder(token, boardId, newColumnOrderIds);
//         toast.success('Column deleted successfully!');
//         onRefresh();
//       })
//       .catch(err => {
//         toast.error(err.response?.data.message || 'Failed to delete column');
//       });
//   };

//   return (
//     <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
//       <Box
//         {...listeners}
//         sx={{
//           minWidth: '300px',
//           maxWidth: '300px',
//           bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
//           ml: 2,
//           borderRadius: '6px',
//           height: 'fit-content',
//           maxHeight: (theme) => `calc(100vh - ${theme.spacing(5)})`,
//         }}
//       >
//         {/* Column Header */}
//         <Box
//           sx={{
//             height: '60px',
//             p: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//           }}
//         >
//           <Typography variant="h6">{column.title}</Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Tooltip title="More options">
//               <ExpandMoreIcon
//                 sx={{ color: 'text.primary', cursor: 'pointer' }}
//                 id="basic-column-dropdown"
//                 aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? 'true' : undefined}
//                 onClick={handleClick}
//               />
//             </Tooltip>
//             <Menu
//               id="basic-menu-column-dropdown"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               onClick={handleClose}
//               MenuListProps={{
//                 'aria-labelledby': 'basic-column-dropdown',
//               }}
//             >
//               <MenuItem
//                 onClick={toggleOpenNewCardForm}
//                 sx={{
//                   '&:hover': {
//                     color: 'success.light',
//                     '& .add-card-icon': { color: 'success.light' },
//                   },
//                 }}
//               >
//                 <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
//                 <ListItemText>Add new card</ListItemText>
//               </MenuItem>
//               <MenuItem>
//                 <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
//                 <ListItemText>Cut</ListItemText>
//               </MenuItem>
//               <MenuItem>
//                 <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
//                 <ListItemText>Copy</ListItemText>
//               </MenuItem>
//               <MenuItem>
//                 <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
//                 <ListItemText>Paste</ListItemText>
//               </MenuItem>
//               <Divider />
//               <MenuItem
//                 onClick={handleDeleteColumn}
//                 sx={{
//                   '&:hover': {
//                     color: 'warning.dark',
//                     '& .delete-forever-icon': { color: 'warning.dark' },
//                   },
//                 }}
//               >
//                 <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
//                 <ListItemText>Delete this column</ListItemText>
//               </MenuItem>
//               <MenuItem>
//                 <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
//                 <ListItemText>Archive this column</ListItemText>
//               </MenuItem>
//             </Menu>
//             <Tooltip title="Drag to move">
//               <DragHandleIcon sx={{ cursor: 'pointer' }} />
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* Card List */}
//         <Box sx={{ p: 2 }}>
//           <CardList column={column} token={token} boardId={boardId} onRefresh={onRefresh} />
//         </Box>

//         {/* Column Footer */}
//         <Box sx={{ p: 2 }}>
//           {!openNewCardForm ? (
//             <Box
//               sx={{
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
//                 Add new card
//               </Button>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//               }}
//             >
//               <TextField
//                 label="Card Title"
//                 type="text"
//                 size="small"
//                 variant="outlined"
//                 autoFocus
//                 data-no-dnd="true"
//                 value={newCardTitle}
//                 onChange={(e) => setNewCardTitle(e.target.value)}
//                 sx={{
//                   '& label': { color: 'text.primary' },
//                   '& input': {
//                     color: (theme) => theme.palette.primary.main,
//                     bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
//                   },
//                   '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                     '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                     '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//               <TextField
//                 label="Description (optional)"
//                 type="text"
//                 size="small"
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 data-no-dnd="true"
//                 value={newCardDescription}
//                 onChange={(e) => setNewCardDescription(e.target.value)}
//                 sx={{
//                   '& label': { color: 'text.primary' },
//                   '& input': {
//                     color: (theme) => theme.palette.primary.main,
//                     bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
//                   },
//                   '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                     '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                     '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Button
//                   onClick={addNewCard}
//                   variant="contained"
//                   color="success"
//                   size="small"
//                   sx={{
//                     boxShadow: 'none',
//                     border: '0.5px solid',
//                     borderColor: (theme) => theme.palette.success.main,
//                     '&:hover': { bgcolor: (theme) => theme.palette.success.main },
//                   }}
//                 >
//                   Add
//                 </Button>
//                 <CloseIcon
//                   fontSize="small"
//                   sx={{
//                     color: (theme) => theme.palette.warning.light,
//                     cursor: 'pointer',
//                   }}
//                   onClick={toggleOpenNewCardForm}
//                 />
//               </Box>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </div>
//   );
// }

// export default Column;