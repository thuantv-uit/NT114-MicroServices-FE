import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchUserData, changeAvatar } from '../services/userService';
import { CircularProgress } from '@mui/material';
import { Chat as ChatIcon, Task, GroupAdd, Edit } from '@mui/icons-material';
import Chatbot from '../../ai/chatbot';
import '../../../styles/auth-dashboard.css';

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

  const activities = [
    { icon: <Task style={{ fontSize: 17 }} />,     cls: 'blue',  text: 'Completed task: Project Plan',       sub: '2 hours ago'  },
    { icon: <GroupAdd style={{ fontSize: 17 }} />, cls: 'red',   text: 'Invited user to Team Board',         sub: 'Yesterday'    },
    { icon: <Edit style={{ fontSize: 17 }} />,     cls: 'green', text: 'Updated profile information',        sub: '3 days ago'   },
  ];

  return (
    <div className="dashboard-page">

      <h1 className="dashboard-title">Dashboard</h1>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <CircularProgress size={44} style={{ color: 'var(--c-primary)' }} />
        </div>
      )}

      {!loading && (
        <div className="dashboard-grid">

          {/* ── Profile card ── */}
          <div className="dashboard-card">
            <p className="dashboard-card__title">Profile</p>
            {user ? (
              <>
                <div className="profile-avatar-row">
                  <img
                    className="profile-avatar"
                    src={user.avatar || 'https://via.placeholder.com/150'}
                    alt={user.username}
                  />
                  <div>
                    <p className="profile-name">{user.username}</p>
                    <p className="profile-sub">{user.email || 'No email'}</p>
                  </div>
                </div>

                <div className="profile-upload-zone">
                  <button
                    className={`profile-upload-btn${showAvatarInput ? ' profile-upload-btn--danger' : ''}`}
                    onClick={() => { setShowAvatarInput((p) => !p); setAvatarFile(null); }}
                  >
                    {showAvatarInput ? 'Cancel' : 'Change Avatar'}
                  </button>

                  {showAvatarInput && (
                    <div style={{ marginTop: 10 }}>
                      <input
                        className="profile-file-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
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

          {/* ── Recent activity card ── */}
          <div className="dashboard-card">
            <p className="dashboard-card__title">Recent Activity</p>
            <div className="activity-list">
              {activities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-icon activity-icon--${a.cls}`}>{a.icon}</div>
                  <div className="activity-text">
                    <p className="activity-text__primary">{a.text}</p>
                    <p className="activity-text__secondary">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Deadline card ── */}
          <div className="dashboard-card">
            <p className="dashboard-card__title">Deadlines</p>
            <div className="donut-wrap">
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={80}
                  size={100}
                  thickness={5}
                  style={{ color: 'var(--c-primary)' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--c-text-1)' }}>
                    80%
                  </span>
                </div>
              </div>
              <p className="donut-label">80% Completed</p>
            </div>
          </div>

        </div>
      )}

      {/* Chatbot FAB */}
      <button className="chatbot-fab" onClick={() => setIsChatOpen((p) => !p)} title="Open TimelineBot">
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