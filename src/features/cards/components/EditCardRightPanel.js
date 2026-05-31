import React from 'react';
import { LinearProgress } from '@mui/material';
import RefreshIcon     from '@mui/icons-material/Refresh';
import GroupIcon       from '@mui/icons-material/Group';
import PersonAddIcon   from '@mui/icons-material/PersonAdd';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimelineIcon    from '@mui/icons-material/Timeline';
import '../styles/card-edit.css';

const getProgressColor = (p) =>
  p >= 75 ? '#38A169' : p >= 50 ? '#D69E2E' : p >= 25 ? '#ED8936' : '#E53E3E';

// Fake members — TODO: replace with real card.members from API
const FAKE_MEMBERS = [
  { initials: 'AJ', color: '#3B5BDB' },
  { initials: 'ST', color: '#7C3AED' },
  { initials: 'MK', color: '#38A169' },
];

const EditCardRightPanel = ({
  processValue, setProcessValue, processError,
  handleUpdateProcess, loading, card,
}) => {
  const color = getProgressColor(processValue);

  // Fake card info — TODO: replace with real card data from API
  const deadline = card?.deadline
    ? new Date(card.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'No deadline';
  const column   = card?.columnTitle  || 'In Progress';
  const created  = card?.createdAt
    ? new Date(card.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const tags     = card?.tags || [
    { label: 'Feature', bg: '#EEF2FF', color: '#3B5BDB' },
    { label: 'Frontend', bg: '#F0FFF4', color: '#38A169' },
  ];

  return (
    <div className="edit-card-right">

      {/* ── Progress ── */}
      <div>
        <p className="edit-card-section-title">
          <TimelineIcon style={{ fontSize: 15 }} />
          Completion progress
        </p>

        <div className="edit-card-prog-num">
          <span className="edit-card-prog-big" style={{ color }}>{processValue}</span>
          <span className="edit-card-prog-unit">%</span>
        </div>

        <LinearProgress
          variant="determinate"
          value={processValue}
          sx={{
            height: 10, borderRadius: 5, mb: 1.5,
            background: '#F0F2F5',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
            },
          }}
        />

        <input
          type="range"
          min={0} max={100} step={5}
          value={processValue}
          disabled={loading}
          onChange={e => setProcessValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: color, cursor: loading ? 'not-allowed' : 'pointer', margin: '2px 0 4px' }}
        />

        <div className="edit-card-prog-ticks">
          {['0%', '25%', '50%', '75%', '100%'].map(l => (
            <span key={l} className="edit-card-prog-tick">{l}</span>
          ))}
        </div>

        <div className="edit-card-quick-btns">
          {[0, 25, 50, 75, 100].map(v => (
            <button
              key={v}
              onClick={() => setProcessValue(v)}
              disabled={loading}
              className={`edit-card-quick-btn${processValue === v ? ' edit-card-quick-btn--active' : ''}`}
              style={processValue === v ? {
                borderColor: getProgressColor(v),
                background: getProgressColor(v) + '15',
                color: getProgressColor(v),
              } : {}}
            >
              {v}%
            </button>
          ))}
        </div>

        {processError && <p className="edit-card-field-error">{processError}</p>}

        <button
          className="btn btn-primary"
          onClick={e => { e.preventDefault(); handleUpdateProcess(); }}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
        >
          <RefreshIcon style={{ fontSize: 15 }} />
          {loading ? 'Updating…' : 'Update progress'}
        </button>
      </div>

      {/* ── Members ── */}
      <div>
        <p className="edit-card-section-title">
          <GroupIcon style={{ fontSize: 15 }} />
          Members
        </p>
        <div className="edit-card-members-row">
          {FAKE_MEMBERS.map((m, i) => (
            <div key={i} className="edit-card-member-av" style={{ background: m.color }}>
              {m.initials}
            </div>
          ))}
          <button className="edit-card-member-add" title="Add member">
            <PersonAddIcon style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>

      {/* ── Card info ── */}
      <div className="edit-card-info-box">
        <p className="edit-card-info-title">
          <InfoOutlinedIcon style={{ fontSize: 14, verticalAlign: -2, marginRight: 5 }} />
          Card info
        </p>

        <div className="edit-card-info-row">
          <span className="edit-card-info-label">Deadline</span>
          <span className="edit-card-info-val">{deadline}</span>
        </div>

        <div className="edit-card-info-row">
          <span className="edit-card-info-label">Tags</span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tags.map((tag, i) => (
              <span
                key={i}
                className="edit-card-info-badge"
                style={{ background: tag.bg, color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="edit-card-info-row">
          <span className="edit-card-info-label">Column</span>
          <span className="edit-card-info-val">{column}</span>
        </div>

        <div className="edit-card-info-row" style={{ borderBottom: 'none' }}>
          <span className="edit-card-info-label">Created</span>
          <span className="edit-card-info-val" style={{ color: '#9AA5B4', fontSize: 12 }}>{created}</span>
        </div>
      </div>

    </div>
  );
};

export default EditCardRightPanel;