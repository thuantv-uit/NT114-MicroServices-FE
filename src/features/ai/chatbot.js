import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { extractBoardInfo, sendChatMessage } from './api';
// import BoardInfoDisplay from './BoardInfoDisplay';
import ConfirmBoardCreation from '../boards/components/ConfirmBoardCreation';
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
  const chatBodyRef = useRef(null);

  const handleConfirmClose = () => {
    // Reset boardInfo khi đóng xác nhận
    setBoardInfo({ title: '', description: '' });
  };

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    // Thêm tin nhắn người dùng vào giao diện
    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setInput('');

    try {
      // Kiểm tra xem prompt có yêu cầu tạo board không
      const isBoardCreation = prompt.toLowerCase().includes('create board') || prompt.toLowerCase().includes('tạo board');

      if (isBoardCreation) {
        // Gửi yêu cầu trích xuất title và description
        const extractedData = await extractBoardInfo(prompt);
        const { title, description } = extractedData;
        
        // In title và description ra console
        console.log('Title:', title);
        console.log('Description:', description);

        // Lưu title và description vào state để truyền làm props
        setBoardInfo({ title, description });

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `**Extracted Board Info**:\n- **Title**: ${title}\n- **Description**: ${description}`,
          },
        ]);
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
              Welcome to TimelineBot! Ask about boards, columns, cards, or say "create board" to extract board info.
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
          placeholder="Ask about boards, columns, cards, or say 'create board'..."
        />
        <button
          className="send-button"
          onClick={handleSendClick}
          disabled={!input.trim()}
        >
          Send
        </button>
      </Box>
      {/* Hiển thị thông tin board */}
      {/* <BoardInfoDisplay title={boardInfo.title} description={boardInfo.description} /> */}
      {/* Hiển thị xác nhận Yes/No để tạo board */}
      {(boardInfo.title || boardInfo.description) && (
        <ConfirmBoardCreation
          title={boardInfo.title}
          description={boardInfo.description}
          onClose={handleConfirmClose}
        />
      )}
    </Box>
  );
};

export default Chatbot;