import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ButtonGroup, Stack, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';

const EditCardLeftPanel = ({
  formValues,
  errors,
  handleChange,
  handleSubmit,
  handleClose,
  loading,
  comments,
  commentText,
  commentError,
  handleCommentChange,
  handleAddComment,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    handleChange(e);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    handleAddComment();
  };

  return (
    <Box
      sx={{
        width: '70%',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        padding: '16px',
        borderRight: '1px solid #e0e0e0',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc',
      }}
    >
      {!isEditingTitle ? (
        <Typography
          variant="h5"
          sx={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', mb: 2 }}
          onClick={handleTitleClick}
        >
          {formValues.title || 'Click to edit'}
        </Typography>
      ) : (
        <TextField
          fullWidth
          name="title"
          value={formValues.title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
            },
          }}
        />
      )}
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formValues.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
        multiline
        minRows={3}
        disabled={loading}
        sx={{
          mb: 0,
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            width: '100%',
          },
        }}
      />
      <Stack direction="row" spacing={0.5} sx={{ mt: 1, padding: 0, margin: 0 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
          sx={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Cancel
        </Button>
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '18px', mb: 2 }}>
          Activity
        </Typography>
        <ButtonGroup variant="outlined" size="small" aria-label="activity buttons">
          <Button>All</Button>
          <Button>Comments</Button>
          <Button>History</Button>
          <Button>Work log</Button>
        </ButtonGroup>
        <Box sx={{ mt: 2 }}>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              label="Add a comment"
              value={commentText}
              onChange={handleCommentChange}
              error={!!commentError}
              helperText={commentError}
              multiline
              rows={2}
              disabled={loading}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#3b4252' : '#fff',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !commentText.trim()}
              startIcon={<SendIcon />}
              sx={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              Add Comment
            </Button>
          </form>
          <List sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto' }}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 1,
                    borderRadius: '8px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#3b4252' : '#f5f6f8',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    p: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.light, width: 32, height: 32 }}>
                      <CommentIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.text}
                    secondary={new Date(comment.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    primaryTypographyProps={{
                      variant: 'body1',
                      sx: { fontWeight: '500', color: (theme) => theme.palette.text.primary },
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: { color: (theme) => theme.palette.text.secondary },
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '8px',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#3b4252' : '#f5f6f8',
                }}
              >
                <CommentIcon sx={{ mr: 1, color: (theme) => theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default EditCardLeftPanel;