import axios from 'axios';

const BASE_URL = 'http://localhost:3003/api/columns';
const BOARD_URL = 'http://localhost:3002/api/boards';

export const fetchColumns = async (token, boardId) => {
  const res = await axios.get(`${BASE_URL}/board/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createColumn = async (token, title, boardId) => {
  const res = await axios.post(BASE_URL, { title, boardId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateColumn = async (token, columnId, title) => {
  const res = await axios.put(`${BASE_URL}/${columnId}`, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteColumn = async (token, columnId) => {
  await axios.delete(`${BASE_URL}/${columnId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateBoardColumnOrder = async (token, boardId, columnOrderIds) => {
  const res = await axios.put(`${BOARD_URL}/${boardId}`, { columnOrderIds }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};