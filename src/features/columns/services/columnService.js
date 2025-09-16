import { columnInstance, boardInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';

/**
 * Column service functions
 */

/**
 * Fetch columns by board ID
 * @param {string} boardId - Board ID
 * @returns {Promise<Array>} List of columns
 */
export const fetchColumns = async (boardId) => {
  return handleApiCall(
    () => columnInstance.get(`/board/${boardId}`).then(res => res.data),
    'Fetch columns'
  );
};

/**
 * Create a new column
 * @param {string} title - Column title
 * @param {string} boardId - Board ID
 * @returns {Promise<Object>} Created column
 */
export const createColumn = async (title, boardId) => {
  return handleApiCall(
    () => columnInstance.post('', { title, boardId }).then(res => res.data),
    'Create column'
  );
};

/**
 * Update a column
 * @param {string} columnId - Column ID
 * @param {string} title - Column title
 * @param {string} backgroundColor - Board background color (hex code)
 * @param {Array} cardOrderIds - Order of card IDs
 * @returns {Promise<Object>} Updated column
 */
export const updateColumn = async (columnId, title, cardOrderIds, backgroundColor) => {
  return handleApiCall(
    () => columnInstance.put(`/${columnId}`, { title, cardOrderIds, backgroundColor }).then(res => res.data),
    'Update column'
  );
};

/**
 * Delete a column
 * @param {string} columnId - Column ID
 * @returns {Promise<void>}
 */
export const deleteColumn = async (columnId) => {
  return handleApiCall(
    () => columnInstance.delete(`/${columnId}`),
    'Delete column'
  );
};

/**
 * Update board column order
 * @param {string} boardId - Board ID
 * @param {Array} columnOrderIds - Order of column IDs
 * @returns {Promise<Object>} Updated board
 */
export const updateBoardColumnOrder = async (boardId, columnOrderIds) => {
  return handleApiCall(
    () => boardInstance.put(`/${boardId}`, { columnOrderIds }).then(res => res.data),
    'Update column order'
  );
};

export const getColumndById = async (columnId) => {
  return handleApiCall(
    () => columnInstance.get(`all/${columnId}`),
    'All User get Column by ID'
  )
}