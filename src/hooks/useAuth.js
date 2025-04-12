// src/hooks/useAuth.js
import { useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return { token, setToken, handleLogout };
};

export default useAuth;