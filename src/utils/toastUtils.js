import { toast } from 'react-toastify';

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (info, success, error)
 */
export const showToast = (message, type = 'info') => {
  toast[type](message, { position: 'bottom-right', autoClose: 3000 });
};