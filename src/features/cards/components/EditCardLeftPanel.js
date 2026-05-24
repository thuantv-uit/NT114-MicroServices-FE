import React, { useState } from 'react';
import { TextField, Avatar } from '@mui/material';
import SaveIcon    from '@mui/icons-material/Save';
import CancelIcon  from '@mui/icons-material/Cancel';
import SendIcon    from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';
import '../styles/card.css';

const EditCardLeftPanel = ({
  formValues, errors, handleChange, handleSubmit, handleClose,
  loading, comments, commentText, commentError,
  handleCommentChange, handleAddComment,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeTab,      setActiveTab]      = useState('all');

  // Callback cho Markdown editor
  const handleUpdateDescription = (value) => {
    handleChange({ target: { name: 'description', value } });
  };

  return (
    <div className="edit-card-left">

      {/* ── Title ── */}
      {isEditingTitle ? (
        <TextField
          fullWidth
          name="title"
          value={formValues.title}
          onChange={handleChange}
          onBlur={() => setIsEditingTitle(false)}
          autoFocus
          variant="outlined"
          size="small"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontFamily: 'Outfit',
              fontSize: 20,
              fontWeight: 700,
            },
          }}
        />
      ) : (
        <div className="edit-card-title" onClick={() => setIsEditingTitle(true)}>
          {formValues.title || <span style={{ color: '#C4CAD4' }}>Click to edit title…</span>}
        </div>
      )}

      {/* ── Description — Markdown Editor ── */}
      <p className="edit-card-section-title" style={{ marginBottom: 4 }}>Description</p>
      <CardDescriptionMdEditor
        cardDescriptionProp={formValues.description}
        handleUpdateCardDescription={handleUpdateDescription}
      />
      {errors.description && (
        <p style={{ color: '#E53E3E', fontSize: 12, marginTop: 4, fontFamily: 'DM Sans' }}>
          {errors.description}
        </p>
      )}

      {/* ── Save / Cancel ── */}
      <div className="edit-card-save-row" style={{ marginTop: 16 }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <SaveIcon style={{ fontSize: 15 }} />
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button
          className="btn btn-ghost"
          onClick={handleClose}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <CancelIcon style={{ fontSize: 15 }} />
          Cancel
        </button>
      </div>

      {/* ── Activity ── */}
      <p className="edit-card-section-title">Activity</p>

      <div className="edit-card-tab-group">
        {['all', 'comments', 'history'].map((tab) => (
          <button
            key={tab}
            className={`edit-card-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Comment input ── */}
      <div className="edit-card-comment-box">
        <textarea
          className="edit-card-comment-textarea"
          placeholder="Add a comment… (Enter to send)"
          value={commentText}
          onChange={handleCommentChange}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        {commentError && (
          <p style={{ color: '#E53E3E', fontSize: 12, margin: '4px 0 0', fontFamily: 'DM Sans' }}>
            {commentError}
          </p>
        )}
      </div>

      {/* Add Comment — width: auto, không full width */}
      <button
        className="btn btn-primary edit-card-add-comment-btn"
        onClick={handleAddComment}
        disabled={loading || !commentText.trim()}
      >
        <SendIcon style={{ fontSize: 14 }} />
        Add Comment
      </button>

      {/* ── Comment list ── */}
      {comments.length > 0 ? (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {comments.map((c, i) => (
            <div key={i} className="comment-item">
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#EEF2FF', color: '#3B5BDB', flexShrink: 0 }}>
                <CommentIcon style={{ fontSize: 15 }} />
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="comment-item__text">{c.text}</p>
                <p className="comment-item__time">
                  {new Date(c.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="comment-empty">
          <CommentIcon style={{ fontSize: 18, opacity: 0.4 }} />
          No comments yet.
        </div>
      )}
    </div>
  );
};

export default EditCardLeftPanel;