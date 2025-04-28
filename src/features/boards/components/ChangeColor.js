import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import { Box, TextField, Button } from '@mui/material';

/**
 * Component to change the background color of a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const ChangeColor = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setBackgroundColor(data.backgroundColor || '#FFFFFF');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await updateBoard(id, undefined, undefined, backgroundColor);
      showToast('Background color updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${id}`), 2000);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <FormContainer title="Change Board Background Color" loading={loading}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
        <TextField
          type="color"
          label="Select Background Color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/boards/${id}`)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default ChangeColor;