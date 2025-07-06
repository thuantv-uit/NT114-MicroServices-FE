import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
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
  const chatBodyRef = useRef(null);

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      setContext(data.context);
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
              Welcome to TimelineBot! Ask about boards, columns, cards, or anything else.
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
          placeholder="Ask about boards, columns, cards..."
        />
        <button
          className="send-button"
          onClick={handleSendClick}
          disabled={!input.trim()}
        >
          Send
        </button>
      </Box>
    </Box>
  );
};

export default Chatbot;