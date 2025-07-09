import { boardInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';

/**
 * Board service functions
 */

/**
 * Fetch all boards
 * @returns {Promise<Array>} List of boards
 */
export const fetchBoards = async () => {
  return handleApiCall(
    () => boardInstance.get('/list').then(res => res.data),
    'Fetch boards'
  );
};

/**
 * Create a new board
 * @param {string} title - Board title
 * @param {string} description - Board description
 * @param {string} backgroundColor - Board background color (hex code)
 * @returns {Promise<Object>} Created board
 */
export const createBoard = async (title, description, backgroundColor = '#FFFFFF') => {
  return handleApiCall(
    () => boardInstance.post('', { title, description, backgroundColor }).then(res => res.data),
    'Create board'
  );
};

/**
 * Fetch a board by ID
 * @param {string} boardId - Board ID
 * @returns {Promise<Object>} Board data
 */
export const fetchBoard = async (boardId) => {
  return handleApiCall(
    () => boardInstance.get(`/${boardId}`).then(res => res.data),
    'Fetch board'
  );
};

/**
 * Update a board
 * @param {string} boardId - Board ID
 * @param {string} title - Board title
 * @param {string} description - Board description
 * @param {string} backgroundColor - Board background color (hex code)
 * @param {FormData|string} backgroundImage - Board background image file or URL
 * @returns {Promise<Object>} Updated board
 */
export const updateBoard = async (boardId, title, description, backgroundColor, backgroundImage) => {
  const formData = new FormData();
  if (title !== undefined) formData.append('title', title);
  if (description !== undefined) formData.append('description', description);
  if (backgroundColor !== undefined) formData.append('backgroundColor', backgroundColor);
  if (backgroundImage instanceof FormData) {
    // FormData from ChangeBackground.js (file upload)
    formData.append('backgroundImage', backgroundImage.get('backgroundImage'));
  } else if (typeof backgroundImage === 'string') {
    // String URL (e.g., from other components)
    formData.append('backgroundImage', backgroundImage);
  }

  return handleApiCall(
    () =>
      boardInstance.put(`/${boardId}`, formData, {
        headers: {
          'Content-Type': backgroundImage instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      }).then((res) => res.data),
    'Update board'
  );
};

/**
 * Delete a board
 * @param {string} boardId - Board ID
 * @returns {Promise<void>}
 */
export const deleteBoard = async (boardId) => {
  return handleApiCall(
    () => boardInstance.delete(`/${boardId}`),
    'Delete board'
  );
};

/**
 * Invite a user to a board
 * @param {string} boardId - Board ID
 * @param {string} email - User email
 * @returns {Promise<Object>} Response data
 */
export const inviteUser = async (boardId, email) => {
  return handleApiCall(
    () => boardInstance.post('/invite', { boardId, email }).then(res => res.data),
    'Invite user'
  );
};