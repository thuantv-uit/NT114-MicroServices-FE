// src/utils/RouteUtils.js
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ token, component }) => {
  return token ? component : <Navigate to="/login" />;
};

export const PublicRoute = ({ token, redirectTo, component }) => {
  return token ? <Navigate to={redirectTo} /> : component;
};