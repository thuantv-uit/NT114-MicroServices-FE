import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TOAST_ID = 'unique-toast';

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (info, success, error)
 */
export const showToast = (message, type = 'info') => {
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, {
      render: message,
      type,
      position: 'bottom-right',
      autoClose: 3000,
      closeOnClick: true,
    });
  } else {
    toast[type](message, {
      toastId: TOAST_ID,
      position: 'bottom-right',
      autoClose: 3000,
      closeOnClick: true,
    });
  }
};