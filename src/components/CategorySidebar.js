import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import FolderIcon        from '@mui/icons-material/Folder';
import LogoutIcon        from '@mui/icons-material/Logout';
import ExpandMoreIcon    from '@mui/icons-material/ExpandMore';
import ViewKanbanIcon         from '@mui/icons-material/ViewKanban';
import AutoAwesomeMosaicIcon  from '@mui/icons-material/AutoAwesomeMosaic';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon      from '@mui/icons-material/BarChart';
import GroupIcon         from '@mui/icons-material/Group';
import PersonAddIcon     from '@mui/icons-material/PersonAdd';
import SettingsIcon      from '@mui/icons-material/Settings';
import { showToast } from '../utils/toastUtils';
import './styles/sidebar.css';

const recentBoards = [
  { name: 'Q3 Roadmap',     color: '#3B5BDB' },
  { name: 'UI Redesign',    color: '#7C3AED' },
  { name: 'Backend Sprint', color: '#38A169' },
];

const CategorySidebar = ({ token, logout, isOpen, toggleSidebar, user }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [projectOpen, setProjectOpen] = useState(
    location.pathname.startsWith('/boards') || location.pathname === '/templates'
  );
  const [reportsOpen, setReportsOpen] = useState(false);

  if (!token) return null;

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
      navigate('/login');
    } else {
      showToast('Unable to logout. Please try again.', 'error');
    }
  };

  const isActive = (path) =>
    path === '/boards'
      ? location.pathname === '/boards' || location.pathname.startsWith('/boards/')
      : location.pathname === path;

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? ' sidebar-overlay--visible' : ''}`}
        onClick={toggleSidebar}
      />

      <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ' app-sidebar--collapsed'}`}>

        {/* ── User info ── */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user__avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : getInitials(user.username)
              }
            </div>
            <div className="sidebar-user__info">
              <div className="sidebar-user__name">{user.username}</div>
              <div className="sidebar-user__role">{user.role || 'Member'}</div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">

          {/* ── Main ── */}
          <p className="sidebar-section-label">Main</p>

          <Link
            to="/dashboard"
            className={`sidebar-item${isActive('/dashboard') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><DashboardIcon style={{ fontSize: 19 }} /></span>
            Dashboard
          </Link>

          <Link
            to="/notifications"
            className={`sidebar-item${isActive('/notifications') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><NotificationsIcon style={{ fontSize: 19 }} /></span>
            Notifications
            <span className="sidebar-badge sidebar-badge--red">3</span>
          </Link>

          <Link
            to="/calendar"
            className={`sidebar-item${isActive('/calendar') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><CalendarMonthIcon style={{ fontSize: 19 }} /></span>
            Calendar
          </Link>

          {/* ── Workspace ── */}
          <p className="sidebar-section-label">Workspace</p>

          {/* Project accordion */}
          <div className="sidebar-group">
            <button
              className="sidebar-group__header"
              onClick={() => setProjectOpen(p => !p)}
              aria-expanded={projectOpen}
            >
              <span className="sidebar-group__header-left">
                <span className="sidebar-item__icon"><FolderIcon style={{ fontSize: 19 }} /></span>
                Project
              </span>
              <span className={`sidebar-group__chevron${projectOpen ? ' sidebar-group__chevron--open' : ''}`}>
                <ExpandMoreIcon style={{ fontSize: 18 }} />
              </span>
            </button>
            <div className={`sidebar-group__children${projectOpen ? ' sidebar-group__children--open' : ''}`}>
              <Link
                to="/boards"
                className={`sidebar-item${isActive('/boards') ? ' sidebar-item--active' : ''}`}
                style={{ paddingLeft: 20 }}
              >
                <span className="sidebar-item__icon"><ViewKanbanIcon style={{ fontSize: 17 }} /></span>
                Board
                <span className="sidebar-badge">4</span>
              </Link>
              <Link
                to="/templates"
                className={`sidebar-item${isActive('/templates') ? ' sidebar-item--active' : ''}`}
                style={{ paddingLeft: 20 }}
              >
                <span className="sidebar-item__icon"><AutoAwesomeMosaicIcon style={{ fontSize: 17 }} /></span>
                Templates
              </Link>
            </div>
          </div>

          {/* Reports accordion */}
          <div className="sidebar-group">
            <button
              className="sidebar-group__header"
              onClick={() => setReportsOpen(p => !p)}
              aria-expanded={reportsOpen}
            >
              <span className="sidebar-group__header-left">
                <span className="sidebar-item__icon"><BarChartIcon style={{ fontSize: 19 }} /></span>
                Reports
              </span>
              <span className={`sidebar-group__chevron${reportsOpen ? ' sidebar-group__chevron--open' : ''}`}>
                <ExpandMoreIcon style={{ fontSize: 18 }} />
              </span>
            </button>
            <div className={`sidebar-group__children${reportsOpen ? ' sidebar-group__children--open' : ''}`}>
              <Link to="/reports/overview" className="sidebar-item" style={{ paddingLeft: 20 }}>
                <span className="sidebar-item__icon"><BarChartIcon style={{ fontSize: 17 }} /></span>
                Overview
              </Link>
            </div>
          </div>

          {/* ── Team ── */}
          <p className="sidebar-section-label">Team</p>

          <Link
            to="/members"
            className={`sidebar-item${isActive('/members') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><GroupIcon style={{ fontSize: 19 }} /></span>
            Members
            <span className="sidebar-badge sidebar-badge--green">8</span>
          </Link>

          <Link
            to="/invitations"
            className={`sidebar-item${isActive('/invitations') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><PersonAddIcon style={{ fontSize: 19 }} /></span>
            Invitations
            <span className="sidebar-badge sidebar-badge--amber">2</span>
          </Link>

          {/* ── Recent Boards ── */}
          <p className="sidebar-section-label">Recent Boards</p>
          {recentBoards.map((b, i) => (
            <Link to="/boards" className="sidebar-item" key={i}>
              <span className="sidebar-recent-dot" style={{ background: b.color }} />
              {b.name}
            </Link>
          ))}

        </nav>

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          <Link
            to="/settings"
            className={`sidebar-item${isActive('/settings') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon"><SettingsIcon style={{ fontSize: 19 }} /></span>
            Settings
          </Link>
          <button className="sidebar-item sidebar-item--danger" onClick={handleLogout}>
            <span className="sidebar-item__icon"><LogoutIcon style={{ fontSize: 19 }} /></span>
            Logout
          </button>
        </div>

      </aside>
    </>
  );
};

export default CategorySidebar;