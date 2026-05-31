import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';
import {
  format, isBefore, startOfDay, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addMonths, subMonths, differenceInDays, isToday,
} from 'date-fns';
import vi from 'date-fns/locale/vi';
import CalendarTodayIcon  from '@mui/icons-material/CalendarToday';
import WarningIcon        from '@mui/icons-material/Warning';
import ArrowBackIosIcon   from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon     from '@mui/icons-material/AccessTime';
import { fetchCardsByBoard } from '../services/cardService';
import '../styles/calendar.css';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const progressColor = (p) => p >= 75 ? '#38A169' : p >= 50 ? '#D69E2E' : '#ED8936';

const daysUntilLabel = (date) => {
  const diff = differenceInDays(new Date(date), startOfDay(new Date()));
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, color: '#E53E3E', bg: '#FFF5F5' };
  if (diff === 0) return { label: 'Due today',  color: '#D97706', bg: '#FFFBEB' };
  if (diff <= 3)  return { label: `${diff}d left`, color: '#D97706', bg: '#FFFBEB' };
  return { label: `${diff}d left`, color: '#38A169', bg: '#F0FFF4' };
};

const Calendar = ({ token }) => {
  const { boardId }  = useParams();
  const [cards,         setCards]    = useState([]);
  const [loading,       setLoading]  = useState(true);
  const [error,         setError]    = useState(null);
  const [currentMonth,  setMonth]    = useState(new Date());
  const [selectedDate,  setSelected] = useState(null);

  useEffect(() => {
    fetchCardsByBoard(boardId)
      .then(setCards)
      .catch((e) => setError('Failed to load cards: ' + e.message))
      .finally(() => setLoading(false));
  }, [boardId]);

  const groupedCards = useMemo(() => {
    const map = {};
    cards.forEach((c) => {
      if (!c.deadline) return;
      const key = format(new Date(c.deadline), 'yyyy-MM-dd');
      if (!map[key]) map[key] = { date: new Date(c.deadline), cards: [] };
      map[key].cards.push(c);
    });
    return Object.values(map).sort((a, b) => a.date - b.date);
  }, [cards]);

  const deadlineDates = useMemo(() =>
    new Set(groupedCards.map((g) => format(g.date, 'yyyy-MM-dd'))), [groupedCards]);

  // ── Upcoming deadlines (next 14 days, not overdue) ────────────
  const upcoming = useMemo(() =>
    cards
      .filter(c => c.deadline && !isBefore(new Date(c.deadline), startOfDay(new Date())))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5),
  [cards]);

  if (loading) return <div className="calendar-page"><p className="cal-empty">Loading…</p></div>;
  if (error)   return <div className="calendar-page"><p style={{ color: '#E53E3E', textAlign: 'center' }}>{error}</p></div>;

  const days     = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startIdx = getDay(startOfMonth(currentMonth));

  const selectedGroup = selectedDate
    ? groupedCards.find((g) => format(g.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="calendar-page">
        <h1 className="calendar-page__title">Calendar</h1>
        <p className="calendar-page__subtitle">Track card deadlines across the month.</p>

        <div className="cal-layout">

          {/* ── Left: mini calendar ── */}
          <div className="cal-left">
            <div className="cal-card">
              <div className="cal-nav">
                <button className="cal-nav__btn" onClick={() => setMonth(m => subMonths(m, 1))}>
                  <ArrowBackIosIcon style={{ fontSize: 13 }} />
                </button>
                <span className="cal-nav__title">
                  {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                </span>
                <button className="cal-nav__btn" onClick={() => setMonth(m => addMonths(m, 1))}>
                  <ArrowForwardIosIcon style={{ fontSize: 13 }} />
                </button>
              </div>

              <div className="cal-grid" style={{ marginBottom: 6 }}>
                {DAY_HEADERS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
              </div>

              <div className="cal-grid">
                {Array.from({ length: startIdx }).map((_, i) => <div key={`e${i}`} />)}
                {days.map((day) => {
                  const key      = format(day, 'yyyy-MM-dd');
                  const has      = deadlineDates.has(key);
                  const isOver   = has && isBefore(day, startOfDay(new Date()));
                  const isSel    = selectedDate && format(selectedDate, 'yyyy-MM-dd') === key;
                  const todayDay = isToday(day);
                  const grp      = groupedCards.find(g => format(g.date, 'yyyy-MM-dd') === key);
                  return (
                    <div
                      key={key}
                      className={[
                        'cal-day',
                        has     ? (isOver ? 'cal-day--overdue' : 'cal-day--has-deadline') : '',
                        isSel   ? 'cal-day--selected' : '',
                        todayDay && !isSel ? 'cal-day--today' : '',
                      ].join(' ')}
                      onClick={has ? () => setSelected(day) : undefined}
                    >
                      {format(day, 'd')}
                      {has && <span className="cal-day-dot" style={{ background: isOver ? '#E53E3E' : '#3B5BDB' }} />}
                      {has && grp && grp.cards.length > 1 && (
                        <span className="cal-day-count">{grp.cards.length}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="cal-legend">
                {[
                  { bg: '#EEF2FF', border: '#3B5BDB', label: 'Has deadline' },
                  { bg: '#FFF5F5', border: '#E53E3E', label: 'Overdue' },
                  { bg: '#3B5BDB', border: '#3B5BDB', label: 'Selected' },
                ].map(l => (
                  <span key={l.label} className="cal-legend-item">
                    <span className="cal-legend-dot" style={{ background: l.bg, border: `1px solid ${l.border}` }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: detail + upcoming ── */}
          <div className="cal-right">

            {/* Selected date detail */}
            {selectedDate ? (
              <div className="cal-card">
                <div className="cal-section-header">
                  <CalendarTodayIcon style={{ fontSize: 16, color: '#3B5BDB' }} />
                  {format(selectedDate, 'dd MMMM yyyy', { locale: vi })}
                  {selectedGroup && isBefore(selectedGroup.date, startOfDay(new Date())) && (
                    <WarningIcon style={{ fontSize: 15, color: '#E53E3E', marginLeft: 4 }} />
                  )}
                  {selectedGroup && (
                    <span className="cal-badge">{selectedGroup.cards.length} card{selectedGroup.cards.length !== 1 ? 's' : ''}</span>
                  )}
                </div>

                {selectedGroup ? selectedGroup.cards.map((card, i) => {
                  const overdue = isBefore(new Date(card.deadline), startOfDay(new Date()));
                  const badge   = daysUntilLabel(card.deadline);
                  return (
                    <motion.div key={card._id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`cal-todo-card${overdue ? ' cal-todo-card--overdue' : ''}`}
                    >
                      <div className="cal-todo-top">
                        <p className="cal-todo-title">{card.title || `Card ${card._id}`}</p>
                        <span className="cal-todo-badge" style={{ background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>
                      <p className={`cal-todo-deadline${overdue ? ' cal-todo-deadline--overdue' : ''}`}>
                        <CalendarTodayIcon style={{ fontSize: 12 }} />
                        {format(new Date(card.deadline), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                      <div className="cal-progress-row">
                        <span>Progress</span>
                        <LinearProgress
                          variant="determinate"
                          value={card.process || 0}
                          sx={{
                            flex: 1, maxWidth: 140, height: 6, borderRadius: 4,
                            background: '#F0F2F5',
                            '& .MuiLinearProgress-bar': { background: progressColor(card.process || 0), borderRadius: 4 },
                          }}
                        />
                        <span style={{ fontWeight: 600, color: '#1A202C' }}>{card.process || 0}%</span>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <p className="cal-empty" style={{ padding: '20px 0' }}>No cards with deadline on this date.</p>
                )}
              </div>
            ) : (
              <div className="cal-card cal-card--hint">
                <CalendarTodayIcon style={{ fontSize: 32, color: '#C4CAD4', marginBottom: 8 }} />
                <p style={{ fontSize: 14, color: '#9AA5B4' }}>
                  {groupedCards.length > 0
                    ? 'Click a highlighted date to see card details.'
                    : 'No cards with deadlines to display.'}
                </p>
              </div>
            )}

            {/* Upcoming deadlines */}
            {upcoming.length > 0 && (
              <div className="cal-card">
                <div className="cal-section-header">
                  <AccessTimeIcon style={{ fontSize: 16, color: '#3B5BDB' }} />
                  Upcoming Deadlines
                </div>
                {upcoming.map((card, i) => {
                  const badge = daysUntilLabel(card.deadline);
                  return (
                    <div key={i} className="cal-upcoming-item">
                      <div className="cal-upcoming-dot" style={{ background: badge.color }} />
                      <div className="cal-upcoming-name">{card.title}</div>
                      <div className="cal-upcoming-date">
                        {format(new Date(card.deadline), 'dd MMM', { locale: vi })}
                      </div>
                      <span className="cal-upcoming-badge" style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;