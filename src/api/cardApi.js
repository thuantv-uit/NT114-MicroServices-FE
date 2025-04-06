import axios from 'axios';

const CARD_SERVICE_URL = 'http://localhost:3004/api/cards'; // URL của Card Service từ .env của bạn

export const createCard = async (token, cardData) => {
  const response = await axios.post(CARD_SERVICE_URL, cardData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCardsByList = async (token, listId) => {
  const response = await axios.get(`${CARD_SERVICE_URL}/list/${listId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCard = async (token, id, cardData) => {
  const response = await axios.put(`${CARD_SERVICE_URL}/${id}`, cardData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCard = async (token, id) => {
  await axios.delete(`${CARD_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};