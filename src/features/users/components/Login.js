import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import {
  Box,
  Button,
  Paper,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';
import { COLORS } from '../../../constants/color';

document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.overflow = 'hidden';
document.documentElement.style.margin = 0;
document.documentElement.style.padding = 0;
document.documentElement.style.overflow = 'hidden';

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const initialValues = { email: '', password: '' };
  const fields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.white} 100%)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: COLORS.card,
        }}
      >
        {/* Logo + Title */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {/* <img
            src="https://www.svgrepo.com/show/354463/trello.svg"
            alt="Thunio Logo"
            style={{ width: '30px', height: '30px' }}
          /> */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
            Thunio
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: COLORS.textLight }}>
          Sign in to get started
        </Typography>

        <Box
          sx={{
            '& button[type="submit"]': {
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: COLORS.textLight,
              },
            },
          }}
        >
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
              setTimeout(() => navigate('/dashboard'), 2000);
            }}
            submitLabel="Login"
            cancelPath={null}
            fields={fields}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              bgcolor: COLORS.primary,
              color: COLORS.white,
              '&:hover': {
                bgcolor: COLORS.textLight,
              },
            }}
          >
            Sign in with Google
          </Button>
          <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              bgcolor: COLORS.primary,
              color: COLORS.white,
              '&:hover': {
                bgcolor: COLORS.textLight,
              },
            }}
          >
            Sign in with Facebook
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link href="/register" variant="body2" sx={{ color: COLORS.primary }}>
            Don't have an account? Sign up required
          </Link>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLORS.textLight, mb: 1 }}>
            NT114, Web Application for Creating Timelines
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/" variant="body2" sx={{ color: COLORS.primary }}>
              Home
            </Link>
            <Link href="/about" variant="body2" sx={{ color: COLORS.primary }}>
              About Us
            </Link>
            <Link href="/privacy" variant="body2" sx={{ color: COLORS.primary }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;