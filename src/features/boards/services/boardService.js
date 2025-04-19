import axios from 'axios';

const BASE_URL = 'http://localhost:3002/api/boards';

export const fetchBoards = async (token) => {
  const res = await axios.get(`${BASE_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createBoard = async (token, title, description) => {
  const res = await axios.post(BASE_URL, { title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchBoard = async (token, boardId) => {
  const res = await axios.get(`${BASE_URL}/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateBoard = async (token, boardId, title, description) => {
  const res = await axios.put(`${BASE_URL}/${boardId}`, { title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteBoard = async (token, boardId) => {
  await axios.delete(`${BASE_URL}/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const inviteUser = async (token, boardId, email) => {
  const res = await axios.post(`${BASE_URL}/invite`, { boardId, email }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};