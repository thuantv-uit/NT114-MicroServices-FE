import React from 'react';
import { CircularProgress } from '@mui/material';
import '../features/boards/styles/board.css';

/**
 * Generic form container — redesigned with board design system.
 */
const FormContainer = ({ title, children, loading }) => (
  <div className="board-page form-container">
    <h2 className="dialog-title">{title}</h2>
    {loading && (
      <div className="form-container__loading">
        <CircularProgress size={28} style={{ color: 'var(--c-primary)' }} />
      </div>
    )}
    {children}
  </div>
);

export default FormContainer;