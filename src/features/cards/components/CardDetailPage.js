// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { fetchCards } from '../services/cardService';
// import { showToast } from '../../../utils/toastUtils';
// import { Box, Typography, Avatar, Button, Modal } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import CardDescriptionMdEditor from './CardDescriptionMdEditor';
// import { formatDate } from './CardList';
// import { getUserById } from '../../users/services/userService';
// import MDEditor from '@uiw/react-md-editor';

// const CardDetailPage = ({ token }) => {
//   const { cardId } = useParams();
//   const navigate = useNavigate();
//   const [card, setCard] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadCard = async () => {
//       if (!token) {
//         showToast('Authentication token is missing', 'error');
//         navigate('/boards');
//         return;
//       }
//       setLoading(true);
//       try {
//         const cards = await fetchCards();
//         const foundCard = cards.find((c) => c._id === cardId);
//         if (foundCard) {
//           setCard(foundCard);
//           const userData = await getUserById(foundCard.userId);
//           setUser(userData);
//         } else {
//           showToast('Card not found', 'error');
//           navigate('/boards');
//         }
//       } catch (err) {
//         showToast(err.message || 'Failed to load card', 'error');
//         navigate('/boards');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadCard();
//   }, [cardId, token, navigate]);

//   const handleClose = () => {
//     navigate(`/boards/${card?.boardId}`);
//   };

//   if (loading || !card) {
//     return <Typography>Đang tải...</Typography>;
//   }

//   return (
//     <Modal open={true} onClose={handleClose}>
//       <Box
//         sx={{
//           position: 'relative',
//           width: 800,
//           maxWidth: '90%',
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           borderRadius: 2,
//           p: 4,
//           m: 'auto',
//           mt: 4,
//           maxHeight: '90vh',
//           overflowY: 'auto',
//         }}
//       >
//         <CloseIcon
//           sx={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer' }}
//           onClick={handleClose}
//         />
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           {card.title}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Typography variant="body2" sx={{ mr: 2 }}>
//             Cập nhật: {formatDate(card.updatedAt)}
//           </Typography>
//           {user && (
//             <Avatar
//               src={user.avatar || 'https://via.placeholder.com/24'}
//               alt={user.username}
//               sx={{ width: 24, height: 24 }}
//             />
//           )}
//         </Box>
//         {card.image && (
//           <Avatar
//             src={card.image}
//             alt={card.title}
//             variant="square"
//             sx={{ width: '100%', height: 200, mb: 2, borderRadius: 1 }}
//           />
//         )}
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           Mô tả
//         </Typography>
//         <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
//           <MDEditor.Markdown
//             source={card.description || 'Không có mô tả'}
//             style={{ background: 'transparent' }}
//           />
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default CardDetailPage;