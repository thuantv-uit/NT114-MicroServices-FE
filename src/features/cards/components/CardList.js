/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { MouseSensor, TouchSensor } from '../../../customLibraries/DndKitSensors';
import { showToast } from '../../../utils/toastUtils';
import { updateColumn } from '../../columns/services/columnService';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Slider, FormHelperText, Menu, MenuItem, ListItemIcon, Avatar,
} from '@mui/material';
import DeleteIcon       from '@mui/icons-material/Delete';
import LinearScaleIcon  from '@mui/icons-material/LinearScale';
import ImageIcon        from '@mui/icons-material/Image';
import MoreHorizIcon    from '@mui/icons-material/MoreHoriz';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon        from '@mui/icons-material/Event';
import { updateCard, updateCardImage } from '../services/cardService';
import { getUserById } from '../../users/services/userService';
import { useNavigate } from 'react-router-dom';
import '../styles/card.css';

// ── Helpers ────────────────────────────────────────────────────
const getProgressColor = (p) =>
  p >= 75 ? '#38A169' : p >= 50 ? '#D69E2E' : p >= 25 ? '#ED8936' : '#E53E3E';

const getProgressStripColor = (p) => {
  const colors = {
    0: { r:255,g:0,b:0 }, 25:{r:255,g:128,b:0},
    50:{r:255,g:255,b:0}, 75:{r:128,g:255,b:0}, 100:{r:0,g:255,b:0},
  };
  const keys = Object.keys(colors).map(Number).sort((a,b)=>a-b);
  const lower = keys.filter(v=>v<=p).pop() ?? 0;
  const upper = keys.find(v=>v>p) ?? 100;
  if (p <= lower) { const c=colors[lower]; return `rgb(${c.r},${c.g},${c.b})`; }
  if (p >= upper) { const c=colors[upper]; return `rgb(${c.r},${c.g},${c.b})`; }
  const ratio = (p-lower)/(upper-lower);
  const r = Math.round(colors[lower].r+(colors[upper].r-colors[lower].r)*ratio);
  const g = Math.round(colors[lower].g+(colors[upper].g-colors[lower].g)*ratio);
  const b = Math.round(colors[lower].b+(colors[upper].b-colors[lower].b)*ratio);
  return `rgb(${r},${g},${b})`;
};

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
};

const isOverdue = (deadline) => deadline && new Date(deadline) < new Date();

// ── useDragAndDrop hook ────────────────────────────────────────
export const useDragAndDrop = (cards, setCards, columnId, columnTitle, onRefresh) => {
  const [activeCardId,   setActiveCardId]   = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (e) => {
    setActiveCardId(e?.active?.id);
    setActiveCardData(e?.active?.data?.current);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveCardId(null); setActiveCardData(null);
    if (!active || !over || active.id === over.id) return;
    const oi = cards.findIndex(c => c._id === active.id);
    const ni = cards.findIndex(c => c._id === over.id);
    const next = arrayMove(cards, oi, ni);
    setCards(next);
    try {
      await updateColumn(columnId, columnTitle, next.map(c => c._id));
      showToast('Card order updated!', 'success');
      onRefresh();
    } catch (err) {
      setCards(cards);
      showToast(err.message || 'Cannot update card order', 'error');
    }
  };

  return { sensors, activeCardId, activeCardData, handleDragStart, handleDragEnd };
};

// ── Card component ─────────────────────────────────────────────
export const Card = ({ card, boardId, columnId, token, onEdit, onDelete, onInviteUser, onRefresh }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id, data: { ...card },
  });
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  // Progress dialog
  const [openProcess, setOpenProcess] = useState(false);
  const [processVal,  setProcessVal]  = useState(card.process || 0);
  const [processErr,  setProcessErr]  = useState('');

  // Image dialog
  const [openImage,  setOpenImage]  = useState(false);
  const [imageFile,  setImageFile]  = useState(null);

  // Deadline dialog
  const [openDeadline,   setOpenDeadline]   = useState(false);
  const [deadlineVal,    setDeadlineVal]    = useState(card.deadline ? new Date(card.deadline).toISOString().split('T')[0] : '');
  const [deadlineErr,    setDeadlineErr]    = useState('');

  const dndStyle = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const stripColor = getProgressStripColor(card.process || 0);
  const overdue = isOverdue(card.deadline);

  // ── Handlers ─────────────────────────────────────────────────
  const stop = (fn) => (e) => { e.stopPropagation(); fn(e); };

  const handleUpdateProcess = async () => {
    const n = Number(processVal);
    if (isNaN(n)||n<0||n>100) { setProcessErr('Progress must be 0–100'); return; }
    try {
      await updateCard(card._id, { process: n }, token);
      showToast('Progress updated!', 'success');
      setOpenProcess(false); onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleUpdateImage = async () => {
    if (!imageFile) { showToast('Please select an image', 'error'); return; }
    try {
      await updateCardImage(card._id, imageFile);
      showToast('Image updated!', 'success');
      setOpenImage(false); onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleUpdateDeadline = async () => {
    if (!deadlineVal) { setDeadlineErr('Please select a date'); return; }
    try {
      await updateCard(card._id, { deadline: new Date(deadlineVal).toISOString() }, token);
      showToast('Deadline updated!', 'success');
      setOpenDeadline(false); onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <>
      {/* ── Card item ── */}
      <div
        ref={setNodeRef}
        style={dndStyle}
        {...attributes}
        {...listeners}
        className={`card-item${isDragging ? ' card-item--dragging' : ''}`}
        onClick={stop((e) => navigate(`/cards/${card._id}/edit`, { state: { title: card.title, description: card.description, boardId, columnId } }))}
      >
        {/* Progress color strip */}
        <div className="card-item__progress-strip" style={{ background: stripColor }} />

        {/* Cover image */}
        {card.image && (
          <img
            src={card.image}
            alt={card.title}
            style={{ width:'100%', height:100, objectFit:'cover', borderRadius:'8px 8px 0 0', display:'block', marginBottom:8 }}
          />
        )}

        {/* Title + menu */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6 }}>
          <p className="card-item__title" style={{ flex:1 }}>{card.title}</p>
          <button
            className="card-action-btn"
            onClick={stop((e) => setAnchorEl(e.currentTarget))}
            style={{ border:'none', background:'rgba(0,0,0,0.05)', borderRadius:6, cursor:'pointer', width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          >
            <MoreHorizIcon style={{ fontSize:15 }} />
          </button>
        </div>

        {/* Meta: deadline + progress badge */}
        <div className="card-item__meta" style={{ marginTop:6 }}>
          <span className={`card-item__deadline${overdue ? ' card-item__deadline--overdue' : ''}`}>
            <CalendarTodayIcon />
            {card.deadline ? formatDate(card.deadline) : 'No deadline'}
          </span>
          {card.process > 0 && (
            <span
              className="card-item__progress-badge"
              style={{ background: getProgressColor(card.process)+'18', color: getProgressColor(card.process) }}
            >
              {card.process}%
            </span>
          )}
        </div>

        {/* Context menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { borderRadius:'10px', border:'1px solid #E4E7ED', minWidth:180, boxShadow:'0 4px 20px rgba(0,0,0,0.09)', py:0.5 } }}
          anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
          transformOrigin={{ vertical:'top', horizontal:'right' }}
        >
          <MenuItem onClick={stop(() => { setProcessVal(card.process||0); setProcessErr(''); setOpenProcess(true); setAnchorEl(null); })}
            sx={{ fontFamily:'DM Sans', fontSize:13.5, gap:1 }}>
            <ListItemIcon><LinearScaleIcon style={{ fontSize:17, color:'#4A5568' }} /></ListItemIcon>
            Update progress
          </MenuItem>
          <MenuItem onClick={stop(() => { setImageFile(null); setOpenImage(true); setAnchorEl(null); })}
            sx={{ fontFamily:'DM Sans', fontSize:13.5, gap:1 }}>
            <ListItemIcon><ImageIcon style={{ fontSize:17, color:'#4A5568' }} /></ListItemIcon>
            Update image
          </MenuItem>
          <MenuItem onClick={stop(() => { setDeadlineVal(card.deadline ? new Date(card.deadline).toISOString().split('T')[0] : ''); setDeadlineErr(''); setOpenDeadline(true); setAnchorEl(null); })}
            sx={{ fontFamily:'DM Sans', fontSize:13.5, gap:1 }}>
            <ListItemIcon><EventIcon style={{ fontSize:17, color:'#4A5568' }} /></ListItemIcon>
            Update deadline
          </MenuItem>
          <MenuItem onClick={stop(() => { onDelete(card._id); setAnchorEl(null); })}
            sx={{ fontFamily:'DM Sans', fontSize:13.5, gap:1, color:'#E53E3E' }}>
            <ListItemIcon><DeleteIcon style={{ fontSize:17, color:'#E53E3E' }} /></ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </div>

      {/* ── Progress Dialog ── */}
      <Dialog open={openProcess} onClose={() => setOpenProcess(false)}
        PaperProps={{ sx: { borderRadius:'14px', minWidth:340 } }}>
        <DialogTitle sx={{ fontFamily:'Outfit', fontWeight:700, fontSize:17, borderBottom:'1px solid #E4E7ED', pb:1.5 }}>
          Update Progress
        </DialogTitle>
        <DialogContent sx={{ pt:'20px !important', px:3 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:13, color:'#4A5568', fontFamily:'DM Sans' }}>Progress</span>
            <span style={{ fontFamily:'Outfit', fontWeight:700, fontSize:20, color: getProgressColor(processVal) }}>{processVal}%</span>
          </div>
          <Slider
            value={processVal}
            onChange={(_, v) => { setProcessVal(v); setProcessErr(''); }}
            step={5}
            marks={[{value:0,label:'0%'},{value:25,label:'25%'},{value:50,label:'50%'},{value:75,label:'75%'},{value:100,label:'100%'}]}
            min={0} max={100} valueLabelDisplay="auto"
            sx={{ color: getProgressColor(processVal), '& .MuiSlider-markLabel': { fontSize:11 } }}
          />
          {processErr && <FormHelperText error>{processErr}</FormHelperText>}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2.5, gap:1 }}>
          <button className="btn btn-ghost" onClick={() => setOpenProcess(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpdateProcess}>Save</button>
        </DialogActions>
      </Dialog>

      {/* ── Image Dialog ── */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)}
        PaperProps={{ sx: { borderRadius:'14px', minWidth:320 } }}>
        <DialogTitle sx={{ fontFamily:'Outfit', fontWeight:700, fontSize:17, borderBottom:'1px solid #E4E7ED', pb:1.5 }}>
          Update Card Image
        </DialogTitle>
        <DialogContent sx={{ pt:'20px !important', px:3 }}>
          <div style={{
            border:'2px dashed #E4E7ED', borderRadius:10, padding:'24px',
            textAlign:'center', cursor:'pointer', transition:'border-color 0.15s',
          }}
            onClick={() => document.getElementById('card-img-input').click()}
            onDragOver={(e) => e.preventDefault()}
          >
            <ImageIcon style={{ fontSize:32, color:'#C4CAD4', marginBottom:8 }} />
            <p style={{ fontSize:13.5, color:'#9AA5B4', fontFamily:'DM Sans', margin:0 }}>
              {imageFile ? imageFile.name : 'Click to upload an image'}
            </p>
            <input id="card-img-input" type="file" accept="image/*" style={{ display:'none' }}
              onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2.5, gap:1 }}>
          <button className="btn btn-ghost" onClick={() => setOpenImage(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpdateImage} disabled={!imageFile}>Save</button>
        </DialogActions>
      </Dialog>

      {/* ── Deadline Dialog ── */}
      <Dialog open={openDeadline} onClose={() => setOpenDeadline(false)}
        PaperProps={{ sx: { borderRadius:'14px', minWidth:320 } }}>
        <DialogTitle sx={{ fontFamily:'Outfit', fontWeight:700, fontSize:17, borderBottom:'1px solid #E4E7ED', pb:1.5 }}>
          Update Deadline
        </DialogTitle>
        <DialogContent sx={{ pt:'20px !important', px:3 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#4A5568', fontFamily:'DM Sans', display:'block', marginBottom:8 }}>
            Select date
          </label>
          <input
            type="date"
            value={deadlineVal}
            onChange={(e) => { setDeadlineVal(e.target.value); setDeadlineErr(''); }}
            style={{
              width:'100%', padding:'10px 14px', borderRadius:8,
              border:'1.5px solid #E4E7ED', fontFamily:'DM Sans', fontSize:14,
              color:'#1A202C', outline:'none', boxSizing:'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor='#3B5BDB'}
            onBlur={(e) => e.target.style.borderColor='#E4E7ED'}
          />
          {deadlineErr && <p style={{ fontSize:12, color:'#E53E3E', marginTop:6, fontFamily:'DM Sans' }}>{deadlineErr}</p>}
        </DialogContent>
        <DialogActions sx={{ px:3, pb:2.5, gap:1 }}>
          <button className="btn btn-ghost" onClick={() => setOpenDeadline(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpdateDeadline}>Save</button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { useDragAndDrop as default };