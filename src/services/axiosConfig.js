import axios from 'axios';
/**
 * Create an Axios instance with interceptors
 * @param {string} baseURL - Base URL for the API
 * @returns {Object} Axios instance
 */
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });

  // Request interceptor to add token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export const userInstance = createAxiosInstance(process.env.REACT_APP_USER_SERVICE_URL);
export const boardInstance = createAxiosInstance(process.env.REACT_APP_BOARD_SERVICE_URL);
export const columnInstance = createAxiosInstance(process.env.REACT_APP_COLUMN_SERVICE_URL);
export const cardInstance = createAxiosInstance(process.env.REACT_APP_CARD_SERVICE_URL);
export const invitationInstance = createAxiosInstance(process.env.REACT_APP_INVITATION_SERVICE_URL);

export const QUESTION_API = process.env.REACT_APP_QUESTION_API_URL || 'http://localhost:3006';
export const ACTION_API   = process.env.REACT_APP_ACTION_API_URL   || 'http://localhost:3007';