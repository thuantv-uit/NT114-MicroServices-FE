import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts';
import { fetchCardsByBoard } from '../services/cardService';
import '../styles/card.css';

const getProgressLevelAndColor = (p) => {
  if (p < 12.5) return { level: '0%',   color: '#E53E3E' };
  if (p < 37.5) return { level: '25%',  color: '#ED8936' };
  if (p < 62.5) return { level: '50%',  color: '#D69E2E' };
  if (p < 87.5) return { level: '75%',  color: '#3B82F6' };
  return             { level: '100%', color: '#38A169' };
};

const LEGEND = [
  { label: '0% — Not started',     color: '#E53E3E' },
  { label: '25% — Low progress',   color: '#ED8936' },
  { label: '50% — Halfway',        color: '#D69E2E' },
  { label: '75% — Almost done',    color: '#3B82F6' },
  { label: '100% — Completed',     color: '#38A169' },
];

const Summary = ({ token }) => {
  const { boardId } = useParams();
  const [cards, setCards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetchCardsByBoard(boardId)
      .then(setCards)
      .catch(() => setError('Failed to load cards'))
      .finally(() => setLoading(false));
  }, [boardId]);

  if (loading) return <div className="summary-page"><p className="summary-empty">Loading…</p></div>;
  if (error)   return <div className="summary-page"><p style={{ color: '#E53E3E', textAlign: 'center' }}>{error}</p></div>;

  const grouped = cards.reduce((acc, card) => {
    const { level, color } = getProgressLevelAndColor(card.process);
    if (!acc[level]) acc[level] = { total: 0, count: 0, color };
    acc[level].total += card.process;
    acc[level].count += 1;
    return acc;
  }, {});

  const pieData = Object.entries(grouped).map(([level, { total, count, color }], i) => ({
    id: i, value: total, label: `${level} (${count})`, color, count,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="summary-page">
        <h1 className="summary-page__title">Progress Overview</h1>
        <p className="summary-page__subtitle">View your work progress through charts and statistics.</p>

        {cards.length === 0 ? (
          <div className="summary-empty">
            <div className="summary-empty__icon">📊</div>
            No cards to display yet.
          </div>
        ) : (
          <>
            {/* Total cards stat */}
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="summary-stat-card">
                <div className="summary-stat-card__num">{cards.length}</div>
                <div className="summary-stat-card__label">Total cards</div>
              </div>
            </motion.div>

            {/* Chart + legend */}
            <div className="summary-chart-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto' }}>
                  <PieChart
                    series={[{
                      data: pieData,
                      innerRadius: 70, outerRadius: 110,
                      paddingAngle: 3, cornerRadius: 6,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                    }]}
                    height={260} width={300}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 15, color: '#1A202C', marginBottom: 12 }}>Legend</p>
                  <div className="summary-legend">
                    {LEGEND.map((item) => (
                      <motion.span key={item.label}
                        whileHover={{ scale: 1.04 }}
                        className="summary-legend-chip"
                        style={{ background: item.color }}
                      >
                        {item.label}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Summary;