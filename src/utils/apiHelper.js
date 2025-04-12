// src/utils/apiHelper.js
export const handleApiCall = async (apiCall, serverName) => {
    try {
      return await apiCall();
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error(`Lỗi kết nối đến server ${serverName}`);
      }
      throw error; // Ném lại các lỗi khác (như 400, 401, v.v.)
    }
  };