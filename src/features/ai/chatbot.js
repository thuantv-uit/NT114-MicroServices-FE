import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon, Remove as MinimizeIcon, OpenInFull as ExpandIcon } from '@mui/icons-material';
import { askQuestion, parseActions, checkHealth } from './api';
import { createBoard, fetchLatestBoardId } from '../boards/services/boardService';
import { createColumn } from '../columns/services/columnService';
import { invitationInstance } from '../../services/axiosConfig';
import { handleApiCall } from '../../utils/apiHelper';
import { showToast } from '../../utils/toastUtils';
import { ThunioSpinner } from '../../Logo/components/ThunioSpinner';
import './chatbot.css';

// ── Suggestions ────────────────────────────────────────────────
const SUGGESTIONS = {
  question: ['What boards do I have?', 'Show card summary', 'Explain columns'],
  action:   ['Create board "My Project"', 'Add column "In Progress"', 'Invite user@email.com'],
};

// ── Validation ─────────────────────────────────────────────────
const MIN_LEN = 5;

const validateItem = (object, fields) => {
  if (object === 'board') {
    if (!fields.title || fields.title.trim().length < MIN_LEN)
      return `Board title must be at least ${MIN_LEN} characters.`;
    if (!fields.description || fields.description.trim().length < MIN_LEN)
      return `Board description must be at least ${MIN_LEN} characters.`;
  }
  if (object === 'column') {
    if (!fields.title || fields.title.trim().length < MIN_LEN)
      return `Column title must be at least ${MIN_LEN} characters.`;
  }
  if (object === 'invite') {
    if (!fields.email || !fields.email.includes('@'))
      return `Invalid email: "${fields.email || ''}".`;
  }
  return null;
};

const flattenResults = (results) => {
  const items = [];
  for (const result of results) {
    const { object, fields } = result;
    const arr = Array.isArray(fields) ? fields : [fields];
    for (const f of arr)
      items.push({ object, fields: f, error: validateItem(object, f) });
  }
  return items;
};

// ── ConfirmTable ───────────────────────────────────────────────
const ConfirmTable = ({ items, onConfirm, onCancel }) => {
  const hasErrors = items.some((i) => i.error);

  const labelOf = (object, fields) => {
    if (object === 'board')  return `"${fields.title}" — ${fields.description}`;
    if (object === 'column') return `"${fields.title}"`;
    if (object === 'invite') return `${fields.email} (role: ${fields.role || 'viewer'})`;
    return object;
  };

  return (
    <div className="confirm-table">
      <p className="confirm-table__heading">Review before confirming:</p>
      <table className="confirm-table__grid">
        <thead>
          <tr><th>#</th><th>Type</th><th>Details</th><th>Status</th></tr>
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
        <p className="confirm-table__error-note">⚠️ Fix invalid items before proceeding.</p>
      )}
      <div className="confirm-table__actions">
        <button className="confirm-btn confirm-btn--primary" onClick={onConfirm} disabled={hasErrors}>
          Confirm & Create
        </button>
        <button className="confirm-btn confirm-btn--secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

// ── Default sizes ──────────────────────────────────────────────
const DEFAULT_W = 520;
const DEFAULT_H = 680;
const NAVBAR_H  = 60;   // keep in sync with --navbar-h

// ── Main Chatbot component ─────────────────────────────────────
const Chatbot = ({ onClose }) => {
  // ── Window position & size state ────────────────────────────
  const [pos,  setPos]  = useState({ x: window.innerWidth  - DEFAULT_W - 28, y: window.innerHeight - DEFAULT_H - 28 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [isDragging,  setIsDragging]  = useState(false);
  const [isResizing,  setIsResizing]  = useState(false);

  const dragStart  = useRef(null);  // { mouseX, mouseY, posX, posY }
  const resizeStart = useRef(null); // { mouseX, mouseY, w, h, x, y }

  // ── Chat state ───────────────────────────────────────────────
  const [mode,         setMode]         = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState('');
  const [isTyping,     setIsTyping]     = useState(false);
  const [healthStatus, setHealthStatus] = useState('idle');
  const [pendingItems, setPendingItems] = useState(null);
  const [latestBoardId, setLatestBoardId] = useState(null);

  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  // Clamp position so window stays inside viewport and below navbar
  const clamp = useCallback((x, y, w, h) => {
    const maxX = window.innerWidth  - w;
    const maxY = window.innerHeight - h;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(NAVBAR_H, Math.min(y, maxY)),
    };
  }, []);

  // ── Drag ─────────────────────────────────────────────────────
  const onDragMouseDown = (e) => {
    // Only drag from header; ignore button clicks
    if (e.target.closest('button')) return;
    e.preventDefault();
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, posX: pos.x, posY: pos.y };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      const raw = { x: dragStart.current.posX + dx, y: dragStart.current.posY + dy };
      setPos(clamp(raw.x, raw.y, size.w, size.h));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, size, clamp]);

  // ── Resize ───────────────────────────────────────────────────
  const onResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, w: size.w, h: size.h };
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const dx = e.clientX - resizeStart.current.mouseX;
      const dy = e.clientY - resizeStart.current.mouseY;
      const newW = Math.max(320, Math.min(resizeStart.current.w + dx, window.innerWidth  - pos.x));
      const newH = Math.max(400, Math.min(resizeStart.current.h + dy, window.innerHeight - pos.y));
      setSize({ w: newW, h: newH });
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isResizing, pos]);

  // ── Auto-scroll & textarea resize ────────────────────────────
  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isTyping, pendingItems]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`; }
  }, [input]);

  // ── Health check ──────────────────────────────────────────────
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

  // ── Message helpers ───────────────────────────────────────────
  const pushMessage = (text, sender = 'bot', extra = {}) =>
    setMessages((prev) => [...prev, { sender, text, ...extra }]);

  // ── Executors ─────────────────────────────────────────────────
  const execCreateBoard = async (fields) => {
    const { title, description, backgroundColor = '#FFFFFF' } = fields;
    pushMessage(`Creating board **"${title}"**…`);
    try {
      await createBoard(title, description || '', backgroundColor);
      showToast('Board created!', 'success');
      const res = await fetchLatestBoardId();
      if (res?.boardId) setLatestBoardId(res.boardId);
      pushMessage(`✅ Board **"${title}"** created!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to create board: ${err.message}`);
    }
  };

  const execCreateColumn = async (fields, boardId) => {
    const { title } = fields;
    const bid = fields.boardId || boardId;
    if (!bid) { pushMessage(`❌ Column **"${title}"** skipped: no board found.`); return; }
    pushMessage(`Creating column **"${title}"**…`);
    try {
      await createColumn(title, bid);
      showToast('Column created!', 'success');
      pushMessage(`✅ Column **"${title}"** created!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to create column: ${err.message}`);
    }
  };

  const execInvite = async (fields, boardId) => {
    const { email, role = 'viewer' } = fields;
    const bid = fields.boardId || boardId;
    if (!bid) { pushMessage(`❌ Invite to **${email}** skipped: no board found.`); return; }
    pushMessage(`Inviting **${email}** as **${role}**…`);
    try {
      await handleApiCall(
        () => invitationInstance.post('/board', { boardId: bid, email, role }).then(r => r.data),
        'Invite user to board'
      );
      showToast('Invitation sent!', 'success');
      pushMessage(`✅ Invitation sent to **${email}** (role: **${role}**)!`);
    } catch (err) {
      showToast(err.message, 'error');
      pushMessage(`❌ Failed to invite: ${err.message}`);
    }
  };

  // ── Confirm handler ───────────────────────────────────────────
  const handleConfirm = async () => {
    const items = pendingItems;
    setPendingItems(null);
    setIsTyping(true);
    let currentBoardId = latestBoardId;

    for (const item of items) {
      if (item.error) continue;
      if (item.object === 'board') {
        await execCreateBoard(item.fields);
        try { const r = await fetchLatestBoardId(); currentBoardId = r?.boardId ?? currentBoardId; } catch (_) {}
      } else if (item.object === 'column') {
        await execCreateColumn(item.fields, currentBoardId);
      } else if (item.object === 'invite') {
        await execInvite(item.fields, currentBoardId);
      }
    }
    setIsTyping(false);
  };

  const handleCancel = () => { setPendingItems(null); pushMessage('Action cancelled.'); };

  // ── Send ──────────────────────────────────────────────────────
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

      const results = await parseActions(trimmed);
      setIsTyping(false);

      if (!results || results.length === 0) {
        pushMessage("I couldn't detect any actions. Try: \"Create board X\", \"Add column Y\", or \"Invite user@mail.com\".");
        return;
      }

      const items = flattenResults(results);
      if (items.every((i) => i.error)) {
        items.forEach((i) => pushMessage(`❌ ${i.error}`));
        return;
      }
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

  // ── Derived UI ────────────────────────────────────────────────
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
      : 'Use **Action** mode to create boards, add columns, or invite teammates.';

  // Clamp position on mount / window resize
  useEffect(() => {
    const onResize = () => setPos((p) => clamp(p.x, p.y, size.w, size.h));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [size, clamp]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div
      className={`chat-float${isDragging ? ' chat-float--dragging' : ''}`}
      style={{
        left:   pos.x,
        top:    pos.y,
        width:  size.w,
        height: size.h,
        // override bottom/right from CSS so top/left take over
        bottom: 'auto',
        right:  'auto',
      }}
    >
      <div className="chat-container">

        {/* ── Header (drag handle) ── */}
        <div className="chat-header" onMouseDown={onDragMouseDown}>
          <div className="chat-header-left">
            <div className="chat-bot-avatar">🤖</div>
            <div className="chat-header-info">
              <span className="chat-header-title">TimelineBot</span>
              <span className={`chat-header-status ${healthLabel.cls}`}>
                {healthLabel.text}
              </span>
            </div>
          </div>

          <div className="chat-header-actions">
            {/* Close */}
            <button
              className="chat-header-btn chat-header-btn--close"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Mode selector ── */}
        <div className="chat-mode-selector">
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
        </div>

        {/* ── Suggestion chips ── */}
        {mode && healthStatus === 'online' && (
          <div className="chat-suggestions">
            {SUGGESTIONS[mode].map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* ── Connection banner ── */}
        {mode && healthStatus !== 'online' && (
          <div className={`health-banner ${healthStatus === 'checking' ? 'health-banner--checking' : 'health-banner--offline'}`}>
            {healthStatus === 'checking' 
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThunioSpinner size="sm" /> Checking connection…
              </span>
            : '🔴 Service unreachable. Try switching mode again.'}
          </div>
        )}

        {/* ── Chat body ── */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.length === 0 && !pendingItems ? (
            <div className="message bot welcome">
              <ReactMarkdown>{welcomeText}</ReactMarkdown>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}${msg.isAction ? ' action-badge' : ''}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))
          )}

          {pendingItems && (
            <ConfirmTable items={pendingItems} onConfirm={handleConfirm} onCancel={handleCancel} />
          )}

          {isTyping && (
            <div className="typing-indicator">
              <ThunioSpinner size="sm" />
              <span style={{ fontSize: 12, color: 'var(--c-text-3)' }}>TimelineBot is thinking…</span>
            </div>
          )}
        </div>

        {/* ── Input ── */}
        <div className="chat-input-container">
          <div className={`chat-input-wrapper${isInputDisabled ? ' disabled' : ''}`}>
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !mode                         ? 'Select a mode first…'
                : healthStatus === 'checking' ? 'Connecting…'
                : healthStatus === 'offline'  ? 'Service unavailable…'
                : pendingItems                ? 'Confirm or cancel above…'
                : mode === 'question'         ? 'Ask a question… (Enter to send)'
                :                              'Describe an action… (Enter to send)'
              }
              disabled={isInputDisabled}
              rows={1}
            />
          </div>
          <button
            className="send-button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isInputDisabled}
            title="Send"
          >
            ➤
          </button>
        </div>

      </div>

      {/* ── Resize handle ── */}
      <div className="chat-resize-handle" onMouseDown={onResizeMouseDown} />
    </div>
  );
};

export default Chatbot;