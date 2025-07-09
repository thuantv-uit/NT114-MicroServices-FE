import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import FormContainer from '../../../components/FormContainer';
import { Box, Button, Typography, Input } from '@mui/material';

/**
 * Component to upload a background image for a board
 * @param {Object} props
 * @param {string} props.token - Authentication token
 * @returns {JSX.Element}
 */
const ChangeColor = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load board data
  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      try {
        const data = await fetchBoard(id);
        setPreviewImage(data.backgroundImage || '');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id]);

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle file submission to backend
  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast('Please select an image', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('backgroundImage', selectedFile);

      // Send file to backend
      await updateBoard(id, undefined, undefined, undefined, formData);
      showToast('Background updated successfully!', 'success');
      setTimeout(() => navigate(`/boards/${id}`, { state: { refresh: true } }), 2000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Change Board Background" loading={loading}>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* File Input */}
        <Typography variant="h6" gutterBottom>
          Upload Background Image
        </Typography>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />

        {/* Image Preview */}
        {previewImage && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" gutterBottom>
              Preview
            </Typography>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/boards/${id}`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default ChangeColor;