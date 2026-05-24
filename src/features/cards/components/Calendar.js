import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';
import {
  format, isBefore, startOfDay, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addMonths, subMonths,
} from 'date-fns';
import vi from 'date-fns/locale/vi';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon       from '@mui/icons-material/Warning';
import ArrowBackIosIcon  from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchCardsByBoard } from '../services/cardService';
import '../styles/card.css';

const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const Calendar = ({ token }) => {
  const { boardId }  = useParams();
  const [cards, setCards]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [currentMonth, setMonth]    = useState(new Date());
  const [selectedDate, setSelected] = useState(null);

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

  if (loading) return <div className="calendar-page"><p className="cal-empty">Loading…</p></div>;
  if (error)   return <div className="calendar-page"><p style={{ color: '#E53E3E', textAlign: 'center' }}>{error}</p></div>;

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startIdx = getDay(startOfMonth(currentMonth));

  const selectedGroup = selectedDate
    ? groupedCards.find((g) => format(g.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    : null;

  const progressColor = (p) => p >= 75 ? '#38A169' : p >= 50 ? '#D69E2E' : '#ED8936';

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="calendar-page">
        <h1 className="calendar-page__title">Calendar — Todo List</h1>

        {/* ── Mini calendar ── */}
        <div className="cal-card">
          <div className="cal-nav">
            <button className="cal-nav__btn" onClick={() => setMonth((m) => subMonths(m, 1))}>
              <ArrowBackIosIcon style={{ fontSize: 14 }} />
            </button>
            <span className="cal-nav__title">
              {format(currentMonth, 'MMMM yyyy', { locale: vi })}
            </span>
            <button className="cal-nav__btn" onClick={() => setMonth((m) => addMonths(m, 1))}>
              <ArrowForwardIosIcon style={{ fontSize: 14 }} />
            </button>
          </div>

          <div className="cal-grid" style={{ marginBottom: 8 }}>
            {DAY_HEADERS.map((d) => <div key={d} className="cal-day-header">{d}</div>)}
          </div>

          <div className="cal-grid">
            {Array.from({ length: startIdx }).map((_, i) => <div key={`e${i}`} />)}
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const has = deadlineDates.has(key);
              const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === key;
              const isOver = has && isBefore(day, startOfDay(new Date()));
              return (
                <div
                  key={key}
                  className={`cal-day${has ? (isOver ? ' cal-day--overdue' : ' cal-day--has-deadline') : ''}${isSelected ? ' cal-day--selected' : ''}`}
                  onClick={has ? () => setSelected(day) : undefined}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Todo list for selected date ── */}
        {selectedDate ? (
          <div className="cal-card">
            <div className="cal-section-header">
              <CalendarTodayIcon style={{ fontSize: 17, color: '#3B5BDB' }} />
              {format(selectedDate, 'dd MMMM yyyy', { locale: vi })}
              {selectedGroup && isBefore(selectedGroup.date, startOfDay(new Date())) && (
                <WarningIcon style={{ fontSize: 16, color: '#E53E3E' }} />
              )}
            </div>

            {selectedGroup ? (
              selectedGroup.cards.map((card, i) => {
                const overdue = isBefore(new Date(card.deadline), startOfDay(new Date()));
                return (
                  <motion.div key={card._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`cal-todo-card${overdue ? ' cal-todo-card--overdue' : ''}`}
                  >
                    <p className="cal-todo-title">{card.title || `Card ${card._id}`}</p>
                    <p className={`cal-todo-deadline${overdue ? ' cal-todo-deadline--overdue' : ''}`}>
                      <CalendarTodayIcon />
                      {format(new Date(card.deadline), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                    <div className="cal-progress-row">
                      <span>Progress:</span>
                      <LinearProgress
                        variant="determinate"
                        value={card.process || 0}
                        sx={{
                          flex: 1, maxWidth: 120, height: 6, borderRadius: 4,
                          background: '#F0F2F5',
                          '& .MuiLinearProgress-bar': { background: progressColor(card.process || 0), borderRadius: 4 },
                        }}
                      />
                      <span style={{ fontWeight: 500, color: '#1A202C' }}>{card.process || 0}%</span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="cal-empty">No cards with deadline on this date.</p>
            )}
          </div>
        ) : groupedCards.length > 0 ? (
          <p className="cal-empty">Click a highlighted date to see details.</p>
        ) : (
          <p className="cal-empty">No cards with deadlines to display.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Calendar;