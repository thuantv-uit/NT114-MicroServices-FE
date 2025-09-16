import { cardInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';

/**
 * Card service functions
 */

/**
 * Fetch a single card by ID
 * @param {string} cardId - Card ID
 * @returns {Promise<Object>} Card data
 */
export const fetchCardById = async (cardId) => {
  return handleApiCall(
    () => cardInstance.get(`/${cardId}`).then(res => res.data),
    'Fetch card by ID'
  );
};

/**
 * Fetch cards by column ID
 * @param {string} columnId - Column ID
 * @returns {Promise<Array>} List of cards
 */
export const fetchCards = async (columnId) => {
  return handleApiCall(
    () => cardInstance.get(`/column/${columnId}`).then(res => res.data),
    'Fetch cards'
  );
};

/**
 * Fetch cards by board ID
 * @param {string} boardId - Board ID
 * @returns {Promise<Array>} List of cards with title, deadline, process
 */
export const fetchCardsByBoard = async (boardId) => {
  return handleApiCall(
    () => cardInstance.get(`/board/${boardId}`).then(res => res.data),
    'Fetch cards by board'
  );
};

/**
 * Create a new card
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} columnId - Column ID
 * @returns {Promise<Object>} Created card
 */
export const createCard = async (title, description, columnId) => {
  return handleApiCall(
    () => cardInstance.post('', { title, description, columnId }).then(res => res.data),
    'Create card'
  );
};

/**
 * Update a card
 * @param {string} cardId - Card ID
 * @param {Object} updates - Fields to update (title, description, process, deadline)
 * @returns {Promise<Object>} Updated card
 */
export const updateCard = async (cardId, updates = {}) => {
  return handleApiCall(
    async () => {
      const body = {};
      if (updates.title !== undefined) body.title = updates.title;
      if (updates.description !== undefined) body.description = updates.description;
      if (updates.process !== undefined) body.process = updates.process;
      if (updates.deadline !== undefined) body.deadline = updates.deadline;

      const response = await cardInstance.put(`/${cardId}`, body);
      return response.data;
    },
    'Cập nhật thẻ',
    (error) => {
      if (error.response) {
        const message = error.response.data.message || 'Không thể cập nhật thẻ';
        throw new Error(message);
      }
      throw error;
    }
  );
};

/**
 * Delete a card
 * @param {string} cardId - Card ID
 * @returns {Promise<void>}
 */
export const deleteCard = async (cardId) => {
  return handleApiCall(
    async () => {
      await cardInstance.delete(`/${cardId}`);
      return { message: 'Card deleted successfully' };
    },
    'Delete card',
    (error) => {
      if (error.response) {
        const message = error.response.data.message || 'Failed to delete card';
        throw new Error(message);
      }
      throw error;
    }
  );
};

/**
 * Update card image
 * @param {string} cardId - Card ID
 * @param {File} imageFile - Image file for card
 * @returns {Promise<Object>} Updated card data
 */
export const updateCardImage = async (cardId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return handleApiCall(
    () =>
      cardInstance
        .post(`/${cardId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => res.data),
    'Update card image'
  );
};

/**
 * Add a comment to a card
 * @param {string} cardId - Card ID
 * @param {string} text - Comment text
 * @returns {Promise<Object>} Created comment
 */
export const addComment = async (cardId, text) => {
  return handleApiCall(
    () => cardInstance.post(`/${cardId}/comments`, { text }).then(res => res.data),
    'Add comment'
  );
};

/**
 * Fetch comments for a card
 * @param {string} cardId - Card ID
 * @returns {Promise<Array>} List of comments
 */
export const fetchCommentsByCard = async (cardId) => {
  return handleApiCall(
    () => cardInstance.get(`/${cardId}/comments`).then(res => res.data),
    'Fetch comments'
  );
};