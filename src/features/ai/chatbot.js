// chatbot.js (cập nhật để truyền dữ liệu boardId và email xuống ConfirmInvitation, sau đó kích hoạt Invitation sau khi xác nhận)
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { extractBoardInfo, sendChatMessage, extractColumnTitle, extractEmail } from './api';
import ConfirmBoardCreation from '../boards/components/ConfirmBoardCreation';
import CreateColumn from '../columns/components/CreateColumn';
import ConfirmColumnCreation from '../columns/components/ConfirmColumnCreation';
import ConfirmInvitation from '../invitations/components/ConfirmInvitation'; // Import ConfirmInvitation cho form xác nhận
import Invitation from '../invitations/components/Invitation'; // Import Invitation để xử lý lời mời sau xác nhận
import './chatbot.css';

/**
 * Chatbot component for interacting with TimelineBot
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the chatbot
 * @returns {JSX.Element}
 */
const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState([]);
  const [boardInfo, setBoardInfo] = useState({ title: '', description: '' });
  const [latestBoardId, setLatestBoardId] = useState(null); // Lưu boardId
  const [columnTitle, setColumnTitle] = useState(''); // Lưu columnTitle
  const [isConfirmBoardOpen, setIsConfirmBoardOpen] = useState(false); // State cho xác nhận board
  const [isConfirmColumnOpen, setIsConfirmColumnOpen] = useState(false); // State cho xác nhận column
  const [isConfirmInvitationOpen, setIsConfirmInvitationOpen] = useState(false); // State cho xác nhận lời mời
  const [pendingEmail, setPendingEmail] = useState(''); // Lưu email tạm thời để xác nhận
  const [inviteData, setInviteData] = useState(null); // State để kích hoạt Invitation component sau xác nhận
  const chatBodyRef = useRef(null);

  const handleBoardConfirmClose = () => {
    setIsConfirmBoardOpen(false);
    // Reset boardInfo khi đóng xác nhận
    setBoardInfo({ title: '', description: '' });
  };

  const handleBoardCreated = (boardId) => {
    // Xử lý khi board được tạo thành công, cập nhật boardId
    setLatestBoardId(boardId);
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: 'Board created successfully!' },
    ]);
  };

  const handleColumnConfirmed = () => {
    setIsConfirmColumnOpen(false);
    setIsCreateColumnOpen(true); // Mở CreateColumn sau khi xác nhận
  };

  const handleCancelColumnConfirm = () => {
    setIsConfirmColumnOpen(false);
    setColumnTitle(''); // Reset columnTitle khi hủy
  };

  const handleInvitationConfirmed = () => {
    setIsConfirmInvitationOpen(false);
    // Kích hoạt gửi lời mời bằng cách set inviteData với email và boardId
    setInviteData({ email: pendingEmail, boardId: latestBoardId });
  };

  const handleCancelInvitation = () => {
    setIsConfirmInvitationOpen(false);
    setPendingEmail(''); // Reset pendingEmail khi hủy
  };

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    // Thêm tin nhắn người dùng vào giao diện
    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setInput('');

    try {
      // Kiểm tra các loại yêu cầu
      const isBoardCreation = prompt.toLowerCase().includes('create board') || prompt.toLowerCase().includes('tạo board');
      const isColumnCreation = prompt.toLowerCase().includes('create column') || prompt.toLowerCase().includes('tạo cột');
      const isEmailExtraction = prompt.toLowerCase().includes('invite user with email');

      if (isBoardCreation) {
        // Gửi yêu cầu trích xuất title và description cho board
        const extractedData = await extractBoardInfo(prompt);
        const { title, description } = extractedData;

        // Lưu title và description vào state để truyền làm props và mở dialog xác nhận
        setBoardInfo({ title, description });
        setIsConfirmBoardOpen(true);
      } else if (isColumnCreation) {
        // Gửi yêu cầu trích xuất title cho column
        const columnData = await extractColumnTitle(prompt); // Lấy toàn bộ data
        const extractedTitle = columnData.title; // Truy cập trực tiếp title
        setColumnTitle(extractedTitle); // Lưu title vào state
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `**Extracted Column Title**: ${extractedTitle}`,
          },
        ]);
        setIsConfirmColumnOpen(true); // Mở form xác nhận column
      } else if (isEmailExtraction) {
        // Gửi yêu cầu trích xuất email
        const extractedEmail = await extractEmail(prompt);
        setPendingEmail(extractedEmail);
        setIsConfirmInvitationOpen(true); // Mở form xác nhận lời mời với email và boardId
      } else {
        // Gửi yêu cầu chat thông thường
        const chatData = await sendChatMessage(prompt, context);
        setMessages((prev) => [...prev, { sender: 'bot', text: chatData.response }]);
        setContext(chatData.context);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Error: ${error.message}` },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      sendMessage(input);
    }
  };

  const handleSendClick = () => {
    sendMessage(input);
  };

  const handleCreateColumnClose = () => {
    setIsCreateColumnOpen(false);
    setColumnTitle(''); // Reset columnTitle khi đóng
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false); // State cho CreateColumn

  return (
    <Box className="chat-container">
      <Box className="chat-header">
        <Typography variant="h6">TimelineBot</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box className="chat-body" ref={chatBodyRef}>
        {messages.length === 0 ? (
          <Box className="message bot welcome">
            <ReactMarkdown>
              Welcome to TimelineBot! Ask about boards, columns, cards, or say "create board" to extract board info, "create column" to extract column title, or "invite user with email" to extract an email.
            </ReactMarkdown>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box key={index} className={`message ${msg.sender}`}>
              <ReactMarkdown>{msg.sender === 'user' ? `**You**: ${msg.text}` : msg.text}</ReactMarkdown>
            </Box>
          ))
        )}
      </Box>
      <Box className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about boards, columns, cards, or say 'create board', 'create column', or 'invite user with email'..."
        />
        <button
          className="send-button"
          onClick={handleSendClick}
          disabled={!input.trim()}
        >
          Send
        </button>
      </Box>
      {/* Dialog cho xác nhận tạo board từ chatbot */}
      <Dialog open={isConfirmBoardOpen} onClose={handleBoardConfirmClose}>
        <DialogContent>
          <ConfirmBoardCreation
            title={boardInfo.title}
            description={boardInfo.description}
            onClose={handleBoardConfirmClose}
            onBoardCreated={handleBoardCreated}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog cho xác nhận tạo column từ chatbot */}
      <Dialog open={isConfirmColumnOpen} onClose={handleCancelColumnConfirm}>
        <DialogContent>
          <ConfirmColumnCreation
            title={columnTitle}
            boardId={latestBoardId}
            onConfirm={handleColumnConfirmed}
            onCancel={handleCancelColumnConfirm}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog cho CreateColumn */}
      <Dialog open={isCreateColumnOpen} onClose={handleCreateColumnClose}>
        <DialogContent>
          <CreateColumn
            onClose={handleCreateColumnClose}
            chatbotBoardId={latestBoardId}
            chatbotTitle={columnTitle}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog cho xác nhận lời mời từ chatbot (truyền email và boardId) */}
      <Dialog open={isConfirmInvitationOpen} onClose={handleCancelInvitation}>
        <DialogContent>
          <ConfirmInvitation
            email={pendingEmail}
            boardId={latestBoardId}
            onConfirm={handleInvitationConfirmed}
            onCancel={handleCancelInvitation}
          />
        </DialogContent>
      </Dialog>
      {/* Kích hoạt Invitation component để gửi lời mời khi có inviteData (sau xác nhận) */}
      {inviteData && (
        <Invitation
          boardId={inviteData.boardId}
          email={inviteData.email}
          action="inviteToBoard"
          onSuccess={(response) => {
            setMessages((prev) => [
              ...prev,
              { sender: 'bot', text: `Invitation sent to ${inviteData.email} for board ID: ${inviteData.boardId}` },
            ]);
            setInviteData(null); // Reset sau khi hoàn thành
          }}
          onError={(err) => {
            setMessages((prev) => [
              ...prev,
              { sender: 'bot', text: `Failed to send invitation: ${err.message}` },
            ]);
            setInviteData(null); // Reset sau khi lỗi
          }}
        />
      )}
    </Box>
  );
};

export default Chatbot;