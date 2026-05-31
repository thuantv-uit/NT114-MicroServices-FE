import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import MoreVertIcon  from '@mui/icons-material/MoreVert';
import EditIcon      from '@mui/icons-material/Edit';
import DeleteIcon    from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InviteToColumn from '../../invitations/components/InviteToColumn';
import '../styles/column.css';

const ColumnMenu = ({ column, boardId, token, onEdit, onDelete }) => {
  const [anchorEl,        setAnchorEl]        = useState(null);
  const [openInviteColumn, setOpenInviteColumn] = useState(false);
  const open = Boolean(anchorEl);

  const close = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        className="col-icon-btn"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Column options"
      >
        <MoreVertIcon style={{ fontSize: 18 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '10px',
            border: '1px solid #E4E7ED',
            minWidth: 180,
            py: 0.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          className="col-menu-item"
          onClick={() => { onEdit(); close(); }}
        >
          <ListItemIcon><EditIcon style={{ fontSize: 17, color: '#4A5568' }} /></ListItemIcon>
          Edit Column
        </MenuItem>

        <MenuItem
          className="col-menu-item"
          onClick={() => { setOpenInviteColumn(true); close(); }}
        >
          <ListItemIcon><PersonAddIcon style={{ fontSize: 17, color: '#4A5568' }} /></ListItemIcon>
          Invite to Column
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          className="col-menu-item col-menu-item--danger"
          onClick={() => { onDelete(); close(); }}
        >
          <ListItemIcon><DeleteIcon style={{ fontSize: 17, color: '#E53E3E' }} /></ListItemIcon>
          Delete Column
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