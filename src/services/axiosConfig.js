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

export const userInstance = createAxiosInstance('http://localhost:3001/api/users');
export const boardInstance = createAxiosInstance('http://localhost:3002/api/boards');
export const columnInstance = createAxiosInstance('http://localhost:3003/api/columns');
export const cardInstance = createAxiosInstance('http://localhost:3004/api/cards');
export const invitationInstance = createAxiosInstance('http://localhost:3005/api/invitations');