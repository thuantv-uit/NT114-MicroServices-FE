import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../../../styles/auth-dashboard.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email.', 'error');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      showToast('OTP has been sent to your email.', 'success');
      setTimeout(() => navigate('/verify-forgot-password', { state: { email } }), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to send OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__mark">🗂️</div>
          <span className="auth-logo__name">Thunio</span>
        </div>
        <p className="auth-subtitle">Forgot your password?</p>
        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6b7280)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Enter your email and we'll send you a reset OTP.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.875rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                border: '1.5px solid var(--border-color, #e5e7eb)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--primary, #4f46e5)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-link-row" style={{ marginTop: '1rem' }}>
          <Link to="/login">← Back to Sign in</Link>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer__tagline">NT114 — Web Application for Creating Timelines</p>
          <div className="auth-footer__links">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;