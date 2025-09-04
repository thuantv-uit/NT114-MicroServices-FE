import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, List, ListItem, ListSubheader, Divider, LinearProgress } from '@mui/material';
import { format, isBefore, startOfDay } from 'date-fns';
import vi from 'date-fns/locale/vi';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchCardsByBoard } from '../services/cardService'; // Đường dẫn có thể cần điều chỉnh

/**
 * Component to display the Calendar page as a modern Todo List
 * @param {Object} props - Component props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const Calendar = ({ token }) => {
  const { boardId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        if (!boardId) {
          throw new Error('Board ID không hợp lệ');
        }
        const data = await fetchCardsByBoard(boardId);
        setCards(data);
      } catch (err) {
        setError('Không thể tải dữ liệu cards: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [boardId]);

  // Nhóm card theo ngày deadline và sắp xếp theo thời gian
  const groupedCards = useMemo(() => {
    const map = {};
    cards.forEach((card) => {
      if (card.deadline) {
        const dateKey = format(new Date(card.deadline), 'yyyy-MM-dd');
        if (!map[dateKey]) {
          map[dateKey] = { date: new Date(card.deadline), cards: [] };
        }
        map[dateKey].cards.push(card);
      }
    });
    return Object.entries(map)
      .map(([dateKey, { date, cards }]) => ({ date, cards }))
      .sort((a, b) => a.date - b.date);
  }, [cards]);

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4, color: '#172B4D' }}>Đang tải...</Typography>;
  if (error) return <Typography sx={{ textAlign: 'center', mt: 4 }} color="error">{error}</Typography>;

  // Animation cho các mục Todo
  const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            color: '#172B4D',
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2.25rem' },
            background: 'linear-gradient(90deg, #172B4D, #0288d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Calendar - Todo List
        </Typography>
        <Card
          sx={{
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            overflow: 'hidden',
            bgcolor: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {groupedCards.length > 0 ? (
              <List disablePadding>
                {groupedCards.map(({ date, cards }, index) => {
                  const isOverdue = isBefore(date, startOfDay(new Date()));
                  return (
                    <Box key={index} sx={{ mb: 3 }}>
                      <ListSubheader
                        sx={{
                          bgcolor: 'transparent',
                          color: isOverdue ? '#d32f2f' : '#172B4D',
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', md: '1.2rem' },
                          py: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CalendarTodayIcon sx={{ fontSize: '1.2rem', color: isOverdue ? '#d32f2f' : '#0288d1' }} />
                        {format(date, 'dd/MM/yyyy', { locale: vi })}
                        {isOverdue && (
                          <WarningIcon sx={{ fontSize: '1.2rem', color: '#d32f2f', ml: 1 }} />
                        )}
                      </ListSubheader>
                      <Divider sx={{ mb: 2, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
                      {cards.map((card, cardIndex) => (
                        <ListItem
                          key={card._id}
                          disablePadding
                          component={motion.div}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          custom={cardIndex}
                        >
                          <Card
                            sx={{
                              width: '100%',
                              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
                              borderRadius: '12px',
                              p: 2,
                              mb: 1.5,
                              bgcolor: 'background.default',
                              border: isOverdue ? '1px solid #d32f2f' : '1px solid transparent',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.12)',
                                bgcolor: 'rgba(2, 136, 209, 0.05)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CalendarTodayIcon sx={{ color: '#0288d1', fontSize: '1.2rem' }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 'medium',
                                    color: '#172B4D',
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                  }}
                                >
                                  {card.title || `Card ${card._id}`}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isOverdue ? '#d32f2f' : '#5E6C84',
                                    display: 'block',
                                    mb: 1,
                                  }}
                                >
                                  Deadline: {format(new Date(card.deadline), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" sx={{ color: '#5E6C84' }}>
                                    Tiến độ:
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={card.process || 0}
                                    sx={{
                                      width: 100,
                                      height: 6,
                                      borderRadius: '3px',
                                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: card.process >= 75 ? '#388e3c' : card.process >= 50 ? '#fbc02d' : '#f57c00',
                                      },
                                    }}
                                  />
                                  <Typography variant="caption" sx={{ color: '#172B4D' }}>
                                    {card.process || 0}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </ListItem>
                      ))}
                    </Box>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: '#172B4D' }}>
                Không có card với deadline để hiển thị.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Calendar;