// src/features/cards/services/cardService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3004/api/cards';

export const fetchCards = async (token, columnId) => {
  const res = await axios.get(`${BASE_URL}/column/${columnId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createCard = async (token, title, description, columnId, position) => {
  const res = await axios.post(BASE_URL, { title, description, columnId, position }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCard = async (token, cardId, title, description, position) => {
  const res = await axios.put(`${BASE_URL}/${cardId}`, { title, description, position }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCard = async (token, cardId) => {
  await axios.delete(`${BASE_URL}/${cardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};