import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { CircularProgress, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BoardCreate from './BoardCreate';
import '../styles/board.css';

const BoardList = ({ token }) => {
  const [boards, setBoards]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    setLoading(true);
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = async () => {
    setOpenCreateDialog(false);
    await loadBoards();
  };

  return (
    <div className="board-page board-list-page">
      {/* Header */}
      <div className="board-list-header">
        <h1 className="board-list-title">Your Boards</h1>
        <button className="btn-create-board" onClick={() => setOpenCreateDialog(true)}>
          <AddIcon style={{ fontSize: 18 }} />
          Create New Board
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <CircularProgress size={48} style={{ color: 'var(--c-primary)' }} />
        </div>
      ) : (
        <div className="board-grid">
          {boards.length > 0 ? (
            boards.map((board) => {
              const isImageLatest =
                board.backgroundImageUpdatedAt &&
                board.backgroundColorUpdatedAt &&
                new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

              const thumbStyle = {
                backgroundImage: isImageLatest && board.backgroundImage
                  ? `url(${board.backgroundImage})`
                  : 'none',
                backgroundColor: isImageLatest
                  ? 'transparent'
                  : board.backgroundColor || '#E8EAF6',
              };

              return (
                <Link
                  key={board._id}
                  to={`/boards/${board._id}`}
                  className="board-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="board-card__thumb" style={thumbStyle} />
                  <div className="board-card__body">
                    <DashboardIcon style={{ fontSize: 15, color: 'var(--c-text-3)', flexShrink: 0 }} />
                    <span className="board-card__title">{board.title}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="board-list-empty">
              <div className="board-list-empty__icon">📋</div>
              <p className="board-list-empty__text">
                No boards yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      )}

      <Dialog open={openCreateDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <BoardCreate token={token} onClose={handleDialogClose} />
      </Dialog>
    </div>
  );
};

export default BoardList;