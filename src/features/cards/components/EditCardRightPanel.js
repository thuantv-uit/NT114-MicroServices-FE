import React from 'react';
import { LinearProgress } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import '../styles/card.css';

const getProgressColor = (p) =>
  p >= 75 ? '#38A169' : p >= 50 ? '#D69E2E' : p >= 25 ? '#ED8936' : '#E53E3E';

const EditCardRightPanel = ({
  processValue, setProcessValue, processError, handleUpdateProcess, loading,
}) => {
  const color = getProgressColor(processValue);

  return (
    <div className="edit-card-right">

      {/* ── Progress ── */}
      <p className="edit-card-section-title">Completion Progress</p>

      {/* Big number display */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'Outfit', fontSize: 48, fontWeight: 800,
          color, lineHeight: 1, letterSpacing: '-2px',
        }}>
          {processValue}
        </span>
        <span style={{ fontFamily: 'DM Sans', fontSize: 18, color: '#9AA5B4', fontWeight: 500 }}>%</span>
      </div>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={processValue}
        sx={{
          height: 10, borderRadius: 5, mb: 2,
          background: '#F0F2F5',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          },
        }}
      />

      {/* Custom slider — NO marks labels, avoid overflow */}
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={processValue}
        disabled={loading}
        onChange={(e) => setProcessValue(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: color,
          cursor: loading ? 'not-allowed' : 'pointer',
          margin: '4px 0 6px',
        }}
      />

      {/* Manual tick labels — no overflow risk */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 16,
        padding: '0 2px',
      }}>
        {['0%', '25%', '50%', '75%', '100%'].map((l) => (
          <span key={l} style={{ fontSize: 10.5, color: '#9AA5B4', fontFamily: 'DM Sans' }}>{l}</span>
        ))}
      </div>

      {/* Quick select buttons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {[0, 25, 50, 75, 100].map((v) => (
          <button
            key={v}
            onClick={() => setProcessValue(v)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 8,
              border: processValue === v ? `1.5px solid ${getProgressColor(v)}` : '1.5px solid #E4E7ED',
              background: processValue === v ? getProgressColor(v) + '15' : 'transparent',
              color: processValue === v ? getProgressColor(v) : '#9AA5B4',
              fontFamily: 'DM Sans',
              fontSize: 12,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {v}%
          </button>
        ))}
      </div>

      {processError && (
        <p style={{ fontSize: 12, color: '#E53E3E', margin: '-8px 0 12px', fontFamily: 'DM Sans' }}>
          {processError}
        </p>
      )}

      <button
        className="btn btn-primary"
        onClick={(e) => { e.preventDefault(); handleUpdateProcess(); }}
        disabled={loading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        <LinearScaleIcon style={{ fontSize: 15 }} />
        {loading ? 'Updating…' : 'Update Progress'}
      </button>

      {/* ── Card Info ── */}
      <div className="edit-card-info-box">
        <p className="edit-card-info-title">Card Information</p>
        <p style={{ fontSize: 13, color: '#9AA5B4', fontFamily: 'DM Sans', lineHeight: 1.5 }}>
          More details will appear here as the card is updated.
        </p>
      </div>

    </div>
  );
};

export default EditCardRightPanel;