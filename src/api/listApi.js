import axios from 'axios';

const LIST_SERVICE_URL = 'http://localhost:3003/api/lists';

export const createList = async (token, listData) => {
  const response = await axios.post(LIST_SERVICE_URL, listData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getListsByBoard = async (token, boardId) => {
  const response = await axios.get(`${LIST_SERVICE_URL}/board/${boardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getListById = async (token, id) => {
  const response = await axios.get(`${LIST_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateList = async (token, id, listData) => {
  const response = await axios.put(`${LIST_SERVICE_URL}/${id}`, listData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteList = async (token, id) => {
  await axios.delete(`${LIST_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};