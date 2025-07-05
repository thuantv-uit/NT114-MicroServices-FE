import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState([]);
  const chatBodyRef = useRef(null);

  const sendMessage = async (prompt) => {
    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      setContext(data.context);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${error.message}` }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">TimelineBot</div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === "user" ? (
              <span>You: {msg.text}</span>
            ) : (
              <span>
                TimelineBot: <ReactMarkdown>{msg.text}</ReactMarkdown>
              </span>
            )}
          </div>
        ))}
      </div>
      <input
        className="chat-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about boards, columns, cards..."
      />
    </div>
  );
};

export default Chatbot;