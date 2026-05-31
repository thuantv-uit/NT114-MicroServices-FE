import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBoard, updateBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { CircularProgress } from '@mui/material';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../styles/board.css';

const ChangeBackground = ({ token, onClose }) => {
  const { id } = useParams();
  const [selectedFile,  setSelectedFile]  = useState(null);
  const [previewImage,  setPreviewImage]  = useState('');
  const [loading,       setLoading]       = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) { showToast('Please select an image', 'error'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('backgroundImage', selectedFile);
      await updateBoard(id, undefined, undefined, undefined, formData);
      showToast('Background updated!', 'success');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-page bg-dialog">
      <h2 className="dialog-title">Change Background</h2>

      {/* Upload zone */}
      <div
        className="bg-dialog__upload-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        {loading
          ? <ThunioSpinner size="md" />
          : <>
              <div className="bg-dialog__upload-icon">
                <CloudUploadIcon style={{ fontSize: 36, opacity: 0.45 }} />
              </div>
              <p className="bg-dialog__upload-text">Click to upload an image</p>
              <p className="bg-dialog__upload-hint">PNG, JPG, WEBP — max 10 MB</p>
            </>
        }
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </div>

      {/* Preview */}
      {previewImage && (
        <div className="bg-dialog__preview">
          <span className="bg-dialog__preview-label">Preview</span>
          <img src={previewImage} alt="Background preview" />
        </div>
      )}

      <div className="dialog-actions" style={{ marginTop: 20 }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !selectedFile}
        >
          {loading ? 'Saving…' : 'Save background'}
        </button>
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangeBackground;