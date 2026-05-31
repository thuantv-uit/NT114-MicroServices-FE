import React from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import LockIcon       from '@mui/icons-material/Lock';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ShareIcon      from '@mui/icons-material/Share';
import CloseIcon      from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../styles/card-edit.css';

const EditCardHeader = ({ onClose, boardTitle, columnTitle, cardTitle }) => (
  <div className="edit-card-header">
    <div className="edit-card-header__left">
      <EditSquareIcon style={{ fontSize: 18, color: '#3B5BDB' }} />
      <div className="edit-card-breadcrumb">
        <span className="edit-card-breadcrumb__item">{boardTitle || 'Board'}</span>
        <ChevronRightIcon style={{ fontSize: 14, color: '#C4CAD4' }} />
        <span className="edit-card-breadcrumb__item">{columnTitle || 'Column'}</span>
        <ChevronRightIcon style={{ fontSize: 14, color: '#C4CAD4' }} />
        <span className="edit-card-breadcrumb__item edit-card-breadcrumb__item--current">
          {cardTitle || 'Card'}
        </span>
      </div>
    </div>
    <div className="edit-card-header__actions">
      <button className="edit-card-header__btn" disabled title="Lock">
        <LockIcon style={{ fontSize: 17 }} />
      </button>
      <button className="edit-card-header__btn" disabled title="Watch">
        <WatchLaterIcon style={{ fontSize: 17 }} />
      </button>
      <button className="edit-card-header__btn" disabled title="Share">
        <ShareIcon style={{ fontSize: 17 }} />
      </button>
      <div className="edit-card-header__sep" />
      <button className="edit-card-header__btn edit-card-header__btn--close" onClick={onClose} title="Close">
        <CloseIcon style={{ fontSize: 17 }} />
      </button>
    </div>
  </div>
);

export default EditCardHeader;