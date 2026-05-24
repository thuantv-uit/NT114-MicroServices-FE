import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon    from '@mui/icons-material/Folder';
import LogoutIcon    from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import { showToast } from '../utils/toastUtils';
import '../styles/auth-dashboard.css';

/**
 * Sidebar — luôn hiển thị khi có token.
 * Trên mobile: ẩn khi isOpen=false, có overlay backdrop.
 */
const CategorySidebar = ({ token, logout, isOpen, toggleSidebar }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [projectOpen, setProjectOpen] = useState(
    // Tự mở nếu đang ở /boards hoặc /boards/:id
    location.pathname.startsWith('/boards')
  );

  if (!token) return null; // chỉ ẩn khi chưa đăng nhập

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

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? ' sidebar-overlay--visible' : ''}`}
        onClick={toggleSidebar}
      />

      <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ''}`}>

        {/* Nav items */}
        <nav className="sidebar-nav">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`sidebar-item${isActive('/dashboard') ? ' sidebar-item--active' : ''}`}
          >
            <span className="sidebar-item__icon">
              <DashboardIcon style={{ fontSize: 19 }} />
            </span>
            Dashboard
          </Link>

          {/* Project accordion */}
          <div className="sidebar-group">
            <button
              className="sidebar-group__header"
              onClick={() => setProjectOpen((p) => !p)}
              aria-expanded={projectOpen}
            >
              <span className="sidebar-group__header-left">
                <span className="sidebar-item__icon">
                  <FolderIcon style={{ fontSize: 19 }} />
                </span>
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
                <span className="sidebar-item__icon">
                  <ViewKanbanIcon style={{ fontSize: 17 }} />
                </span>
                Board
              </Link>
            </div>
          </div>

        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-item sidebar-item--danger"
            onClick={handleLogout}
          >
            <span className="sidebar-item__icon">
              <LogoutIcon style={{ fontSize: 19 }} />
            </span>
            Logout
          </button>
        </div>

      </aside>
    </>
  );
};

export default CategorySidebar;