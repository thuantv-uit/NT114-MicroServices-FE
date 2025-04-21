import { useState, useEffect } from 'react';

/**
 * Custom hook for authentication
 * @returns {Object} Authentication state and functions
 */
export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  return { token, setToken, logout };
};