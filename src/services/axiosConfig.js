// src/services/axiosConfig.js
import axios from 'axios';
import { showToast } from '../utils/toastUtils';

// Hàm tạo interceptor chung cho mỗi instance
const setupInterceptors = (instance) => {
  // Interceptor cho request: Thêm token vào header nếu có
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor cho response: Xử lý lỗi tập trung
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'An unexpected error occurred';

      switch (status) {
        case 400:
          showToast(`Bad Request: ${message}`, 'error');
          break;
        case 401:
          showToast('Session expired. Please log in again.', 'error');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          showToast('You do not have permission to perform this action.', 'error');
          break;
        case 404:
          showToast(`Not Found: ${message}`, 'error');
          break;
        case 500:
          showToast('Server error. Please try again later.', 'error');
          break;
        default:
          showToast(message, 'error');
      }

      return Promise.reject(error);
    }
  );
};

// Tạo các instance Axios với baseURL riêng
const userInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

const boardInstance = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

const columnInstance = axios.create({
  baseURL: 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json',
  },
});

const cardInstance = axios.create({
  baseURL: 'http://localhost:3004',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Áp dụng interceptor cho từng instance
setupInterceptors(userInstance);
setupInterceptors(boardInstance);
setupInterceptors(columnInstance);
setupInterceptors(cardInstance);

// Export các instance để sử dụng trong các service
export { userInstance, boardInstance, columnInstance, cardInstance };