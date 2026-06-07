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
 * Verify OTP code
 * @param {string} email - User email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<Object>} Verification result
 */
export const verifyOTP = async (email, otp) => {
  return handleApiCall(
    () => userInstance.post('/verify-otp', { email, otp }).then(res => res.data),
    'Verify OTP'
  );
};

/**
 * Resend OTP code
 * @param {string} email - User email
 * @returns {Promise<Object>} Resend result
 */
export const resendOTP = async (email) => {
  return handleApiCall(
    () => userInstance.post('/resend-otp', { email }).then(res => res.data),
    'Resend OTP'
  );
};

export const forgotPassword = async (email) => {
  return handleApiCall(
    () => userInstance.post('/forgot-password', { email }).then(res => res.data),
    'Forgot password'
  );
};
 
export const verifyForgotPasswordOTP = async (email, otp) => {
  return handleApiCall(
    () => userInstance.post('/verify-forgot-password', { email, otp }).then(res => res.data),
    'Verify forgot password OTP'
  );
};
 
export const resendForgotPasswordOTP = async (email) => {
  return handleApiCall(
    () => userInstance.post('/forgot-password', { email }).then(res => res.data),
    'Resend forgot password OTP'
  );
};
 
export const resetPassword = async (email, newPassword) => {
  return handleApiCall(
    () => userInstance.post('/reset-password', { email, newPassword }).then(res => res.data),
    'Reset password'
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

export const getUserById = async (userId) => {
  return handleApiCall(
    () => userInstance.get(`/${userId}`).then(res => res.data),
    'Fetch user by ID'
  );
};

/**
 * Delete user account
 * @param {string} userId - ID of the user to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteUser = async (userId) => {
  return handleApiCall(
    () => userInstance.delete(`/${userId}`).then(res => res.data),
    'Delete user'
  );
};

// ─────────────────────────────────────────────
// 🆕 GOOGLE OAUTH
// ─────────────────────────────────────────────
 
/**
 * Redirect trình duyệt sang Google OAuth
 * Không dùng axios vì đây là full-page redirect, không phải API call
 */
export const loginWithGoogle = () => {
  const baseUrl = process.env.REACT_APP_USER_SERVICE_URL.replace('/api/users', '');
  window.location.href = `${baseUrl}/auth/google`;
};