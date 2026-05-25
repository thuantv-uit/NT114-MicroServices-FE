import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import GoogleIcon   from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';
import '../../../styles/auth-dashboard.css';

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const initialValues = { email: '', password: '' };
  const fields = [
    { name: 'email',    label: 'Email',    type: 'email',    required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__mark">🗂️</div>
          <span className="auth-logo__name">Thunio</span>
        </div>
        <p className="auth-subtitle">Sign in to your account</p>

        {/* Form */}
        <GenericForm
          initialValues={initialValues}
          validate={(values) => {
            const errors = validateUserForm({ ...values, username: 'dummy' });
            return { email: errors.email, password: errors.password };
          }}
          onSubmit={async (values) => {
            const { token } = await loginUser(values.email, values.password);
            setToken(token);
            localStorage.setItem('token', token);
            showToast('Login successful!', 'success');
            setTimeout(() => navigate('/dashboard'), 1500);
          }}
          submitLabel="Sign in"
          cancelPath={null}
          fields={fields}
        />

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary, #4f46e5)' }}>
            Forgot password?
          </Link>
        </div>

        {/* Divider */}
        <div className="auth-divider">or continue with</div>

        {/* Social */}
        <div className="auth-social-row">
          <button className="auth-social-btn">
            <GoogleIcon style={{ fontSize: 18 }} /> Sign in with Google
          </button>
          <button className="auth-social-btn">
            <FacebookIcon style={{ fontSize: 18 }} /> Sign in with Facebook
          </button>
        </div>

        {/* Link */}
        <div className="auth-link-row">
          Don't have an account? <Link to="/register">Sign up</Link>
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

export default Login;