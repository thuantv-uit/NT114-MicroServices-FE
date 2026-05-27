import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../styles/auth-share.css';

const ResetPassword = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';

  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error'); return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error'); return;
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

  return (
    <div className="as-page">
      <div className="as-card">

        <div className="as-logo">
          <div className="as-logo__mark">🗂️</div>
          <span className="as-logo__name">Thunio</span>
        </div>

        <div className="as-icon-wrap">🔒</div>
        <h1 className="as-title">Set new password</h1>
        <p className="as-desc">
          Enter a new password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="as-field">
            <label className="as-field__label" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              className="as-field__input"
              // placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="as-field">
            <label className="as-field__label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="as-field__input"
              // placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="as-submit" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <Link to="/login" className="as-back">← Back to Sign in</Link>
      </div>
    </div>
  );
};

export default ResetPassword;