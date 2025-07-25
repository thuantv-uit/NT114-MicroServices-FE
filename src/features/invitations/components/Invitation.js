// Invitation.js (cập nhật để hỗ trợ xử lý lời mời từ chatbot mà không thay đổi lớn, vì logic đã sẵn sàng)
import { invitationInstance } from '../../../services/axiosConfig';
import { handleApiCall } from '../../../utils/apiHelper';
import { showToast } from '../../../utils/toastUtils';

/**
 * Component to handle logic for Invitation Service APIs
 * @param {Object} props
 * @param {string} props.boardId - Board ID
 * @param {string} props.columnId - Column ID (optional)
 * @param {string} props.cardId - Card ID (optional)
 * @param {string} props.invitationId - Invitation ID (optional)
 * @param {string} props.email - User email to invite
 * @param {string} props.action - Action to perform ('inviteToBoard', 'inviteToColumn', 'assignToCard', 'accept', 'reject')
 * @param {Function} props.onSuccess - Callback after successful action
 * @param {Function} props.onError - Callback after failed action
 * @returns {null}
 */
const Invitation = ({ boardId, columnId, cardId, invitationId, email, action, onSuccess, onError }) => {
  const performAction = async () => {
    try {
      let response;
      switch (action) {
        case 'inviteToBoard':
          // Logic xử lý lời mời vào board từ chatbot (sử dụng email và boardId được truyền xuống)
          // Kiểm tra email hợp lệ nếu cần (ví dụ tùy chọn)
          if (!email.includes('@')) {
            throw new Error('Invalid email format');
          }
          response = await handleApiCall(
            () => invitationInstance.post('/board', { boardId, email }).then(res => res.data),
            'Invite user to board'
          );
          break;
        case 'inviteToColumn':
          response = await handleApiCall(
            () => invitationInstance.post('/column', { boardId, columnId, email }).then(res => res.data),
            'Invite user to column'
          );
          break;
        case 'accept':
          response = await handleApiCall(
            () => invitationInstance.put(`/accept/${invitationId}`).then(res => res.data),
            'Accept invitation'
          );
          break;
        case 'reject':
          response = await handleApiCall(
            () => invitationInstance.put(`/reject/${invitationId}`).then(res => res.data),
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

  // Gọi performAction ngay khi component được mount
  if (boardId && email && (action === 'inviteToBoard' || (action === 'inviteToColumn' && columnId))) {
    performAction();
  } else if (invitationId && (action === 'accept' || action === 'reject')) {
    performAction();
  }

  return null; // Component này không render UI
};

// Thêm các hàm gọi API mới để lấy danh sách lời mời đang chờ xử lý
export const getPendingBoardInvitations = async (userId) => {
  return await handleApiCall(
    () => invitationInstance.get(`/pending/board/${userId}`).then(res => res.data),
    'Get pending board invitations'
  );
};

export const getPendingColumnInvitations = async (userId) => {
  return await handleApiCall(
    () => invitationInstance.get(`/pending/column/${userId}`).then(res => res.data),
    'Get pending column invitations'
  );
};

export default Invitation;