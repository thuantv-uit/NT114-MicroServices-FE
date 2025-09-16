/**
 * Sends a request to analyze actions from text
 * @param {string} prompt - The input text to analyze actions from
 * @returns {Promise<Array>} - Array of actions
 */
export const analyzeActions = async (prompt) => {
  try {
    const response = await fetch('http://localhost:5004/analyze-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
    console.log('1:', data);
    console.log('2:', data.actions);

    return data.actions;
  } catch (error) {
    throw new Error(`Action analysis error: ${error.message}`);
  }
};

/**
 * Sends a request to extract email from raw text
 * @param {string} text - The input text to extract email from
 * @returns {Promise<string>} - Extracted email address
 */
export const extractEmail = async (text) => {
  try {
    const response = await fetch('http://localhost:5003/extract-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
    return data.email; // Trả về email trực tiếp từ { email: "..." }
  } catch (error) {
    throw new Error(`Email extraction error: ${error.message}`);
  }
};

/**
 * Sends a request to extract column title from raw text
 * @param {string} text - The input text to extract column title from
 * @returns {Promise<string>} - Extracted column title
 */
export const extractColumnTitle = async (text) => {
  try {
    const response = await fetch('http://localhost:5002/extract1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    throw new Error(`Extraction error: ${error.message}`);
  }
};


/**
 * Sends a request to extract board information (title and description) from text
 * @param {string} text - The input text to extract information from
 * @returns {Promise<Object>} - Object containing title and description
 */
export const extractBoardInfo = async (text) => {
  try {
    const response = await fetch('http://localhost:5001/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data; // Giả định API trả về { title, description }
  } catch (error) {
    throw new Error(`Extraction error: ${error.message}`);
  }
};

/**
 * Sends a chat message to the chat endpoint
 * @param {string} prompt - The user's input prompt
 * @param {Array} context - The conversation context
 * @returns {Promise<Object>} - Object containing response and updated context
 */
export const sendChatMessage = async (prompt, context) => {
  try {
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return { response: data.response, context: data.context };
  } catch (error) {
    throw new Error(`Chat error: ${error.message}`);
  }
};