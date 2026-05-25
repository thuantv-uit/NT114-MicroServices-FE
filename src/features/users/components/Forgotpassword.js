import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../../../styles/auth-share.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { showToast('Please enter your email.', 'error'); return; }
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
    <div className="as-page">
      <div className="as-card">

        <div className="as-logo">
          <div className="as-logo__mark">🗂️</div>
          <span className="as-logo__name">Thunio</span>
        </div>

        <div className="as-icon-wrap">🔑</div>
        <h1 className="as-title">Forgot password?</h1>
        <p className="as-desc">Enter your email and we'll send you a reset OTP.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="as-field">
            <label className="as-field__label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="as-field__input"
              // placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <button type="submit" className="as-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </form>

        <Link to="/login" className="as-back">← Back to Sign in</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;