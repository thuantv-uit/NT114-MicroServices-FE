import React from 'react';
import { Box, Typography, Slider, FormHelperText, Button } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

const EditCardRightPanel = ({ processValue, setProcessValue, processError, handleUpdateProcess, loading }) => {
  const handleChange = (e, newValue) => {
    setProcessValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateProcess();
  };

  return (
    <Box
      sx={{
        width: '30%',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f9fafc',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '18px', mb: 2 }}>
        Completion Progress
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography gutterBottom>Mức độ hoàn thành (%): {processValue}</Typography>
          <Slider
            value={processValue}
            onChange={handleChange}
            aria-label="Completion Progress"
            valueLabelDisplay="auto"
            step={5}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: '100%' },
            ]}
            min={0}
            max={100}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
              },
            }}
            disabled={loading}
          />
          {processError && (
            <FormHelperText error sx={{ mt: 1 }}>
              {processError}
            </FormHelperText>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<LinearScaleIcon />}
            sx={{ mt: 2 }}
          >
            Update Progress
          </Button>
        </Box>
      </form>
      <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '18px', mb: 2 }}>
          Card Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (This section will be updated with card details later)
        </Typography>
      </Box>
    </Box>
  );
};

export default EditCardRightPanel;