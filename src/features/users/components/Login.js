import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import { validateUserForm } from '../../../utils/validateUtils';
import { ThunioLogo } from '../../../Logo/components/ThunioLogo';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';
import '../styles/Login.css';

const FEATURES = [
  {
    icon: '📅',
    title: 'Visual Timelines',
    desc: 'Drag and drop milestones, update progress in real time.',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    desc: 'Invite members, assign roles and work together seamlessly.',
  },
  {
    icon: '🔗',
    title: 'Easy Sharing',
    desc: 'Export timelines as a public link or embed them anywhere.',
  },
];

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const GitHubSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [values, setValues]   = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUserForm({ ...values, username: 'dummy' });
    const relevant = { email: errs.email, password: errs.password };
    if (Object.values(relevant).some(Boolean)) {
      setErrors(relevant);
      return;
    }
    try {
      setLoading(true);
      const { token } = await loginUser(values.email, values.password);
      setToken(token);
      localStorage.setItem('token', token);
      showToast('Login successful!', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      showToast(err?.message || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = process.env.REACT_APP_USER_SERVICE_URL.replace('/api/users', '');
    window.location.href = `${baseUrl}/auth/google`;
  };

  // 🆕 GitHub login
  const handleGitHubLogin = () => {
    const baseUrl = process.env.REACT_APP_USER_SERVICE_URL.replace('/api/users', '');
    window.location.href = `${baseUrl}/auth/github`;
  };

  return (
    <div className="login-page">
      <div className="login-split">

        {/* ── LEFT PANEL ── */}
        <div className="login-panel">
          <div className="login-panel__top">
            <div className="login-logo">
              <ThunioLogo size="md" />
            </div>

            <h1 className="login-panel__tagline">
              Build timelines<br />
              <span className="login-panel__tagline-em">that tell your story.</span>
            </h1>
            <p className="login-panel__desc">
              Thunio helps you create, manage and share project timelines
              visually — from first idea to final delivery.
            </p>

            <ul className="login-features">
              {FEATURES.map((f) => (
                <li key={f.title} className="login-feature">
                  <div className="login-feature__icon">{f.icon}</div>
                  <div>
                    <div className="login-feature__title">{f.title}</div>
                    <div className="login-feature__desc">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="login-panel__footnote">
            NT114 · Web Application for Creating Timelines
          </p>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="login-card">
          <h2 className="login-card__title">Welcome back</h2>
          <p className="login-card__subtitle">Sign in to your account</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label className="login-field__label" htmlFor="email">
                Email <span className="login-field__req">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`login-field__input${errors.email ? ' login-field__input--err' : ''}`}
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="login-field__error">{errors.email}</p>}
            </div>

            <div className="login-field">
              <label className="login-field__label" htmlFor="password">
                Password <span className="login-field__req">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`login-field__input${errors.password ? ' login-field__input--err' : ''}`}
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <p className="login-field__error">{errors.password}</p>}
              <div className="login-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading && <ThunioSpinner size="sm" color="white" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="login-divider">or continue with</div>

          <div className="login-social-row">
            <button className="login-social-btn" onClick={handleGoogleLogin}>
              <GoogleSVG /> Google
            </button>
            {/* 🆕 GitHub button */}
            <button className="login-social-btn" onClick={handleGitHubLogin}>
              <GitHubSVG /> GitHub
            </button>
          </div>

          <div className="login-signup-row">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;