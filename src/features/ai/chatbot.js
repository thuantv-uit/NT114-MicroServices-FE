import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { extractBoardInfo, sendChatMessage, extractColumnTitle, extractEmail } from './api';
import ConfirmBoardCreation from '../boards/components/ConfirmBoardCreation';
import ConfirmColumnCreation from '../columns/components/ConfirmColumnCreation';
import ConfirmInvitation from '../invitations/components/ConfirmInvitation';
import Invitation from '../invitations/components/Invitation';
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
  const [latestBoardId, setLatestBoardId] = useState(null);
  const [columnTitle, setColumnTitle] = useState('');
  const [isConfirmBoardOpen, setIsConfirmBoardOpen] = useState(false);
  const [isConfirmColumnOpen, setIsConfirmColumnOpen] = useState(false);
  const [isConfirmInvitationOpen, setIsConfirmInvitationOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [inviteData, setInviteData] = useState(null);
  const chatBodyRef = useRef(null);

  const handleBoardConfirmClose = () => {
    setIsConfirmBoardOpen(false);
    setBoardInfo({ title: '', description: '' });
  };

  const handleBoardCreated = (boardId) => {
    setLatestBoardId(boardId);
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: 'Board created successfully!' },
    ]);
  };

  const handleColumnCreated = () => {
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: 'Column created successfully!' },
    ]);
  };

  const handleCancelColumnConfirm = () => {
    setIsConfirmColumnOpen(false);
    setColumnTitle('');
  };

  const handleInvitationConfirmed = () => {
    setIsConfirmInvitationOpen(false);
    setInviteData({ email: pendingEmail, boardId: latestBoardId });
  };

  const handleCancelInvitation = () => {
    setIsConfirmInvitationOpen(false);
    setPendingEmail('');
  };

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setInput('');

    try {
      const isBoardCreation = prompt.toLowerCase().includes('create board') || prompt.toLowerCase().includes('tạo board');
      const isColumnCreation = prompt.toLowerCase().includes('create column') || prompt.toLowerCase().includes('tạo cột');
      const isEmailExtraction = prompt.toLowerCase().includes('invite user with email');

      if (isBoardCreation) {
        const extractedData = await extractBoardInfo(prompt);
        const { title, description } = extractedData;
        setBoardInfo({ title, description });
        setIsConfirmBoardOpen(true);
      } else if (isColumnCreation) {
        const columnData = await extractColumnTitle(prompt);
        const extractedTitle = columnData.title;
        setColumnTitle(extractedTitle);
        setIsConfirmColumnOpen(true);
      } else if (isEmailExtraction) {
        const extractedEmail = await extractEmail(prompt);
        setPendingEmail(extractedEmail);
        setIsConfirmInvitationOpen(true);
      } else {
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

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

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
      <Dialog open={isConfirmColumnOpen} onClose={handleCancelColumnConfirm}>
        <DialogContent>
          <ConfirmColumnCreation
            title={columnTitle}
            boardId={latestBoardId}
            onColumnCreated={handleColumnCreated}
            onCancel={handleCancelColumnConfirm}
          />
        </DialogContent>
      </Dialog>
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
            setInviteData(null);
          }}
          onError={(err) => {
            setMessages((prev) => [
              ...prev,
              { sender: 'bot', text: `Failed to send invitation: ${err.message}` },
            ]);
            setInviteData(null);
          }}
        />
      )}
    </Box>
  );
};

export default Chatbot;