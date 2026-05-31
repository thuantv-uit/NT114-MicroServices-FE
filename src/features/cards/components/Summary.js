import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts';
import { fetchCardsByBoard } from '../services/cardService';
import '../styles/summary.css';

const getProgressLevelAndColor = (p) => {
  if (p < 12.5) return { level: '0%',   color: '#E53E3E' };
  if (p < 37.5) return { level: '25%',  color: '#ED8936' };
  if (p < 62.5) return { level: '50%',  color: '#D69E2E' };
  if (p < 87.5) return { level: '75%',  color: '#3B82F6' };
  return             { level: '100%', color: '#38A169' };
};

const LEGEND = [
  { label: '100% — Completed',   color: '#38A169', barWidth: 100 },
  { label: '75% — Almost done',  color: '#3B82F6', barWidth: 75  },
  { label: '50% — Halfway',      color: '#D69E2E', barWidth: 50  },
  { label: '25% — Low progress', color: '#ED8936', barWidth: 25  },
  { label: '0% — Not started',   color: '#E53E3E', barWidth: 2   },
];

const Summary = ({ token }) => {
  const { boardId } = useParams();
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchCardsByBoard(boardId)
      .then(setCards)
      .catch(() => setError('Failed to load cards'))
      .finally(() => setLoading(false));
  }, [boardId]);

  if (loading) return <div className="summary-page"><p className="summary-empty">Loading…</p></div>;
  if (error)   return <div className="summary-page"><p style={{ color: '#E53E3E', textAlign: 'center' }}>{error}</p></div>;

  // ── Grouped by progress level ────────────────────────────────
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

  // ── Derived stats ─────────────────────────────────────────────
  const total     = cards.length;
  const completed = cards.filter(c => c.process >= 87.5).length;
  const inProgress= cards.filter(c => c.process > 12.5 && c.process < 87.5).length;
  const overdue   = cards.filter(c => c.deadline && new Date(c.deadline) < new Date() && c.process < 87.5);
  const avgProgress = total > 0
    ? Math.round(cards.reduce((s, c) => s + (c.process || 0), 0) / total)
    : 0;

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
            {/* ── Stat cards ── */}
            <div className="summary-stat-row">
              {[
                { n: total,       label: 'Total Cards',  color: '#1A202C', trend: null },
                { n: completed,   label: 'Completed',    color: '#38A169', trend: '↑ 2 today' },
                { n: inProgress,  label: 'In Progress',  color: '#3B5BDB', trend: null },
                { n: overdue.length, label: 'Overdue',   color: '#E53E3E', trend: overdue.length > 0 ? `${overdue.length} need attention` : 'All on track' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <div className="summary-stat-card">
                    <div className="summary-stat-card__num" style={{ color: s.color }}>{s.n}</div>
                    <div className="summary-stat-card__label">{s.label}</div>
                    {s.trend && <div className="summary-stat-card__trend" style={{ color: s.color }}>{s.trend}</div>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Main content ── */}
            <div className="summary-main-grid">

              {/* Progress breakdown */}
              <div className="summary-chart-card">
                <p className="summary-card-title">Progress Breakdown</p>
                {LEGEND.map((item) => {
                  const grp = grouped[item.label.split(' — ')[0]];
                  const count = grp?.count || 0;
                  return (
                    <div className="summary-prog-item" key={item.label}>
                      <div className="summary-prog-label">{item.label.split(' — ')[1]}</div>
                      <div className="summary-prog-bar-wrap">
                        <div className="summary-prog-bar" style={{ width: `${item.barWidth}%`, background: item.color }} />
                      </div>
                      <div className="summary-prog-val">{item.label.split(' — ')[0]}</div>
                      <div className="summary-prog-count">{count} card{count !== 1 ? 's' : ''}</div>
                    </div>
                  );
                })}
                <div className="summary-legend">
                  {LEGEND.map(item => (
                    <motion.span key={item.label} whileHover={{ scale: 1.04 }}
                      className="summary-legend-chip" style={{ background: item.color }}>
                      {item.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="summary-right-col">

                {/* Avg progress */}
                <div className="summary-chart-card summary-avg-card">
                  <p className="summary-card-title">Avg. Progress</p>
                  <div className="summary-avg-num">{avgProgress}%</div>
                  <p className="summary-avg-sub">Across all {total} cards</p>
                  <div className="summary-prog-bar-wrap" style={{ marginTop: 12 }}>
                    <div className="summary-prog-bar" style={{
                      width: `${avgProgress}%`,
                      background: avgProgress >= 75 ? '#38A169' : avgProgress >= 50 ? '#D69E2E' : '#E53E3E',
                    }} />
                  </div>
                </div>

                {/* Pie chart */}
                <div className="summary-chart-card">
                  <p className="summary-card-title">Distribution</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                      series={[{
                        data: pieData,
                        innerRadius: 55, outerRadius: 90,
                        paddingAngle: 3, cornerRadius: 6,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                      }]}
                      height={200} width={220}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  </div>
                </div>

                {/* Overdue */}
                {overdue.length > 0 && (
                  <div className="summary-chart-card">
                    <p className="summary-card-title summary-card-title--danger">Overdue Cards</p>
                    {overdue.slice(0, 3).map((card, i) => (
                      <div key={i} className="summary-overdue-item">
                        <div className="summary-overdue-title">{card.title}</div>
                        <div className="summary-overdue-date">
                          Due {new Date(card.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    ))}
                    {overdue.length > 3 && (
                      <p style={{ fontSize: 12, color: '#9AA5B4', marginTop: 8 }}>+{overdue.length - 3} more</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Summary;