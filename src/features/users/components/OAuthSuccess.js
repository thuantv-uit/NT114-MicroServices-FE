import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../utils/toastUtils';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';

/**
 * OAuthSuccess — trang trung gian nhận token từ Google OAuth callback
 * Backend redirect về: /oauth-success?token=xxx
 * Trang này lưu token rồi chuyển hướng vào dashboard
 */
const OAuthSuccess = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      showToast('Google login successful!', 'success');
      // Delay nhỏ để React state update kịp trước khi PrivateRoute check token
      setTimeout(() => navigate('/dashboard', { replace: true }), 100);
    } else {
      showToast('Google login failed. Please try again.', 'error');
      setTimeout(() => navigate('/login', { replace: true }), 100);
    }
  }, [navigate, setToken]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 16
    }}>
      <ThunioSpinner size="lg" />
      <p style={{ color: '#666', fontSize: 14 }}>Signing you in…</p>
    </div>
  );
};

export default OAuthSuccess;