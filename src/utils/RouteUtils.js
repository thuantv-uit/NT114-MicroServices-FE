import { Navigate } from 'react-router-dom';

/**
 * Private route component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {React.ReactNode} props.component - Component to render
 * @returns {JSX.Element}
 */
export const PrivateRoute = ({ token, component }) => {
  return token ? component : <Navigate to="/login" />;
};

/**
 * Public route component
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @param {string} props.redirectTo - Redirect path if authenticated
 * @param {React.ReactNode} props.component - Component to render
 * @returns {JSX.Element}
 */
export const PublicRoute = ({ token, redirectTo, component }) => {
  return token ? <Navigate to={redirectTo} /> : component;
};