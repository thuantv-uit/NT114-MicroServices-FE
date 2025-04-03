// src/api/boardApi.js
import axios from 'axios';

const BOARD_SERVICE_URL = 'http://localhost:3002/api/boards';

export const getBoards = async (token) => {
  const response = await axios.get(BOARD_SERVICE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createBoard = async (token, boardData) => {
  const response = await axios.post(BOARD_SERVICE_URL, boardData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBoardById = async (token, id) => {
  const response = await axios.get(`${BOARD_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBoard = async (token, id, boardData) => {
  const response = await axios.put(`${BOARD_SERVICE_URL}/${id}`, boardData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBoard = async (token, id) => {
  await axios.delete(`${BOARD_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};