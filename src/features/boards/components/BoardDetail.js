import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchBoard } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import ColumnList from '../../columns/components/ColumnList';
import InviteToBoard from '../../invitations/components/InviteToBoard';
import UpdateBoard from './UpdateBoard';
import ChangeBackground from './ChangeColor';
import DeleteBoard from './DeleteBoard';
import CreateColumn from '../../columns/components/CreateColumn';
import {
  CircularProgress, Tooltip, Dialog, styled, Box,
} from '@mui/material';
import PaletteIcon      from '@mui/icons-material/Palette';
import EditIcon         from '@mui/icons-material/Edit';
import DeleteIcon       from '@mui/icons-material/Delete';
import PersonAddIcon    from '@mui/icons-material/PersonAdd';
import AddIcon          from '@mui/icons-material/Add';
import MoreHorizIcon    from '@mui/icons-material/MoreHoriz';
import SummarizeIcon    from '@mui/icons-material/Summarize';
import ViewKanbanIcon   from '@mui/icons-material/ViewKanban';
import CalendarTodayIcon   from '@mui/icons-material/CalendarToday';
import DescriptionIcon     from '@mui/icons-material/Description';
import TimelineIcon        from '@mui/icons-material/Timeline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BarChartIcon        from '@mui/icons-material/BarChart';
import '../styles/board-detail.css';

const ColumnContainer = styled(Box)(({ theme }) => ({
  minWidth: 272, maxWidth: 272,
  backgroundColor: 'rgba(235,236,240,0.9)',
  backdropFilter: 'blur(4px)',
  borderRadius: '12px',
  padding: theme.spacing(1),
  transition: 'box-shadow 0.18s ease',
  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
}));

const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: theme.spacing(1.25),
  marginBottom: theme.spacing(0.75),
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  transition: 'box-shadow 0.18s ease, transform 0.18s ease',
  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transform: 'translateY(-1px)' },
}));

// Fake members — replace with real API data later
const FAKE_MEMBERS = [
  { initials: 'AJ', color: '#3B5BDB' },
  { initials: 'ST', color: '#7C3AED' },
  { initials: 'MK', color: '#38A169' },
  { initials: 'LN', color: '#D97706' },
];

const BoardDetail = ({ token, setBackgroundColor }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [board,                   setBoard]                   = useState(null);
  const [loading,                 setLoading]                 = useState(false);
  const [openInviteBoard,         setOpenInviteBoard]         = useState(false);
  const [openUpdateDialog,        setOpenUpdateDialog]        = useState(false);
  const [openBackgroundDialog,    setOpenBackgroundDialog]    = useState(false);
  const [openDeleteDialog,        setOpenDeleteDialog]        = useState(false);
  const [openCreateColumnDialog,  setOpenCreateColumnDialog]  = useState(false);
  const columnsWrapperRef = useRef(null);

  useEffect(() => { loadBoard(); }, [id, location?.state?.refresh]);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const data = await fetchBoard(id);
      setBoard(data);
      setBackgroundColor(data.backgroundColor || '#FFFFFF');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = async () => {
    const wasCreatingColumn = openCreateColumnDialog;
    setOpenUpdateDialog(false);
    setOpenBackgroundDialog(false);
    setOpenDeleteDialog(false);
    setOpenCreateColumnDialog(false);
    try {
      const data = await fetchBoard(id);
      setBoard(data);
      setBackgroundColor(data.backgroundColor || '#FFFFFF');
      if (wasCreatingColumn) {
        setTimeout(() => {
          if (columnsWrapperRef.current)
            columnsWrapperRef.current.scrollTo({ left: columnsWrapperRef.current.scrollWidth, behavior: 'smooth' });
        }, 0);
      }
    } catch (err) { showToast(err.message, 'error'); }
  };

  const isImageLatest =
    board?.backgroundImageUpdatedAt &&
    board?.backgroundColorUpdatedAt &&
    new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

  const navItems = [
    { name: 'Board',     icon: <ViewKanbanIcon    style={{ fontSize: 16 }} />, path: `/boards/${id}`           },
    { name: 'Summary',   icon: <SummarizeIcon     style={{ fontSize: 16 }} />, path: `/boards/${id}/summary`   },
    { name: 'Timeline',  icon: <TimelineIcon      style={{ fontSize: 16 }} />, path: `/boards/${id}/timeline`  },
    { name: 'Calendar',  icon: <CalendarTodayIcon style={{ fontSize: 16 }} />, path: `/boards/${id}/calendar`  },
    { name: 'Analytics', icon: <BarChartIcon      style={{ fontSize: 16 }} />, path: `/boards/${id}/analytics` },
    { name: 'Files',     icon: <InsertDriveFileIcon style={{ fontSize: 16 }} />, path: `/boards/${id}/files`   },
  ];

  const pageStyle = {
    backgroundColor: isImageLatest ? 'transparent' : board?.backgroundColor || '#3B5BDB',
    backgroundImage: isImageLatest ? `url(${board?.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 'calc(100vh - var(--navbar-h, 60px))',
  };

  return (
    <div className="board-page board-detail-page" style={pageStyle}>

      {/* ── Header ── */}
      <div className="board-detail-header">
        {board ? (
          <>
            <div className="board-detail-info">

              {/* Breadcrumb */}
              <div className="board-breadcrumb">
                <span className="board-breadcrumb__link" onClick={() => navigate('/boards')}>
                  Your Boards
                </span>
                <span className="board-breadcrumb__sep">/</span>
                <span className="board-breadcrumb__current">{board.title}</span>
              </div>

              {/* Title */}
              <div className="board-title-row">
                <h1 className="board-detail-title">{board.title}</h1>
                <span className="board-visibility-badge">
                  {board.visibility || 'Private'}
                </span>
              </div>

              {/* Description */}
              <div className="board-detail-desc">
                <DescriptionIcon style={{ fontSize: 14, flexShrink: 0 }} />
                <span>{board.description || 'No description.'}</span>
              </div>

              {/* Members */}
              <div className="board-members-row">
                {FAKE_MEMBERS.map((m, i) => (
                  <div key={i} className="board-member-av" style={{ background: m.color }}>
                    {m.initials}
                  </div>
                ))}
                <span className="board-members-count">{FAKE_MEMBERS.length} members</span>
                <button className="board-invite-btn" onClick={() => setOpenInviteBoard(true)}>
                  <PersonAddIcon style={{ fontSize: 13 }} />
                  Invite
                </button>
              </div>

            </div>

            {/* Action buttons */}
            <div className="board-actions">
              <Tooltip title="Change background" placement="bottom">
                <button className="board-action-btn" onClick={() => setOpenBackgroundDialog(true)}>
                  <PaletteIcon style={{ fontSize: 18 }} />
                </button>
              </Tooltip>
              <Tooltip title="Edit board" placement="bottom">
                <button className="board-action-btn" onClick={() => setOpenUpdateDialog(true)}>
                  <EditIcon style={{ fontSize: 18 }} />
                </button>
              </Tooltip>
              <Tooltip title="More options" placement="bottom">
                <button className="board-action-btn">
                  <MoreHorizIcon style={{ fontSize: 18 }} />
                </button>
              </Tooltip>
              <Tooltip title="Delete board" placement="bottom">
                <button className="board-action-btn board-action-btn--danger" onClick={() => setOpenDeleteDialog(true)}>
                  <DeleteIcon style={{ fontSize: 18 }} />
                </button>
              </Tooltip>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.8)' }}>
            <CircularProgress size={20} style={{ color: '#fff' }} />
            <span>Loading board…</span>
          </div>
        )}
      </div>

      {/* ── Nav tabs ── */}
      {board && (
        <nav className="board-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`board-nav-item${location.pathname === item.path ? ' board-nav-item--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      )}

      <div className="board-detail-divider" />

      {/* ── Columns area ── */}
      {location.pathname === `/boards/${id}` && board && (
        <>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <CircularProgress size={36} style={{ color: '#fff' }} />
            </div>
          )}
          <div className="columns-wrapper" ref={columnsWrapperRef}>
            <div className="columns-row">
              <ColumnList
                boardId={id}
                token={token}
                ColumnContainer={ColumnContainer}
                CardContainer={CardContainer}
              />
              <button
                className="btn-add-column"
                onClick={() => setOpenCreateColumnDialog(true)}
              >
                <AddIcon style={{ fontSize: 18 }} />
                Add Column
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Dialogs ── */}
      <Dialog open={openUpdateDialog}       onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <UpdateBoard token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openBackgroundDialog}   onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <ChangeBackground token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openDeleteDialog}       onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DeleteBoard token={token} onClose={handleDialogClose} />
      </Dialog>
      <Dialog open={openCreateColumnDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <CreateColumn token={token} onClose={handleDialogClose} />
      </Dialog>
      <InviteToBoard
        boardId={id}
        board={board}
        open={openInviteBoard}
        onClose={() => setOpenInviteBoard(false)}
      />
    </div>
  );
};

export default BoardDetail;