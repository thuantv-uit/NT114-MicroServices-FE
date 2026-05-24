import { invitationInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';
import { showToast } from '../../../utils/toastUtils';

/**
 * Component to handle logic for Invitation Service APIs.
 *
 * @param {Object}   props
 * @param {string}   props.boardId      - Board ID
 * @param {string}   [props.columnId]   - Column ID (inviteToColumn only)
 * @param {string}   [props.cardId]     - Card ID (assignToCard only)
 * @param {string}   [props.invitationId] - Invitation ID (accept / reject only)
 * @param {string}   props.email        - User email to invite
 * @param {string}   [props.role]       - Role to assign: 'admin' | 'member' | 'viewer' (default: 'member')
 * @param {string}   props.action       - 'inviteToBoard' | 'inviteToColumn' | 'assignToCard' | 'accept' | 'reject'
 * @param {Function} [props.onSuccess]  - Callback after successful action
 * @param {Function} [props.onError]    - Callback after failed action
 * @returns {null}
 */
const Invitation = ({
  boardId,
  columnId,
  cardId,
  invitationId,
  email,
  role = 'member',   // default role
  action,
  onSuccess,
  onError,
}) => {
  const performAction = async () => {
    try {
      let response;

      switch (action) {
        case 'inviteToBoard':
          if (!email.includes('@')) throw new Error('Invalid email format');
          response = await handleApiCall(
            () =>
              invitationInstance
                .post('/board', { boardId, email, role })
                .then((res) => res.data),
            'Invite user to board'
          );
          break;

        case 'inviteToColumn':
          response = await handleApiCall(
            () =>
              invitationInstance
                .post('/column', { boardId, columnId, email, role })
                .then((res) => res.data),
            'Invite user to column'
          );
          break;

        case 'accept':
          response = await handleApiCall(
            () =>
              invitationInstance
                .put(`/accept/${invitationId}`)
                .then((res) => res.data),
            'Accept invitation'
          );
          break;

        case 'reject':
          response = await handleApiCall(
            () =>
              invitationInstance
                .put(`/reject/${invitationId}`)
                .then((res) => res.data),
            'Reject invitation'
          );
          break;

        default:
          throw new Error('Invalid action');
      }

      if (onSuccess) onSuccess(response);
    } catch (err) {
      if (onError) onError(err);
      showToast(err.message, 'error');
    }
  };

  // Fire on mount
  if (boardId && email && (action === 'inviteToBoard' || (action === 'inviteToColumn' && columnId))) {
    performAction();
  } else if (invitationId && (action === 'accept' || action === 'reject')) {
    performAction();
  }

  return null;
};

// ── Standalone API helpers ─────────────────────────────────────────────────────
export const getPendingBoardInvitations = async (userId) =>
  handleApiCall(
    () => invitationInstance.get(`/pending/board/${userId}`).then((res) => res.data),
    'Get pending board invitations'
  );

export const getPendingColumnInvitations = async (userId) =>
  handleApiCall(
    () => invitationInstance.get(`/pending/column/${userId}`).then((res) => res.data),
    'Get pending column invitations'
  );

export default Invitation;