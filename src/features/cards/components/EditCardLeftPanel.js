import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ButtonGroup, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditCardLeftPanel = ({ formValues, errors, handleChange, handleSubmit, handleClose, loading }) => {
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
          value={formValues.title} // Giữ nguyên nội dung cũ
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0, // Khung vuông vức
            },
          }}
        />
      )}
      <TextField
        fullWidth
        label="Description" // Đặt "Description" làm label trực tiếp trên khung
        name="description"
        value={formValues.description} // Giữ nguyên nội dung cũ
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
        multiline
        minRows={3}
        disabled={loading}
        sx={{
          mb: 0, // Loại bỏ margin bottom để sát khung
          '& .MuiOutlinedInput-root': {
            borderRadius: 0, // Khung vuông vức
            width: '100%', // Chiều dài hết cỡ
          },
        }}
      />
      <Stack direction="row" spacing={0.5} sx={{ mt: 1, padding: 0, margin: 0 }}> {/* Tăng mt để cách ra 1 tí */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{
            fontSize: '12px', // Giảm kích thước font
            padding: '4px 8px', // Giảm padding
            borderRadius: '2px', // Giảm bo góc
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
            fontSize: '12px', // Giảm kích thước font
            padding: '4px 8px', // Giảm padding
            borderRadius: '2px', // Giảm bo góc
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
      </Box>
      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Enter additional details (to be updated later)"
          multiline
          rows={4}
          placeholder="Add notes or details here..."
          disabled={true}
          sx={{ mb: 2 }}
        />
      </Box>
    </Box>
  );
};

export default EditCardLeftPanel;