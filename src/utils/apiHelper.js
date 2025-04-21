/**
 * Utility functions for API calls
 */

/**
 * Handle API call with error processing
 * @param {Function} apiCall - Async function for API call
 * @param {string} action - Action description for error message
 * @returns {Promise} API response
 * @throws {Error} Processed error
 */
export const handleApiCall = async (apiCall, action) => {
  try {
    return await apiCall();
  } catch (error) {
    throw handleApiError(error, action);
  }
};

/**
 * Process API error and return formatted error
 * @param {Error} error - Axios error
 * @param {string} action - Action description
 * @returns {Error} Formatted error
 */
export const handleApiError = (error, action) => {
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return new Error(`Cannot connect to server. Please try again.`);
  }
  switch (error.response?.status) {
    case 401:
      localStorage.removeItem('token');
      window.location.href = '/login';
      return new Error('Session expired. Please login again.');
    case 403:
      return new Error(`You don't have permission to perform this action.`);
    case 404:
      return new Error(`Failed to ${action.toLowerCase()}: Resource not found.`);
    case 400:
      return new Error(error.response?.data.message || `Failed to ${action.toLowerCase()}: Invalid request.`);
    case 500:
      return new Error(`Failed to ${action.toLowerCase()}: Server error. Please try again.`);
    default:
      return new Error(error.response?.data.message || `Failed to ${action.toLowerCase()}.`);
  }
};