// src/features/columns/services/columnService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3003/api/columns';

export const fetchColumns = async (token, boardId) => {
  const res = await axios.get(`${BASE_URL}/board/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createColumn = async (token, title, boardId, position) => {
  const res = await axios.post(BASE_URL, { title, boardId, position }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateColumn = async (token, columnId, title, position) => {
  const res = await axios.put(`${BASE_URL}/${columnId}`, { title, position }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteColumn = async (token, columnId) => {
  await axios.delete(`${BASE_URL}/${columnId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};