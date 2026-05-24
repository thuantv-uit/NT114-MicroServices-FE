import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import GoogleIcon   from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';
import '../../../styles/auth-dashboard.css';

const Register = () => {
  const navigate = useNavigate();
  const initialValues = { username: '', email: '', password: '', confirmPassword: '' };
  const fields = [
    { name: 'username',        label: 'Username',         required: true },
    { name: 'email',           label: 'Email',            type: 'email',    required: true },
    { name: 'password',        label: 'Password',         type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__mark">🗂️</div>
          <span className="auth-logo__name">Thunio</span>
        </div>
        <p className="auth-subtitle">Create your account</p>

        {/* Form */}
        <GenericForm
          initialValues={initialValues}
          validate={(values) => {
            const errors = validateUserForm({ ...values });
            if (values.password !== values.confirmPassword)
              errors.confirmPassword = 'Passwords do not match';
            return {
              username: errors.username,
              email: errors.email,
              password: errors.password,
              confirmPassword: errors.confirmPassword,
            };
          }}
          onSubmit={async (values) => {
            await registerUser(values.username, values.email, values.password);
            showToast('Registration successful! Please login.', 'success');
            setTimeout(() => navigate('/login'), 1500);
          }}
          submitLabel="Create account"
          cancelPath={null}
          fields={fields}
        />

        {/* Divider */}
        <div className="auth-divider">or sign up with</div>

        {/* Social */}
        <div className="auth-social-row">
          <button className="auth-social-btn">
            <GoogleIcon style={{ fontSize: 18 }} /> Sign up with Google
          </button>
          <button className="auth-social-btn">
            <FacebookIcon style={{ fontSize: 18 }} /> Sign up with Facebook
          </button>
        </div>

        {/* Link */}
        <div className="auth-link-row">
          Already have an account? <Link to="/login">Sign in</Link>
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

export default Register;