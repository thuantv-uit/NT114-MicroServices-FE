import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import { validateUserForm } from '../../../utils/validateUtils';
import { ThunioLogo } from '../../../Logo/components/ThunioLogo';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';
import '../../../styles/Login.css';

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

const FacebookSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="18" rx="4" fill="#1877F2"/>
    <path d="M12.5 11.5l.469-3H10V6.75c0-.82.402-1.62 1.693-1.62H13V2.7S11.808 2.5 10.67 2.5c-2.388 0-3.95 1.447-3.95 4.066V8.5H4v3h2.72V18h3.344v-6.5H12.5Z" fill="white"/>
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

  return (
    <div className="login-page">
      <div className="login-split">

        {/* ── LEFT PANEL ── */}
        <div className="login-panel">
          <div className="login-panel__top">
            <div className="login-logo">
              <ThunioLogo size="md" />
              {/* <span className="login-logo__name">Thunio</span> */}
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
            {/* Email */}
            <div className="login-field">
              <label className="login-field__label" htmlFor="email">
                Email <span className="login-field__req">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`login-field__input${errors.email ? ' login-field__input--err' : ''}`}
                // placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="login-field__error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-field__label" htmlFor="password">
                Password <span className="login-field__req">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`login-field__input${errors.password ? ' login-field__input--err' : ''}`}
                // placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <p className="login-field__error">{errors.password}</p>}
              {/* Forgot password — right-aligned, snug below field */}
              <div className="login-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            {/* Submit — centred */}
            {/* <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button> */}
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

          {/* Divider */}
          <div className="login-divider">or continue with</div>

          {/* Social */}
          <div className="login-social-row">
            <button className="login-social-btn">
              <GoogleSVG /> Google
            </button>
            <button className="login-social-btn">
              <FacebookSVG /> Facebook
            </button>
          </div>

          {/* Sign up */}
          <div className="login-signup-row">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;