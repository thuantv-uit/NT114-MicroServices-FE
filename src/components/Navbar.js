import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon         from '@mui/icons-material/Menu';
import HomeIcon         from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon  from '@mui/icons-material/HelpOutline';
import SettingsIcon     from '@mui/icons-material/Settings';
import SearchIcon       from '@mui/icons-material/Search';
import { showToast } from '../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from '../features/invitations/components/Invitation';
import { fetchUserData, changeAvatar } from '../features/users/services/userService';
import '../styles/auth-dashboard.css';

const Navbar = ({ token, logout, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId || payload.id || payload._id || null;
    } catch (_) {}
  }

  useEffect(() => {
    if (!token || !userId) return;

    const fetchInvitations = async () => {
      try {
        const [board, col] = await Promise.all([
          getPendingBoardInvitations(userId),
          getPendingColumnInvitations(userId),
        ]);
        setNotificationCount((board?.length || 0) + (col?.length || 0));
      } catch (_) {}
    };

    const loadUser = async () => {
      setLoading(true);
      try { setUser(await fetchUserData()); }
      catch (_) {}
      finally { setLoading(false); }
    };

    fetchInvitations();
    loadUser();
  }, [token, userId]);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target))
        setPopoverOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAvatarUpload = async () => {
    if (!avatarFile) { showToast('Please select an image file', 'error'); return; }
    try {
      setLoading(true);
      const res = await changeAvatar(avatarFile);
      setUser(res.user);
      setAvatarFile(null);
      setPopoverOpen(false);
      showToast('Avatar updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update avatar: ' + (err.message || 'Unknown error'), 'error');
    } finally { setLoading(false); }
  };

  return (
    <header className="app-navbar">
      {/* Left */}
      <div className="navbar-left">
        <button className="navbar-icon-btn" onClick={toggleSidebar} title="Toggle menu">
          <MenuIcon style={{ fontSize: 22 }} />
        </button>
        <button className="navbar-icon-btn" onClick={() => navigate('/dashboard')} title="Home">
          <HomeIcon style={{ fontSize: 22 }} />
        </button>
        <Link to="/dashboard" className="navbar-logo">Thunio</Link>
      </div>

      {/* Search */}
      <div className="navbar-search">
        <span className="navbar-search__icon">
          <SearchIcon style={{ fontSize: 18 }} />
        </span>
        <input
          className="navbar-search__input"
          type="text"
          placeholder="Search…"
        />
      </div>

      {/* Right */}
      <div className="navbar-right">
        {token && (
          <div className="navbar-badge-wrap">
            <button
              className="navbar-icon-btn"
              onClick={() => userId && navigate(`/pending-invitations/${userId}`)}
              title="Notifications"
            >
              <NotificationsIcon style={{ fontSize: 22 }} />
            </button>
            {notificationCount > 0 && (
              <span className="navbar-badge">{notificationCount}</span>
            )}
          </div>
        )}

        <button className="navbar-icon-btn" title="Help">
          <HelpOutlineIcon style={{ fontSize: 22 }} />
        </button>
        <button className="navbar-icon-btn" title="Settings">
          <SettingsIcon style={{ fontSize: 22 }} />
        </button>

        {token && user ? (
          <div style={{ position: 'relative' }} ref={popoverRef}>
            <img
              className="navbar-avatar"
              src={user.avatar || 'https://via.placeholder.com/150'}
              alt={user.username}
              onClick={() => setPopoverOpen((p) => !p)}
            />
            {popoverOpen && (
              <div className="navbar-popover">
                <p className="navbar-popover__title">Change Avatar</p>
                <input
                  className="navbar-popover__file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={handleAvatarUpload}
                  disabled={!avatarFile || loading}
                >
                  {loading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login"    className="navbar-auth-btn">Login</Link>
            <Link to="/register" className="navbar-auth-btn navbar-auth-btn--primary">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;