// src/api/userApi.js
import axios from 'axios';

// Địa chỉ cơ sở của dịch vụ người dùng (có thể thay đổi tùy theo cấu hình của bạn)
const USER_SERVICE_URL = 'http://localhost:3001/api/users';

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Dữ liệu người dùng: { username, email, password }
 * @returns {Promise} - Kết quả từ API
 */
export const registerUser = async (userData) => {
  const response = await axios.post(`${USER_SERVICE_URL}/register`, userData);
  return response.data;
};

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập: { email, password }
 * @returns {Promise} - Kết quả từ API (thường chứa token)
 */
export const loginUser = async (credentials) => {
  const response = await axios.post(`${USER_SERVICE_URL}/login`, credentials);
  return response.data;
};

/**
 * Lấy thông tin người dùng hiện tại
 * @param {string} token - Token xác thực
 * @returns {Promise} - Thông tin người dùng
 */
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${USER_SERVICE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} token - Token xác thực
 * @param {string} id - ID của người dùng
 * @returns {Promise} - Thông tin người dùng
 */
export const getUserById = async (token, id) => {
  const response = await axios.get(`${USER_SERVICE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};