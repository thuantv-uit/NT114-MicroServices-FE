import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * Menu component for column actions
 * @param {Object} props
 * @param {Object} props.column - Column data
 * @param {string} props.boardId - Board ID
 * @param {string} props.token - Authentication token
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onAddCard - Add card handler
 * @returns {JSX.Element}
 */
const ColumnMenu = ({ column, boardId, token, onEdit, onDelete, onAddCard }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="more" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>Edit Column</MenuItem>
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>Delete Column</MenuItem>
        <MenuItem onClick={() => { onAddCard(); handleMenuClose(); }}>Add Card</MenuItem>
      </Menu>
    </>
  );
};

export default ColumnMenu;