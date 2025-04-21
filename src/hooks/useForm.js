import { useState } from 'react';

/**
 * Custom hook for form management
 * @param {Object} options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.validate - Validation function
 * @param {Function} options.onSubmit - Submit handler
 * @param {Function} options.onError - Error handler
 * @returns {Object} Form state and handlers
 */
const useForm = ({ initialValues, validate, onSubmit, onError }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (validate) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.values(validationErrors).some((error) => error)) {
        return;
      }
    }
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, loading, handleChange, handleSubmit };
};

export default useForm;