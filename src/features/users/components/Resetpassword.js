import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../../../styles/auth-dashboard.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      showToast('Password reset successfully! Please log in.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    border: '1.5px solid var(--border-color, #e5e7eb)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__mark">🗂️</div>
          <span className="auth-logo__name">Thunio</span>
        </div>
        <p className="auth-subtitle">Set new password</p>
        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6b7280)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Enter a new password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.875rem' }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.875rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem',
              background: 'var(--primary, #4f46e5)', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontWeight: '600', fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;