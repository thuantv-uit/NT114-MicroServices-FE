import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './styles/NotFound.css';

function NotFound() {
  const navigate    = useNavigate();
  const { token }   = useAuth();
  const homePath    = token ? '/dashboard' : '/';
  const homeLabel   = token ? 'Back to Dashboard' : 'Back to Home';

  return (
    <div className="nf-page">

      <div className="nf-logo">
        <div className="nf-logo__mark">T</div>
        <span className="nf-logo__name">Thunio</span>
      </div>

      <div className="nf-code">
        <span>4</span>0<span>4</span>
      </div>

      <div className="nf-illus" aria-hidden="true">
        <svg viewBox="0 0 260 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="18" fontSize="9" fill="#9AA5B4" fontFamily="DM Sans,sans-serif">API Refactor</text>
          <rect x="10" y="24" width="240" height="10" rx="5" fill="#E4E7ED"/>
          <rect x="10" y="24" width="160" height="10" rx="5" fill="#4C6EF5"/>
          <rect x="174" y="18" width="10" height="22" rx="3" fill="#4C6EF5"/>
          <circle cx="179" cy="29" r="7" fill="#fff" stroke="#4C6EF5" strokeWidth="2"/>
          <text x="179" y="33" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4C6EF5" fontFamily="Outfit,sans-serif">!</text>

          <text x="10" y="50" fontSize="9" fill="#9AA5B4" fontFamily="DM Sans,sans-serif">UI Redesign</text>
          <rect x="10" y="56" width="240" height="10" rx="5" fill="#E4E7ED"/>
          <rect x="10" y="56" width="90" height="10" rx="5" fill="#E4E7ED"/>
          <rect x="104" y="50" width="10" height="22" rx="3" fill="#9AA5B4"/>
          <circle cx="109" cy="61" r="7" fill="#fff" stroke="#9AA5B4" strokeWidth="2"/>
          <line x1="106" y1="58" x2="112" y2="64" stroke="#9AA5B4" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="112" y1="58" x2="106" y2="64" stroke="#9AA5B4" strokeWidth="1.8" strokeLinecap="round"/>

          <text x="10" y="82" fontSize="9" fill="#9AA5B4" fontFamily="DM Sans,sans-serif">Launch Prep</text>
          <rect x="10" y="88" width="240" height="10" rx="5" fill="#E4E7ED"/>
          <rect x="10" y="88" width="200" height="10" rx="5" fill="#E4E7ED"/>
        </svg>
      </div>

      <h1 className="nf-title">Timeline not found</h1>
      <p className="nf-sub">
        Looks like this page got lost somewhere on the roadmap.<br />
        Let's get you back on track.
      </p>

      <div className="nf-btns">
        <Link to={homePath} className="nf-btn nf-btn--pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {homeLabel}
        </Link>
        <button className="nf-btn nf-btn--sec" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Go back
        </button>
      </div>

      <p className="nf-footer">NT114 · Web Application for Creating Timelines</p>
    </div>
  );
}

export default NotFound;