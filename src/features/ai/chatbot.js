import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { askQuestion, parseActions, checkHealth } from './api';
import { createBoard, fetchLatestBoardId } from '../boards/services/boardService';
import { createColumn } from '../columns/services/columnService';
import { invitationInstance } from '../../services/axiosConfig';
import { handleApiCall } from '../../utils/apiHelper';
import { showToast } from '../../utils/toastUtils';
import './chatbot.css';

// ── Suggestions ────────────────────────────────────────────────────────────────
const SUGGESTIONS = {
  question: ['What boards do I have?', 'Show card summary', 'Explain columns'],
  action:   ['Create board "My Project"', 'Add column "In Progress"', 'Invite user@email.com'],
};

// ── Validation ─────────────────────────────────────────────────────────────────
const MIN_LEN = 5;

/**
 * Validate a single flat item before showing it in the confirm table.
 * Returns an error string, or null if valid.
 * @param {'board'|'column'|'invite'} object
 * @param {Record<string,any>} fields
 * @returns {string|null}
 */
const validateItem = (object, fields) => {
  if (object === 'board') {
    if (!fields.title || fields.title.trim().length < MIN_LEN)
      return `Board title must be at least ${MIN_LEN} characters (got "${fields.title || ''}").`;
    if (!fields.description || fields.description.trim().length < MIN_LEN)
      return `Board description must be at least ${MIN_LEN} characters (got "${fields.description || ''}").`;
  }
  if (object === 'column') {
    if (!fields.title || fields.title.trim().length < MIN_LEN)
      return `Column title must be at least ${MIN_LEN} characters (got "${fields.title || ''}").`;
  }
  if (object === 'invite') {
    if (!fields.email || !fields.email.includes('@'))
      return `Invalid email address: "${fields.email || ''}".`;
  }
  return null;
};

/**
 * Flatten API results into a list of individual items ready for confirmation.
 * Each result's fields may be a single object OR an array (for multiple columns/invites).
 *
 * @param {Array<{object:string, action:string, fields:object|object[]}>} results
 * @returns {{ object:string, fields:object, error:string|null }[]}
 */
const flattenResults = (results) => {
  const items = [];
  for (const result of results) {
    const { object, fields } = result;
    const fieldsArray = Array.isArray(fields) ? fields : [fields];
    for (const f of fieldsArray) {
      items.push({ object, fields: f, error: validateItem(object, f) });
    }
  }
  return items;
};

// ── ConfirmTable sub-component ─────────────────────────────────────────────────
/**
 * Inline confirmation table rendered inside the chat body.
 * Shows all pending items with their validation status.
 * Confirm / Cancel buttons trigger the parent's callbacks.
 */
const ConfirmTable = ({ items, onConfirm, onCancel }) => {
  const hasErrors = items.some((i) => i.error);

  const labelOf = (object, fields) => {
    if (object === 'board')  return `Board: "${fields.title}" — ${fields.description}`;
    if (object === 'column') return `Column: "${fields.title}"`;
    if (object === 'invite') return `Invite: ${fields.email} (role: ${fields.role || 'viewer'})`;
    return object;
  };

  return (
    <div className="confirm-table">
      <p className="confirm-table__heading">Review before confirming:</p>
      <table className="confirm-table__grid">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className={item.error ? 'confirm-row--error' : 'confirm-row--ok'}>
              <td>{idx + 1}</td>
              <td><span className={`confirm-badge confirm-badge--${item.object}`}>{item.object}</span></td>
              <td>{labelOf(item.object, item.fields)}</td>
              <td>
                {item.error
                  ? <span className="confirm-status confirm-status--error" title={item.error}>✗ Invalid</span>
                  : <span className="confirm-status confirm-status--ok">✓ OK</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasErrors && (
        <p className="confirm-table__error-note">
          ⚠️ Fix the invalid items above before proceeding.
        </p>
      )}

      <div className="confirm-table__actions">
        <button
          className="confirm-btn confirm-btn--primary"
          onClick={onConfirm}
          disabled={hasErrors}
        >
          Confirm & Create
        </button>
        <button className="confirm-btn confirm-btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// ── Main Chatbot component ─────────────────────────────────────────────────────
const Chatbot = ({ onClose }) => {
  const [mode, setMode]                 = useState(null);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const [healthStatus, setHealthStatus] = useState('idle');

  // pendingItems: set when /query returns results, cleared after confirm/cancel
  const [pendingItems, setPendingItems] = useState(null); // null = no table shown

  // latestBoardId: updated after a board is successfully created
  const [latestBoardId, setLatestBoardId] = useState(null);

  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isTyping, pendingItems]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; }
  }, [input]);

  // ── Health check ──────────────────────────────────────────────────────────────
  const runHealthCheck = useCallback(async (nextMode) => {
    setHealthStatus('checking');
    setMessages([]);
    setPendingItems(null);
    const ok = await checkHealth(nextMode === 'question' ? 'question' : 'action');
    setHealthStatus(ok ? 'online' : 'offline');
  }, []);

  const handleModeSwitch = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setInput('');
    runHealthCheck(nextMode);
  };

  // ── Message helper ────────────────────────────────────────────────────────────
  const pushMessage = (text, sender = 'bot', extra = {}) =>
    setMessages((prev) => [...prev, { sender, text, ...extra }]);

  // ── Individual creators ───────────────────────────────────────────────────────
  const execCreateBoard = async (fields) => {
    // Validation already passed in flattenResults; just call the service
    const { title, description, backgroundColor = '#FFFFFF' } = fields;
    pushMessage(`Creating board **"${title}"**…`);
    try {
      await createBoard(title, description || '', backgroundColor);
      showToast('Board created successfully!', 'success');
      const res = await fetchLatestBoardId();
      const boardId = res?.boardId ?? null;
      if (boardId) setLatestBoardId(boardId);
      pushMessage(`✅ Board **"${title}"** created!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to create board **"${title}"**: ${err.message}`);
    }
  };

  const execCreateColumn = async (fields, currentBoardId) => {
    const { title } = fields;
    const boardId = fields.boardId || currentBoardId;
    if (!boardId) {
      pushMessage(`❌ Column **"${title}"** skipped: no board available. Create a board first.`);
      return;
    }
    pushMessage(`Creating column **"${title}"**…`);
    try {
      await createColumn(title, boardId);
      showToast('Column created successfully!', 'success');
      pushMessage(`✅ Column **"${title}"** created!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to create column **"${title}"**: ${err.message}`);
    }
  };

  const execInvite = async (fields, currentBoardId) => {
    const { email, role = 'viewer' } = fields;   // default role: viewer
    const boardId = fields.boardId || currentBoardId;
    if (!boardId) {
      pushMessage(`❌ Invite to **${email}** skipped: no board available. Create a board first.`);
      return;
    }
    pushMessage(`Inviting **${email}** as **${role}**…`);
    try {
      await handleApiCall(
        () => invitationInstance.post('/board', { boardId, email, role }).then(r => r.data),
        'Invite user to board'
      );
      showToast('Invitation sent!', 'success');
      pushMessage(`✅ Invitation sent to **${email}** (role: **${role}**)!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to invite **${email}**: ${err.message}`);
    }
  };

  // ── Confirm handler: execute all valid items in order ──────────────────────── 
  const handleConfirm = async () => {
    const items = pendingItems;
    setPendingItems(null); // hide table immediately
    // Input disabled during execution via isTyping
    setIsTyping(true);

    // Track boardId across items so columns/invites created in same batch
    // can use a board created earlier in the same batch
    let currentBoardId = latestBoardId;

    for (const item of items) {
      if (item.error) continue; // skip invalid (shouldn't reach here, button was disabled)

      if (item.object === 'board') {
        await execCreateBoard(item.fields);
        // After creating a board, update local tracker from state
        // (setLatestBoardId is async, so we fetch directly)
        try {
          const res = await fetchLatestBoardId();
          currentBoardId = res?.boardId ?? currentBoardId;
        } catch (_) {}
      } else if (item.object === 'column') {
        await execCreateColumn(item.fields, currentBoardId);
      } else if (item.object === 'invite') {
        await execInvite(item.fields, currentBoardId);
      }
    }

    setIsTyping(false);
  };

  const handleCancel = () => {
    setPendingItems(null);
    pushMessage('Action cancelled.');
  };

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = async (prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed || healthStatus !== 'online' || isTyping || pendingItems) return;

    pushMessage(trimmed, 'user');
    setInput('');
    setIsTyping(true);

    try {
      if (mode === 'question') {
        const answer = await askQuestion(trimmed);
        setIsTyping(false);
        pushMessage(answer);
        return;
      }

      // ── Action mode ───────────────────────────────────────────────────────────
      const results = await parseActions(trimmed);
      setIsTyping(false);

      if (!results || results.length === 0) {
        pushMessage(
          "I couldn't detect any actions. " +
          'Try: "Create board X", "Add column Y to board", or "Invite user@mail.com".'
        );
        return;
      }

      // Flatten results → individual items with per-item validation
      const items = flattenResults(results);

      // If ALL items are invalid, report immediately — no table needed
      const allInvalid = items.every((i) => i.error);
      if (allInvalid) {
        items.forEach((i) => pushMessage(`❌ ${i.error}`));
        return;
      }

      // Otherwise show the confirm table (even if some items have errors)
      setPendingItems(items);

    } catch (err) {
      setIsTyping(false);
      pushMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Derived UI ────────────────────────────────────────────────────────────────
  // Block input while typing OR while confirm table is open
  const isInputDisabled = healthStatus !== 'online' || isTyping || !!pendingItems;

  const healthLabel = {
    idle:     { text: 'Select a mode', cls: '' },
    checking: { text: 'Connecting…',   cls: 'health-checking' },
    online:   { text: 'Connected',     cls: 'health-online'   },
    offline:  { text: 'Unavailable',   cls: 'health-offline'  },
  }[healthStatus];

  const welcomeText = !mode
    ? 'Select a mode above to get started. 👆'
    : mode === 'question'
      ? "Ask me anything about your boards, columns, and cards. I'm here to help! 👋"
      : 'Use **Action** mode to create boards, add columns, or invite teammates. Try a suggestion above!';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box className="chat-container">

      {/* Header */}
      <Box className="chat-header">
        <Box className="chat-header-left">
          <Box className="chat-bot-avatar">🤖</Box>
          <Box className="chat-header-info">
            <span className="chat-header-title">TimelineBot</span>
            <span className={`chat-header-status ${healthLabel.cls}`}>
              {healthLabel.text}
            </span>
          </Box>
        </Box>
        <IconButton className="chat-close-btn" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Mode selector */}
      <Box className="chat-mode-selector">
        <button
          className={`mode-btn ${mode === 'question' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('question')}
        >
          <span className="mode-icon">💬</span>Question
        </button>
        <button
          className={`mode-btn ${mode === 'action' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('action')}
        >
          <span className="mode-icon">⚡</span>Action
        </button>
      </Box>

      {/* Suggestion chips */}
      {mode && healthStatus === 'online' && (
        <Box className="chat-suggestions">
          {SUGGESTIONS[mode].map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </Box>
      )}

      {/* Connection banner */}
      {mode && healthStatus !== 'online' && (
        <Box className={`health-banner ${
          healthStatus === 'checking' ? 'health-banner--checking' : 'health-banner--offline'
        }`}>
          {healthStatus === 'checking'
            ? '🔄 Checking connection to service…'
            : '🔴 Service unreachable. Check the backend and try switching mode again.'}
        </Box>
      )}

      {/* Chat body */}
      <Box className="chat-body" ref={chatBodyRef}>
        {messages.length === 0 && !pendingItems ? (
          <Box className="message bot welcome">
            <ReactMarkdown>{welcomeText}</ReactMarkdown>
          </Box>
        ) : (
          messages.map((msg, i) => (
            <Box key={i} className={`message ${msg.sender}${msg.isAction ? ' action-badge' : ''}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </Box>
          ))
        )}

        {/* Confirm table — rendered inside chat body, below messages */}
        {pendingItems && (
          <ConfirmTable
            items={pendingItems}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}

        {isTyping && (
          <Box className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box className="chat-input-container">
        <Box className={`chat-input-wrapper ${isInputDisabled ? 'disabled' : ''}`}>
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !mode                         ? 'Select a mode first…'
              : healthStatus === 'checking' ? 'Connecting to service…'
              : healthStatus === 'offline'  ? 'Service unavailable…'
              : pendingItems                ? 'Confirm or cancel the action above…'
              : mode === 'question'         ? 'Ask a question… (Enter to send)'
              :                              'Describe an action… (Enter to send)'
            }
            disabled={isInputDisabled}
            rows={1}
          />
        </Box>
        <button
          className="send-button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isInputDisabled}
          title="Send"
        >
          ➤
        </button>
      </Box>
    </Box>
  );
};

export default Chatbot;