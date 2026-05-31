import React, { useState } from 'react';
import { TextField, Avatar } from '@mui/material';
import SaveIcon    from '@mui/icons-material/Save';
import CancelIcon  from '@mui/icons-material/Cancel';
import SendIcon    from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';
import '../styles/card-edit.css';

const EditCardLeftPanel = ({
  formValues, errors, handleChange, handleSubmit, handleClose,
  loading, comments, commentText, commentError,
  handleCommentChange, handleAddComment,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeTab,      setActiveTab]      = useState('all');

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
          error={!!errors.title}
          helperText={errors.title}
          sx={{
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

      {/* ── Description ── */}
      <div>
        <p className="edit-card-section-title">
          <AlignHorizontalLeftIcon style={{ fontSize: 15 }} />
          Description
        </p>
        <CardDescriptionMdEditor
          cardDescriptionProp={formValues.description}
          handleUpdateCardDescription={handleUpdateDescription}
        />
        {errors.description && (
          <p className="edit-card-field-error">{errors.description}</p>
        )}
      </div>

      {/* ── Save / Cancel ── */}
      <div className="edit-card-save-row">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          <SaveIcon style={{ fontSize: 15 }} />
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        <button className="btn btn-ghost" onClick={handleClose} disabled={loading}>
          <CancelIcon style={{ fontSize: 15 }} />
          Cancel
        </button>
      </div>

      {/* ── Activity ── */}
      <div>
        <p className="edit-card-section-title">
          <LocalActivityIcon style={{ fontSize: 15 }} />
          Activity
        </p>

        <div className="edit-card-tab-group">
          {['all', 'comments', 'history'].map(tab => (
            <button
              key={tab}
              className={`edit-card-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Comment input */}
        <div className="edit-card-comment-box">
          <textarea
            className="edit-card-comment-textarea"
            placeholder="Add a comment…"
            value={commentText}
            onChange={handleCommentChange}
            disabled={loading}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          {commentError && (
            <p className="edit-card-field-error" style={{ margin: '4px 0 0' }}>{commentError}</p>
          )}
          <div className="edit-card-comment-actions">
            <span className="edit-card-comment-hint">↵ Enter to send · Shift+Enter for new line</span>
            <button
              className="btn btn-primary"
              style={{ padding: '5px 12px', fontSize: 12 }}
              onClick={handleAddComment}
              disabled={loading || !commentText.trim()}
            >
              <SendIcon style={{ fontSize: 13 }} />
              Send
            </button>
          </div>
        </div>

        {/* Comment list */}
        {comments.length > 0 ? (
          <div className="edit-card-comment-list">
            {comments.map((c, i) => (
              <div key={i} className="comment-item">
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#EEF2FF', color: '#3B5BDB', flexShrink: 0 }}>
                  <MessageIcon style={{ fontSize: 14 }} />
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
            <MessageIcon style={{ fontSize: 18, opacity: 0.4 }} />
            No comments yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCardLeftPanel;