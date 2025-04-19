// import React from 'react';
// import { Card as MuiCard, CardContent, Typography, Box, IconButton } from '@mui/material';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';

// function Card({ card, columnId, boardId }) {
//   const navigate = useNavigate();
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
//     id: card._id,
//     data: { ...card },
//   });

//   const dndKitCardStyles = {
//     transform: CSS.Translate.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : undefined,
//     border: isDragging ? '1px solid #2ecc71' : undefined,
//   };

//   return (
//     <MuiCard
//       ref={setNodeRef}
//       style={dndKitCardStyles}
//       {...attributes}
//       {...listeners}
//       sx={{
//         cursor: 'pointer',
//         boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
//         border: '1px solid transparent',
//         '&:hover': { borderColor: (theme) => theme.palette.primary.main },
//       }}
//     >
//       <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography>{card.title}</Typography>
//             <Typography variant="body2" color="textSecondary">
//               {card.description || 'No description'}
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>
//     </MuiCard>
//   );
// }

// export default Card;