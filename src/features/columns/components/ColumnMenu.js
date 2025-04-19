import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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