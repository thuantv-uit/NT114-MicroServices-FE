import React from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import LockIcon      from '@mui/icons-material/Lock';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ShareIcon     from '@mui/icons-material/Share';
import CloseIcon     from '@mui/icons-material/Close';
import '../styles/card.css';

const EditCardHeader = ({ onClose }) => (
  <div className="edit-card-header">
    <div className="edit-card-header__left">
      <EditSquareIcon style={{ fontSize: 20 }} />
      <span>Edit Card</span>
    </div>
    <div className="edit-card-header__actions">
      <button className="edit-card-header__btn" disabled title="Lock"><LockIcon style={{ fontSize: 18 }} /></button>
      <button className="edit-card-header__btn" disabled title="Watch"><WatchLaterIcon style={{ fontSize: 18 }} /></button>
      <button className="edit-card-header__btn" disabled title="Share"><ShareIcon style={{ fontSize: 18 }} /></button>
      <button className="edit-card-header__btn edit-card-header__btn--close" onClick={onClose} title="Close">
        <CloseIcon style={{ fontSize: 18 }} />
      </button>
    </div>
  </div>
);

export default EditCardHeader;