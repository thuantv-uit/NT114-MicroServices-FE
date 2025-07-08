import { userInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';

/**
 * User service functions
 */

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const loginUser = async (email, password) => {
  return handleApiCall(
    () => userInstance.post('/login', { email, password }).then(res => res.data),
    'Login'
  );
};

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Registered user data
 */
export const registerUser = async (username, email, password) => {
  return handleApiCall(
    () => userInstance.post('/register', { username, email, password }).then(res => res.data),
    'Register'
  );
};

/**
 * Fetch current user data
 * @returns {Promise<Object>} User data
 */
export const fetchUserData = async () => {
  return handleApiCall(
    () => userInstance.get('/me').then(res => res.data),
    'Fetch user data'
  );
};

/**
 * Fetch all users
 * @returns {Promise<Array>} List of users
 */
export const fetchAllUsers = async () => {
  return handleApiCall(
    () => userInstance.get('/').then(res => res.data),
    'Fetch all users'
  );
};

/**
 * Change user avatar
 * @param {File} avatarFile - Image file for avatar
 * @returns {Promise<Object>} Updated user data
 */
export const changeAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  return handleApiCall(
    () =>
      userInstance
        .post('/change-avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => res.data),
    'Change avatar'
  );
};