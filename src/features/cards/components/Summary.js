import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { fetchCardsByBoard } from '../services/cardService';

/**
 * Component to display the Summary page with modern UI
 * @param {Object} props - Component props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const Summary = ({ token }) => {
  const { boardId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchCardsByBoard(boardId);
        setCards(data);
      } catch (err) {
        setError('Không thể tải dữ liệu cards');
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [boardId]);

  // Hàm xác định mức độ và màu sắc dựa trên process của từng card
  const getProgressLevelAndColor = (process) => {
    if (process < 12.5) return { level: '0%', color: '#d32f2f' };
    if (process < 37.5) return { level: '25%', color: '#f57c00' };
    if (process < 62.5) return { level: '50%', color: '#fbc02d' };
    if (process < 87.5) return { level: '75%', color: '#0288d1' };
    return { level: '100%', color: '#388e3c' };
  };

  if (loading) return (
    <Typography sx={{ textAlign: 'center', mt: 4, color: '#172B4D' }}>
      Đang tải...
    </Typography>
  );
  if (error) return (
    <Typography sx={{ textAlign: 'center', mt: 4 }} color="error">
      {error}
    </Typography>
  );

  const totalCards = cards.length;

  // Nhóm cards theo mức process và tính tổng process, số lượng cho từng nhóm
  const groupedData = cards.reduce((acc, card) => {
    const { level, color } = getProgressLevelAndColor(card.process);
    if (!acc[level]) {
      acc[level] = { totalProcess: 0, count: 0, color };
    }
    acc[level].totalProcess += card.process;
    acc[level].count += 1;
    return acc;
  }, {});

  // Tạo dữ liệu cho PieChart
  const pieData = Object.entries(groupedData).map(([level, { totalProcess, count, color }], index) => ({
    id: index,
    value: totalProcess,
    label: `${level} (${count} card)`,
    color,
    count,
  }));

  // Danh sách các mốc và màu sắc cho chú thích
  const progressLegend = [
    { label: '0% (Chưa hoàn thành)', color: '#d32f2f' },
    { label: '25% (Tiến độ thấp)', color: '#f57c00' },
    { label: '50% (Tiến độ trung bình)', color: '#fbc02d' },
    { label: '75% (Gần hoàn thành)', color: '#0288d1' },
    { label: '100% (Hoàn thành)', color: '#388e3c' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography
          variant="h3"
          sx={{
            color: '#172B4D',
            fontWeight: 'bold',
            mb: 2,
            textAlign: 'center',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            background: 'linear-gradient(90deg, #172B4D, #0288d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tổng quan tiến độ
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: '#5E6C84',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Xem tiến độ công việc của bạn qua biểu đồ và thống kê
        </Typography>
        <Grid container spacing={3}>
          {/* Tổng số card */}
          {totalCards > 0 && (
            <Grid item xs={12}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  sx={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                    textAlign: 'center',
                    p: 2,
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.2s ease',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#172B4D' }}>
                      {totalCards}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#5E6C84' }}>
                      Tổng số công việc
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
          {/* Biểu đồ và chú thích */}
          {totalCards > 0 ? (
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Grid container spacing={3}>
                    {/* Biểu đồ PieChart */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ position: 'relative', minWidth: { xs: 250, md: 350 } }}>
                        <PieChart
                          series={[
                            {
                              data: pieData,
                              innerRadius: 90,
                              outerRadius: 120,
                              paddingAngle: 3,
                              cornerRadius: 8,
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                          ]}
                          height={300}
                          width={350}
                          sx={{
                            mx: 'auto',
                            '& .MuiChartsSurface-root': {
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              borderRadius: '8px',
                            },
                          }}
                          slotProps={{
                            legend: { hidden: true },
                            tooltip: {
                              trigger: 'item',
                              content: ({ itemData }) =>
                                itemData ? (
                                  <Box
                                    sx={{
                                      p: 1,
                                      bgcolor: 'background.paper',
                                      borderRadius: 1,
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                  >
                                    <Typography variant="body2">{itemData.label}</Typography>
                                  </Box>
                                ) : null,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    {/* Chú thích */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#172B4D' }}>
                        Chú thích
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: 1 }}>
                        {progressLegend.map((item) => (
                          <motion.div
                            key={item.label}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Chip
                              label={item.label}
                              sx={{
                                bgcolor: item.color,
                                color: '#fff',
                                fontWeight: 'medium',
                                '&:hover': {
                                  bgcolor: item.color,
                                  opacity: 0.9,
                                },
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: '#5E6C84' }}>
                Không có công việc để hiển thị.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Summary;