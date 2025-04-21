import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateUserForm } from '../../../utils/validateUtils';

/**
 * Component for user registration
 * @returns {JSX.Element}
 */
const Register = () => {
  const navigate = useNavigate();
  const initialValues = { username: '', email: '', password: '' };
  const fields = [
    { name: 'username', label: 'Username', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  return (
    <FormContainer title="Register">
      <GenericForm
        initialValues={initialValues}
        validate={validateUserForm}
        onSubmit={async (values) => {
          await registerUser(values.username, values.email, values.password);
          showToast('Registration successful! Please login.', 'success');
          setTimeout(() => navigate('/login'), 2000);
        }}
        submitLabel="Register"
        cancelPath="/login"
        fields={fields}
      />
    </FormContainer>
  );
};

export default Register;