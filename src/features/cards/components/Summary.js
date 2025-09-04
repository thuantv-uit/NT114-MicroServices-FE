import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // Framer Motion cho animation
import { Box, Typography, Card, CardContent } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchCardsByBoard } from '../services/cardService'; // Đường dẫn có thể cần điều chỉnh

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

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Đang tải...</Typography>;
  if (error) return <Typography sx={{ textAlign: 'center', mt: 4 }} color="error">{error}</Typography>;

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

  // Tạo dữ liệu cho PieChart: Mỗi nhóm là một slice với value = totalProcess
  const pieData = Object.entries(groupedData).map(([level, { totalProcess, count, color }], index) => ({
    id: index,
    value: totalProcess,
    label: `${level} (${count} card)`,
    color,
    count, // Lưu count để sử dụng trong tooltip
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
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            color: '#172B4D',
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2.25rem' },
          }}
        >
          Summary
        </Typography>
        <Card
          sx={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {totalCards > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Biểu đồ PieChart */}
                <Box sx={{ position: 'relative', flex: 1, minWidth: { xs: 200, md: 300 } }}>
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 80, // Tăng innerRadius để tạo không gian lớn hơn cho số lượng card
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                    ]}
                    height={250}
                    width={300}
                    sx={{ mx: 'auto' }}
                    slotProps={{
                      legend: { hidden: true }, // Ẩn legend mặc định
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
                {/* Chú thích (legend) */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Chú thích
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {progressLegend.map((item) => (
                      <motion.div
                        key={item.label}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: item.color,
                              borderRadius: '4px',
                            }}
                          />
                          <Typography variant="body2">{item.label}</Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                Không có card để hiển thị.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Summary;