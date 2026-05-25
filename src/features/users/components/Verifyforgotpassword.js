import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyForgotPasswordOTP, resendForgotPasswordOTP } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../../../styles/auth-dashboard.css';

const RESEND_COOLDOWN = 60;

const VerifyForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { showToast('Please enter the full 6-digit OTP.', 'error'); return; }
    setLoading(true);
    try {
      await verifyForgotPasswordOTP(email, code);
      showToast('OTP verified! Please set your new password.', 'success');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      showToast(err.message || 'Verification failed.', 'error');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendForgotPasswordOTP(email);
      showToast('A new OTP has been sent to your email.', 'success');
      setOtp(['', '', '', '', '', '']);
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      showToast(err.message || 'Failed to resend OTP.', 'error');
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
        <p className="auth-subtitle">Enter your OTP</p>
        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6b7280)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {/* OTP Input Boxes */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1.5rem' }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: '48px', height: '56px', textAlign: 'center',
                fontSize: '1.5rem', fontWeight: 'bold',
                border: '2px solid',
                borderColor: digit ? 'var(--primary, #4f46e5)' : 'var(--border-color, #e5e7eb)',
                borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s',
              }}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem',
            background: 'var(--primary, #4f46e5)', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontWeight: '600', fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: '1rem',
          }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted, #6b7280)' }}>
          Didn't receive the code?{' '}
          {canResend ? (
            <span onClick={handleResend} style={{ color: 'var(--primary, #4f46e5)', cursor: 'pointer', fontWeight: '600' }}>
              Resend OTP
            </span>
          ) : (
            <span>Resend in <strong>{countdown}s</strong></span>
          )}
        </div>

        <div className="auth-link-row" style={{ marginTop: '1rem' }}>
          <Link to="/forgot-password">← Back</Link>
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

export default VerifyForgotPassword;