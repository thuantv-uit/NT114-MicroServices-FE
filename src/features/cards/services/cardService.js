import axios from 'axios';

const BASE_URL = 'http://localhost:3004/api/cards';

export const fetchCards = async (token, columnId) => {
  try {
    const res = await axios.get(`${BASE_URL}/column/${columnId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw err;
  }
};

export const createCard = async (token, title, description, columnId) => {
  const res = await axios.post(BASE_URL, { title, description, columnId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCard = async (token, cardId, title, description) => {
  const res = await axios.put(`${BASE_URL}/${cardId}`, { title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCard = async (token, cardId) => {
  await axios.delete(`${BASE_URL}/${cardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};