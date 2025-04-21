import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inviteUser } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import GenericForm from '../../../components/GenericForm';
import { validateInviteForm } from '../../../utils/validateUtils';

/**
 * Component to invite a user to a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const InviteUser = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialValues = { email: '' };
  const fields = [
    { name: 'email', label: 'User Email', type: 'email', required: true },
  ];

  return (
    <FormContainer title="Invite User to Board">
      <GenericForm
        initialValues={initialValues}
        validate={validateInviteForm}
        onSubmit={async (values) => {
          await inviteUser(id, values.email);
          showToast('User invited successfully!', 'success');
          setTimeout(() => navigate(`/boards/${id}`), 2000);
        }}
        submitLabel="Invite"
        cancelPath={`/boards/${id}`}
        fields={fields}
      />
    </FormContainer>
  );
};

export default InviteUser;