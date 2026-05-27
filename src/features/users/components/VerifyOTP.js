import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import '../styles/auth-share.css';

const RESEND_COOLDOWN = 60;

const VerifyOTP = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';

  const [otp,       setOtp]       = useState(['', '', '', '', '', '']);
  const [loading,   setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
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
      await verifyOTP(email, code);
      showToast('Account verified! You can now log in.', 'success');
      setTimeout(() => navigate('/login'), 1500);
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
      await resendOTP(email);
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
    <div className="as-page">
      <div className="as-card">

        <div className="as-logo">
          <div className="as-logo__mark">🗂️</div>
          <span className="as-logo__name">Thunio</span>
        </div>

        <div className="as-icon-wrap">✉️</div>
        <h1 className="as-title">Verify your account</h1>
        <p className="as-desc">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <div className="as-otp-row" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              className={`as-otp-box${digit ? ' as-otp-box--filled' : ''}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <button className="as-submit" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying…' : 'Verify Account'}
        </button>

        <div className="as-resend" style={{ marginTop: 16 }}>
          Didn't receive the code?{' '}
          {canResend ? (
            <button className="as-resend__btn" onClick={handleResend}>Resend OTP</button>
          ) : (
            <span className="as-resend__countdown">
              Resend in <strong>{countdown}s</strong>
            </span>
          )}
        </div>

        <Link to="/register" className="as-back">← Back to Register</Link>
      </div>
    </div>
  );
};

export default VerifyOTP;