import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchUserData, changeAvatar } from '../services/userService';
import { CircularProgress } from '@mui/material';
import {
  Chat as ChatIcon,
  ViewKanban, CheckCircle, AccessAlarm, Group,
  TaskAlt, PersonAdd, Edit, SpaceDashboard, PhotoCamera, Close,
} from '@mui/icons-material';
import { PageSpinner } from '../../../Logo/components/ThunioSpinner';
import Chatbot from '../../ai/chatbot';
import '../styles/dashboard.css';

const UserDashboard = () => {
  const { token } = useAuth();
  const [user,            setUser]            = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [isChatOpen,      setIsChatOpen]      = useState(false);
  const [avatarFile,      setAvatarFile]      = useState(null);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      try { setUser(await fetchUserData()); }
      catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      setLoading(true);
      const res = await changeAvatar(avatarFile);
      setUser(res.user);
      setAvatarFile(null);
      setShowAvatarInput(false);
    } catch (err) {
      alert('Failed to update avatar: ' + (err.message || 'Unknown error'));
    } finally { setLoading(false); }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const stats = [
    { icon: <ViewKanban style={{ fontSize: 20 }} />, color: '#3B5BDB', bg: '#EEF2FF', label: 'Total Boards',  value: 12, trend: '↑ 2 this month',      trendUp: true  },
    { icon: <CheckCircle style={{ fontSize: 20 }} />, color: '#38A169', bg: '#F0FFF4', label: 'Tasks Done',    value: 84, trend: '↑ 12 this week',      trendUp: true  },
    { icon: <AccessAlarm style={{ fontSize: 20 }} />, color: '#E53E3E', bg: '#FFF5F5', label: 'Overdue',       value: 3,  trend: '↑ 1 since yesterday', trendUp: false },
    { icon: <Group       style={{ fontSize: 20 }} />, color: '#D97706', bg: '#FFFBEB', label: 'Team Members',  value: 8,  trend: 'Across 4 boards',     trendUp: null  },
  ];

  const activities = [
    { icon: <TaskAlt    style={{ fontSize: 16 }} />, iconBg: '#EEF2FF', iconColor: '#3B5BDB', badgeCls: 'badge-blue',  badge: 'Task',    text: 'Completed "Design System Review"',         time: '2 hours ago'          },
    { icon: <PersonAdd  style={{ fontSize: 16 }} />, iconBg: '#FFF5F5', iconColor: '#E53E3E', badgeCls: 'badge-red',   badge: 'Invite',  text: 'Invited sarah@example.com to Team Board',  time: 'Yesterday at 3:40 PM' },
    { icon: <Edit       style={{ fontSize: 16 }} />, iconBg: '#F0FFF4', iconColor: '#38A169', badgeCls: 'badge-green', badge: 'Profile', text: 'Updated profile information',              time: '3 days ago'           },
    { icon: <SpaceDashboard style={{ fontSize: 16 }} />, iconBg: '#FFFBEB', iconColor: '#D97706', badgeCls: 'badge-amber', badge: 'Board', text: 'Created "Q3 Roadmap" board',             time: '4 days ago'           },
  ];

  const deadlines = [
    { name: 'API Refactor',  pct: 85, color: '#3B5BDB' },
    { name: 'UI Redesign',   pct: 60, color: '#7C3AED' },
    { name: 'User Testing',  pct: 40, color: '#38A169' },
    { name: 'Launch Prep',   pct: 20, color: '#E53E3E' },
    { name: 'Docs',          pct: 72, color: '#D97706' },
  ];

  const boards = [
    { name: 'Q3 Roadmap',     color: '#3B5BDB', count: 14 },
    { name: 'UI Redesign',    color: '#7C3AED', count: 9  },
    { name: 'Backend Sprint', color: '#38A169', count: 22 },
    { name: 'Marketing',      color: '#D97706', count: 7  },
  ];

  const taskDone = 59, taskProgress = 17, taskOverdue = 8;
  const total = taskDone + taskProgress + taskOverdue;
  const r = 38, circ = 2 * Math.PI * r;
  const doneDash     = (taskDone     / total) * circ;
  const progressDash = (taskProgress / total) * circ;
  const overdueDash  = (taskOverdue  / total) * circ;

  return (
    <div className="dashboard-page">

      {loading && <PageSpinner text="Loading dashboard…" />}

      {!loading && (
        <>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-sub">{today} · Welcome back, {user?.username || 'there'} 👋</p>

          {/* ── Stat cards ── */}
          <div className="stat-row">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-card__icon" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div className="stat-card__label">{s.label}</div>
                <div className="stat-card__val">{s.value}</div>
                <div className={`stat-card__trend ${s.trendUp === true ? 'trend--up' : s.trendUp === false ? 'trend--dn' : 'trend--neu'}`}>
                  {s.trend}
                </div>
              </div>
            ))}
          </div>

          {/* ── Row 2: Profile + Activity ── */}
          <div className="db-grid2">

            {/* Profile */}
            <div className="dashboard-card">
              <p className="dashboard-card__title">Profile</p>
              {user ? (
                <>
                  <div className="profile-avatar-row">
                    {user.avatar
                      ? <img className="profile-avatar" src={user.avatar} alt={user.username} />
                      : <div className="profile-avatar profile-avatar--initials">{getInitials(user.username)}</div>
                    }
                    <div>
                      <p className="profile-name">{user.username}</p>
                      <span className="profile-role-badge">{user.role || 'Member'}</span>
                      <p className="profile-sub">{user.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className="profile-mini-stats">
                    <div className="pstat"><div className="pstat__n">12</div><div className="pstat__l">Boards</div></div>
                    <div className="pstat"><div className="pstat__n">84</div><div className="pstat__l">Tasks</div></div>
                    <div className="pstat"><div className="pstat__n">26</div><div className="pstat__l">Invites</div></div>
                  </div>

                  <div className="profile-upload-zone">
                    <button
                      className={`profile-upload-btn${showAvatarInput ? ' profile-upload-btn--danger' : ''}`}
                      onClick={() => { setShowAvatarInput(p => !p); setAvatarFile(null); }}
                    >
                      {showAvatarInput
                        ? <><Close style={{ fontSize: 14, verticalAlign: -2, marginRight: 5 }} />Cancel</>
                        : <><PhotoCamera style={{ fontSize: 14, verticalAlign: -2, marginRight: 5 }} />Change Avatar</>
                      }
                    </button>
                    {showAvatarInput && (
                      <div style={{ marginTop: 10 }}>
                        <input
                          className="profile-file-input"
                          type="file"
                          accept="image/*"
                          onChange={e => setAvatarFile(e.target.files[0])}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handleAvatarUpload}
                          disabled={!avatarFile || loading}
                          style={{ marginTop: 6 }}
                        >
                          {loading ? 'Uploading…' : 'Upload'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--c-text-3)', fontSize: 14 }}>No user data available.</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card">
              <p className="dashboard-card__title">Recent Activity</p>
              <div className="activity-list">
                {activities.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon" style={{ background: a.iconBg, color: a.iconColor }}>
                      {a.icon}
                    </div>
                    <div className="activity-text">
                      <span className={`act-badge ${a.badgeCls}`}>{a.badge}</span>
                      <p className="activity-text__primary">{a.text}</p>
                      <p className="activity-text__secondary">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Deadlines + Boards + Task Overview ── */}
          <div className="db-grid3">

            {/* Deadlines */}
            <div className="dashboard-card">
              <p className="dashboard-card__title">Deadlines</p>
              {deadlines.map((d, i) => (
                <div className="deadline-item" key={i}>
                  <div className="dl-name">{d.name}</div>
                  <div className="dl-bar-wrap">
                    <div className="dl-bar" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                  <div className="dl-pct">{d.pct}%</div>
                </div>
              ))}
            </div>

            {/* My Boards */}
            <div className="dashboard-card">
              <p className="dashboard-card__title">My Boards</p>
              {boards.map((b, i) => (
                <div className="board-chip" key={i}>
                  <div className="bc-dot" style={{ background: b.color }} />
                  <div className="bc-name">{b.name}</div>
                  <div className="bc-count">{b.count} tasks</div>
                </div>
              ))}
            </div>

            {/* Task Overview donut */}
            <div className="dashboard-card">
              <p className="dashboard-card__title">Task Overview</p>
              <div className="donut-wrap">
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#F7F8FA" strokeWidth="10" />
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#3B5BDB" strokeWidth="10"
                      strokeDasharray={`${doneDash} ${circ}`} strokeLinecap="round" />
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#38A169" strokeWidth="10"
                      strokeDasharray={`${progressDash} ${circ}`} strokeDashoffset={-doneDash} strokeLinecap="round" />
                    <circle cx="50" cy="50" r={r} fill="none" stroke="#E53E3E" strokeWidth="10"
                      strokeDasharray={`${overdueDash} ${circ}`} strokeDashoffset={-(doneDash + progressDash)} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div className="donut-pct">{total}</div>
                    <div style={{ fontSize: 10, color: 'var(--c-text-3)' }}>tasks</div>
                  </div>
                </div>
                <div className="donut-legend">
                  {[
                    { color: '#3B5BDB', label: 'Done',       val: taskDone     },
                    { color: '#38A169', label: 'In Progress', val: taskProgress },
                    { color: '#E53E3E', label: 'Overdue',     val: taskOverdue  },
                  ].map((l, i) => (
                    <div className="dl-leg" key={i}>
                      <div className="dl-dot" style={{ background: l.color }} />
                      <div className="dl-leg-text">{l.label}</div>
                      <div className="dl-leg-val">{l.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Chatbot FAB */}
      <button className="chatbot-fab" onClick={() => setIsChatOpen(p => !p)} title="Open TimelineBot">
        <ChatIcon style={{ fontSize: 26 }} />
      </button>

      {isChatOpen && (
        <div className="chatbot-window">
          <Chatbot onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;