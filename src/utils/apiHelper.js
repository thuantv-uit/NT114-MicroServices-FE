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
  if (error.response?.status === 403) {
    return new Error(`You don't have permission to perform this action.`);
  }
  return new Error(`Cannot connect to server. Please try again.`);
};