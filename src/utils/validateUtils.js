/**
 * Utility functions for form validation
 */

/**
 * Validate required field
 * @param {string} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {string} Error message or empty string
 */
export const validateRequired = (value, fieldName) => {
    return value ? '' : `${fieldName} is required`;
  };
  
  /**
   * Validate minimum length
   * @param {string} value - Field value
   * @param {number} minLength - Minimum length
   * @param {string} fieldName - Field name for error message
   * @returns {string} Error message or empty string
   */
  export const validateMinLength = (value, minLength, fieldName) => {
    return value.length >= minLength ? '' : `${fieldName} must be at least ${minLength} characters`;
  };
  
  /**
   * Validate email format
   * @param {string} value - Email value
   * @returns {string} Error message or empty string
   */
  export const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? '' : 'Email is invalid';
  };
  
  /**
   * Validate user form (username, email, password)
   * @param {object} values - Form values
   * @returns {object} Errors object
   */
  export const validateUserForm = (values) => {
    const errors = {};
    errors.username = validateRequired(values.username, 'Username') || validateMinLength(values.username, 3, 'Username');
    errors.email = validateRequired(values.email, 'Email') || validateEmail(values.email);
    errors.password = validateRequired(values.password, 'Password') || validateMinLength(values.password, 6, 'Password');
    return errors;
  };
  
  /**
   * Validate board form (title, description)
   * @param {object} values - Form values
   * @returns {object} Errors object
   */
  export const validateBoardForm = (values) => {
    const errors = {};
    errors.title = validateRequired(values.title, 'Title') || validateMinLength(values.title, 5, 'Title');
    errors.description = validateRequired(values.description, 'Description') || validateMinLength(values.description, 5, 'Description');
    return errors;
  };
  
  /**
   * Validate column form (title)
   * @param {object} values - Form values
   * @returns {object} Errors object
   */
  export const validateColumnForm = (values) => {
    const errors = {};
    errors.title = validateRequired(values.title, 'Title') || validateMinLength(values.title, 5, 'Title');
    return errors;
  };
  
  /**
   * Validate card form (title, description)
   * @param {object} values - Form values
   * @returns {object} Errors object
   */
  export const validateCardForm = (values) => {
    const errors = {};
    errors.title = validateRequired(values.title, 'Title') || validateMinLength(values.title, 5, 'Title');
    if (values.description) {
      errors.description = validateMinLength(values.description, 5, 'Description');
    }
    return errors;
  };
  
  /**
   * Validate invite form (email)
   * @param {object} values - Form values
   * @returns {object} Errors object
   */
  export const validateInviteForm = (values) => {
    const errors = {};
    errors.email = validateRequired(values.email, 'Email') || validateEmail(values.email);
    return errors;
  };