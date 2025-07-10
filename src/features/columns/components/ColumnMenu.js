import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InviteToColumn from '../../invitations/components/InviteToColumn';

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
  const [openInviteColumn, setOpenInviteColumn] = useState(false);
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
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Column
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Column
        </MenuItem>
        <MenuItem onClick={() => { onAddCard(); handleMenuClose(); }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add Card
        </MenuItem>
        <MenuItem onClick={() => { setOpenInviteColumn(true); handleMenuClose(); }}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          Invite User to Column
        </MenuItem>
      </Menu>
      <InviteToColumn
        boardId={boardId}
        column={column}
        open={openInviteColumn}
        onClose={() => setOpenInviteColumn(false)}
      />
    </>
  );
};

export default ColumnMenu;