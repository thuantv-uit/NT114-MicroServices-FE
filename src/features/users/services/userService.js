// src/features/users/services/userService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/users';

export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/login`, { email, password });
  return res.data;
};

export const registerUser = async (username, email, password) => {
  const res = await axios.post(`${BASE_URL}/register`, { username, email, password });
  return res.data;
};

export const fetchUserData = async (token) => {
  const res = await axios.get(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchAllUsers = async (token) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};