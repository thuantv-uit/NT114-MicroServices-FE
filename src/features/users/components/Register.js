import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import { validateUserForm } from '../../../utils/validateUtils';
import { ThunioLogo } from '../../../Logo/components/ThunioLogo';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';
import '../styles/Register.css';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Get started in seconds',
    desc: 'No credit card required. Set up your first timeline right after sign-up.',
  },
  {
    icon: '🔒',
    title: 'Secure by default',
    desc: 'Your data is encrypted end-to-end and never shared with third parties.',
  },
  {
    icon: '🌍',
    title: 'Access anywhere',
    desc: 'Work from any device — desktop, tablet, or mobile, always in sync.',
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

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateUserForm({ ...values });
    if (values.password !== values.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    const relevant = {
      username: errs.username,
      email: errs.email,
      password: errs.password,
      confirmPassword: errs.confirmPassword,
    };
    if (Object.values(relevant).some(Boolean)) {
      setErrors(relevant);
      return;
    }
    try {
      setLoading(true);
      await registerUser(values.username, values.email, values.password);
      showToast('Registration successful! Please verify your email.', 'success');
      setTimeout(() => navigate('/verify-otp', { state: { email: values.email } }), 1500);
    } catch (err) {
      showToast(err?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-split">

        {/* ── LEFT PANEL ── */}
        <div className="reg-panel">
          <div className="reg-panel__top">
            <div className="reg-logo">
              <ThunioLogo size="md" />
              {/* <span className="reg-logo__name">Thunio</span> */}
            </div>

            <h1 className="reg-panel__tagline">
              Start for free.<br />
              <span className="reg-panel__tagline-em">Build something great.</span>
            </h1>
            <p className="reg-panel__desc">
              Join thousands of teams who use Thunio to visualise
              their projects and hit every deadline.
            </p>

            <ul className="reg-features">
              {FEATURES.map((f) => (
                <li key={f.title} className="reg-feature">
                  <div className="reg-feature__icon">{f.icon}</div>
                  <div>
                    <div className="reg-feature__title">{f.title}</div>
                    <div className="reg-feature__desc">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="reg-panel__footnote">
            NT114 · Web Application for Creating Timelines
          </p>
        </div>

        {/* ── RIGHT CARD ── */}
        <div className="reg-card">
          <h2 className="reg-card__title">Create your account</h2>
          <p className="reg-card__subtitle">Free forever. No credit card needed.</p>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="reg-field">
              <label className="reg-field__label" htmlFor="username">
                Username <span className="reg-field__req">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className={`reg-field__input${errors.username ? ' reg-field__input--err' : ''}`}
                // placeholder="yourname"
                value={values.username}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.username && <p className="reg-field__error">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="reg-field">
              <label className="reg-field__label" htmlFor="email">
                Email <span className="reg-field__req">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`reg-field__input${errors.email ? ' reg-field__input--err' : ''}`}
                // placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="reg-field__error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="reg-field">
              <label className="reg-field__label" htmlFor="password">
                Password <span className="reg-field__req">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`reg-field__input${errors.password ? ' reg-field__input--err' : ''}`}
                // placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <p className="reg-field__error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="reg-field">
              <label className="reg-field__label" htmlFor="confirmPassword">
                Confirm Password <span className="reg-field__req">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`reg-field__input${errors.confirmPassword ? ' reg-field__input--err' : ''}`}
                // placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="reg-field__error">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            {/* <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button> */}
            <button type="submit" className="reg-submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading && <ThunioSpinner size="sm" color="white" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="reg-divider">or sign up with</div>

          {/* Social */}
          <div className="reg-social-row">
            <button className="reg-social-btn"><GoogleSVG /> Google</button>
            <button className="reg-social-btn"><FacebookSVG /> Facebook</button>
          </div>

          {/* Sign in link */}
          <div className="reg-signin-row">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;