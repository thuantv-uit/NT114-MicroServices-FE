import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { ThunioLogo } from '../Logo/components/ThunioLogo';
import './styles/home.css';

const FEATURES = [
  { icon: '📅', color: 'var(--c-primary-lt)',  iconColor: 'var(--c-primary)',  title: 'Visual timelines',    desc: 'Drag-and-drop milestones on a Gantt-style timeline. See the big picture at a glance.' },
  { icon: '👥', color: 'var(--c-success-lt)',  iconColor: 'var(--c-success)',  title: 'Team collaboration',  desc: 'Invite teammates, assign tasks and leave comments — all in real time.' },
  { icon: '🔔', color: 'var(--c-warning-lt)',  iconColor: 'var(--c-warning)',  title: 'Smart reminders',     desc: 'Automated alerts keep your team on track without micromanaging.' },
  { icon: '📊', color: 'var(--c-danger-lt)',   iconColor: 'var(--c-danger)',   title: 'Progress reports',    desc: 'One-click reports for stakeholders. Export as PDF or share a live link.' },
  { icon: '🔗', color: 'var(--c-primary-lt)',  iconColor: 'var(--c-primary)',  title: 'Easy sharing',        desc: 'Publish timelines as a public link or embed them anywhere.' },
  { icon: '🔒', color: 'var(--c-success-lt)',  iconColor: 'var(--c-success)',  title: 'Secure by default',   desc: 'End-to-end encryption, role-based access and SSO for every team.' },
];

const STEPS = [
  { n: '1', title: 'Create a workspace',  desc: 'Sign up free and set up your team workspace in under 60 seconds.' },
  { n: '2', title: 'Add your projects',   desc: 'Import from Jira, Asana or start fresh with a blank timeline.' },
  { n: '3', title: 'Invite your team',    desc: 'Send email invites and assign roles in one click.' },
  { n: '4', title: 'Hit every deadline',  desc: 'Track progress, get alerts and ship on time — every time.' },
];

const TIMELINE_ROWS = [
  { label: 'API Refactor', pct: 85, color: 'var(--c-primary)' },
  { label: 'UI Redesign',  pct: 60, color: 'var(--c-primary-h)' },
  { label: 'User Testing', pct: 40, color: 'var(--c-success)' },
  { label: 'Launch Prep',  pct: 20, color: 'var(--c-danger)' },
  { label: 'Docs',         pct: 72, color: 'var(--c-warning)' },
];

const Home1 = () => (
  <div className="hp">
    <Header />

    {/* ── HERO ── */}
    <section className="hp-hero">
      <div className="hp-hero__badge">
        <span className="hp-hero__badge-dot" />
        Timeline management, reimagined
      </div>
      <h1 className="hp-hero__h1">
        Your projects.<br />
        Your <span className="hp-hero__accent">timeline</span>.<br />
        Your way.
      </h1>
      <p className="hp-hero__sub">
        Thunio brings your tasks, teammates and tools into one visual timeline —
        so every deadline is hit and nothing falls through the cracks.
      </p>
      <div className="hp-hero__btns">
        <Link to="/register" className="hp-btn hp-btn--pri">
          <span>🚀</span> Get started free
        </Link>
        <button className="hp-btn hp-btn--sec">
          <span>▶</span> Watch demo
        </button>
      </div>
      <div className="hp-hero__stats">
        <div className="hp-stat"><div className="hp-stat__n">12,000+</div><div className="hp-stat__l">Teams worldwide</div></div>
        <div className="hp-stat__div" />
        <div className="hp-stat"><div className="hp-stat__n">98%</div><div className="hp-stat__l">On-time delivery rate</div></div>
        <div className="hp-stat__div" />
        <div className="hp-stat"><div className="hp-stat__n">4.9 ★</div><div className="hp-stat__l">Average rating</div></div>
      </div>
    </section>

    {/* ── APP PREVIEW ── */}
    <section className="hp-preview">
      <div className="hp-preview__wrap">
        <div className="hp-preview__bar">
          <div className="hp-preview__dots">
            <span style={{ background: '#FF5F57' }} />
            <span style={{ background: '#FEBC2E' }} />
            <span style={{ background: '#28C840' }} />
          </div>
          <div className="hp-preview__url">app.thunio.io/dashboard</div>
        </div>
        <div className="hp-preview__body">
          <div className="hp-preview__sidebar">
            <div className="hp-preview__section-label">WORKSPACE</div>
            {['Dashboard', 'Timelines', 'Team', 'Calendar', 'Reports'].map((item, i) => (
              <div key={item} className={`hp-preview__sidebar-item${i === 0 ? ' hp-preview__sidebar-item--active' : ''}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="hp-preview__main">
            <div className="hp-preview__chart-title">Q3 Product Roadmap</div>
            {TIMELINE_ROWS.map((row) => (
              <div key={row.label} className="hp-preview__row">
                <div className="hp-preview__row-label">{row.label}</div>
                <div className="hp-preview__track">
                  <div className="hp-preview__bar" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
                <div className="hp-preview__pct">{row.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── FEATURES ── */}
    <section className="hp-features">
      <div className="hp-section__label">Why Thunio</div>
      <h2 className="hp-section__title">Everything your team needs</h2>
      <p className="hp-section__sub">From planning to shipping — manage the full project lifecycle in one place.</p>
      <div className="hp-feat-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="hp-feat-card">
            <div className="hp-feat-card__icon" style={{ background: f.color, color: f.iconColor }}>
              {f.icon}
            </div>
            <div className="hp-feat-card__title">{f.title}</div>
            <div className="hp-feat-card__desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section className="hp-how">
      <div className="hp-section__label">How it works</div>
      <h2 className="hp-section__title">Up and running in minutes</h2>
      <div className="hp-steps">
        {STEPS.map((s, i) => (
          <div key={s.n} className="hp-step">
            <div className="hp-step__num">{s.n}</div>
            {i < STEPS.length - 1 && <div className="hp-step__line" />}
            <div className="hp-step__title">{s.title}</div>
            <div className="hp-step__desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="hp-cta">
      <div className="hp-cta__inner">
        <h2 className="hp-cta__title">Ready to build better timelines?</h2>
        <p className="hp-cta__sub">Join 12,000+ teams already using Thunio. Free forever, no credit card needed.</p>
        <Link to="/register" className="hp-cta__btn">
          🚀 Start for free
        </Link>
      </div>
    </section>

    {/* ── FOOTER ── */}
    <footer className="hp-footer">
      <div className="hp-footer__brand">
        <ThunioLogo size="sm" />
        <span className="hp-footer__note">· NT114 — Web Application for Creating Timelines</span>
      </div>
      <nav className="hp-footer__links">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/privacy">Privacy Policy</a>
      </nav>
    </footer>
  </div>
);

export default Home1;