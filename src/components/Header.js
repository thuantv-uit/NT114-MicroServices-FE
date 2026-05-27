import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThunioLogo } from '../Logo/components/ThunioLogo';
import './styles/home.css';

const NAV_MENUS = [
  {
    label: 'Features',
    options: [
      { label: 'Visual Timelines', path: '/feature/1' },
      { label: 'Team Collaboration', path: '/feature/2' },
      { label: 'Smart Reminders', path: '/feature/3' },
    ],
  },
  {
    label: 'Solutions',
    options: [
      { label: 'For Startups', path: '/solutions/a' },
      { label: 'For Enterprise', path: '/solutions/b' },
    ],
  },
  {
    label: 'Plans',
    options: [
      { label: 'Basic Plan', path: '/plans/basic' },
      { label: 'Pro Plan', path: '/plans/pro' },
    ],
  },
  {
    label: 'Prices',
    options: [
      { label: 'Pricing Tier 1', path: '/prices/tier1' },
      { label: 'Pricing Tier 2', path: '/prices/tier2' },
    ],
  },
  {
    label: 'Resources',
    options: [
      { label: 'Blog', path: '/resources/blog' },
      { label: 'Tutorials', path: '/resources/tutorials' },
      { label: 'Docs', path: '/resources/docs' },
    ],
  },
];

const DropdownMenu = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="hdr-dropdown" ref={ref}>
      <button
        className={`hdr-nav-link${open ? ' hdr-nav-link--active' : ''}`}
        onClick={() => setOpen((p) => !p)}
      >
        {menu.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          style={{ transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="hdr-dropdown__panel">
          {menu.options.map((opt) => (
            <button
              key={opt.path}
              className="hdr-dropdown__item"
              onClick={() => { navigate(opt.path); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => (
  <header className="hdr">
    <div className="hdr-inner">
      {/* Brand */}
      <Link to="/" className="hdr-brand">
        <ThunioLogo size="lg" />
      </Link>

      {/* Nav */}
      <nav className="hdr-nav">
        {NAV_MENUS.map((menu) => (
          <DropdownMenu key={menu.label} menu={menu} />
        ))}
      </nav>

      {/* CTA */}
      <div className="hdr-cta">
        <Link to="/login" className="hdr-btn hdr-btn--ghost">Sign in</Link>
        <Link to="/register" className="hdr-btn hdr-btn--solid">Sign up free</Link>
      </div>
    </div>
  </header>
);

export default Header;