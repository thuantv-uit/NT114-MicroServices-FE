import { cardInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';

/**
 * Card service functions
 */

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
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @returns {Promise<Object>} Updated card
 */
export const updateCard = async (cardId, title, description) => {
  return handleApiCall(
    async () => {
      const response = await cardInstance.put(`/${cardId}`, { title, description });
      return response.data;
    },
    'Update card',
    (error) => {
      // Xử lý lỗi chi tiết
      if (error.response) {
        const message = error.response.data.message || 'Failed to update card';
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
      // Xử lý lỗi chi tiết
      if (error.response) {
        const message = error.response.data.message || 'Failed to delete card';
        throw new Error(message);
      }
      throw error;
    }
  );
};