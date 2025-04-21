import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';

/**
 * Component for user login
 * @param {Object} props
 * @param {Function} props.setToken - Function to set authentication token
 * @returns {JSX.Element}
 */
const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const initialValues = { email: '', password: '' };
  const fields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  return (
    <FormContainer title="Login">
      <GenericForm
        initialValues={initialValues}
        validate={(values) => {
          const errors = validateUserForm({ ...values, username: 'dummy' });
          return { email: errors.email, password: errors.password };
        }}
        onSubmit={async (values) => {
          const { token } = await loginUser(values.email, values.password);
          setToken(token);
          localStorage.setItem('token', token);
          showToast('Login successful!', 'success');
          setTimeout(() => navigate('/dashboard'), 2000);
        }}
        submitLabel="Login"
        cancelPath="/"
        fields={fields}
      />
    </FormContainer>
  );
};

export default Login;