import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon          from '@mui/icons-material/Menu';
import SearchIcon        from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon   from '@mui/icons-material/HelpOutline';
import PersonIcon        from '@mui/icons-material/Person';
import PhotoCameraIcon   from '@mui/icons-material/PhotoCamera';
import SettingsIcon      from '@mui/icons-material/Settings';
import LogoutIcon        from '@mui/icons-material/Logout';
import { showToast } from '../utils/toastUtils';
import { getPendingBoardInvitations, getPendingColumnInvitations } from '../features/invitations/components/Invitation';
import { fetchUserData, changeAvatar } from '../features/users/services/userService';
import '../styles/navbar.css';
import { ReactComponent as ThunioLogo } from '../assets/Logo/Thunio.svg';


const Navbar = ({ token, logout, isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [user,         setUser]         = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [popoverOpen,  setPopoverOpen]  = useState(false);
  const [showUpload,   setShowUpload]   = useState(false);
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
      setShowUpload(false);
      showToast('Avatar updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update avatar: ' + (err.message || 'Unknown error'), 'error');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
      navigate('/login');
    } else {
      showToast('Unable to logout. Please try again.', 'error');
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="app-navbar">

      {/* ── Left ── */}
      <div className="navbar-left">
        <button className="navbar-icon-btn" onClick={toggleSidebar} title="Toggle menu">
          <MenuIcon style={{ fontSize: 22 }} />
        </button>
        <Link to="/dashboard" className="navbar-logo">
          <ThunioLogo width={28} height={28} />
          Thun<span className="navbar-logo__accent">io</span>
        </Link>
      </div>

      {/* ── Search ── */}
      <div className="navbar-search">
        <span className="navbar-search__icon">
          <SearchIcon style={{ fontSize: 17 }} />
        </span>
        <input
          className="navbar-search__input"
          type="text"
          placeholder="Search boards, tasks, members…"
        />
        <span className="navbar-search__kbd">⌘K</span>
      </div>

      {/* ── Right ── */}
      <div className="navbar-right">

        <button className="navbar-icon-btn" title="Help">
          <HelpOutlineIcon style={{ fontSize: 22 }} />
        </button>

        <div className="navbar-divider" />

        {/* Notifications */}
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

        <div className="navbar-divider" />

        {/* Avatar + popover */}
        {token && user ? (
          <div className="navbar-user-wrap" ref={popoverRef}>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user.username}</span>
              <span className="navbar-user-role">{user.role || 'Member'}</span>
            </div>

            <div
              className="navbar-avatar-wrap"
              onClick={() => setPopoverOpen(p => !p)}
            >
              {user.avatar
                ? <img className="navbar-avatar" src={user.avatar} alt={user.username} />
                : <div className="navbar-avatar navbar-avatar--initials">{getInitials(user.username)}</div>
              }
            </div>

            {popoverOpen && (
              <div className="navbar-popover">
                {/* Header */}
                <div className="navbar-popover__header">
                  <div className="navbar-popover__avatar">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : getInitials(user.username)
                    }
                  </div>
                  <div>
                    <div className="navbar-popover__name">{user.username}</div>
                    <div className="navbar-popover__email">{user.email || 'No email'}</div>
                  </div>
                </div>

                {/* Menu */}
                <div className="navbar-popover__menu">
                  <button className="navbar-popover__item" onClick={() => { navigate('/dashboard'); setPopoverOpen(false); }}>
                    <PersonIcon style={{ fontSize: 17 }} />
                    View Profile
                  </button>

                  <button className="navbar-popover__item" onClick={() => setShowUpload(p => !p)}>
                    <PhotoCameraIcon style={{ fontSize: 17 }} />
                    Change Avatar
                  </button>

                  {showUpload && (
                    <div className="navbar-popover__upload">
                      <input
                        type="file"
                        accept="image/*"
                        className="navbar-popover__file"
                        onChange={e => setAvatarFile(e.target.files[0])}
                      />
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 6 }}
                        onClick={handleAvatarUpload}
                        disabled={!avatarFile || loading}
                      >
                        {loading ? 'Uploading…' : 'Upload'}
                      </button>
                    </div>
                  )}

                  <button className="navbar-popover__item" onClick={() => { navigate('/settings'); setPopoverOpen(false); }}>
                    <SettingsIcon style={{ fontSize: 17 }} />
                    Settings
                  </button>

                  <div className="navbar-popover__divider" />

                  <button className="navbar-popover__item" onClick={() => { navigate('/help'); setPopoverOpen(false); }}>
                    <HelpOutlineIcon style={{ fontSize: 17 }} />
                    Help & Support
                  </button>

                  <div className="navbar-popover__divider" />

                  <button className="navbar-popover__item navbar-popover__item--danger" onClick={handleLogout}>
                    <LogoutIcon style={{ fontSize: 17 }} />
                    Logout
                  </button>
                </div>
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