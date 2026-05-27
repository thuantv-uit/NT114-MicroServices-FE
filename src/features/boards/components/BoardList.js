import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import { CircularProgress, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BoardCreate from './BoardCreate';
import '../styles/board-list.css';
import { PageSpinner } from '../../../Logo/components/ThunioSpinner';

const BOARDS_PER_PAGE = 8;

// ── Fake metadata (replace with real API data later) ──────────────
const FAKE_META = {
  columns: [3, 4, 5, 2, 3, 4],
  tasks:   [12, 22, 31, 9, 17, 6],
  members: [
    [{ initials: 'AJ', color: 'var(--c-primary)'   }, { initials: 'ST', color: 'var(--c-primary-h)'  }, { initials: 'MK', color: 'var(--c-success)'    }],
    [{ initials: 'AJ', color: 'var(--c-primary)'   }, { initials: 'LN', color: 'var(--c-warning)'    }],
    [{ initials: 'MK', color: 'var(--c-success)'    }, { initials: 'AJ', color: 'var(--c-primary)'   }, { initials: 'PT', color: 'var(--c-danger)'     }],
    [{ initials: 'LN', color: 'var(--c-warning)'    }, { initials: 'AJ', color: 'var(--c-primary)'   }],
    [{ initials: 'PT', color: 'var(--c-danger)'     }, { initials: 'MK', color: 'var(--c-success)'    }],
    [{ initials: 'AJ', color: 'var(--c-primary)'   }],
  ],
};

const getMeta = (index) => ({
  columns: FAKE_META.columns[index % FAKE_META.columns.length],
  tasks:   FAKE_META.tasks[index % FAKE_META.tasks.length],
  members: FAKE_META.members[index % FAKE_META.members.length],
});
// ─────────────────────────────────────────────────────────────────

const TABS = ['All', 'Starred', 'Recent'];
const SORT_OPTIONS = [
  { value: 'last_opened', label: 'Last opened' },
  { value: 'name_asc',    label: 'Name (A → Z)' },
  { value: 'name_desc',   label: 'Name (Z → A)' },
  { value: 'newest',      label: 'Newest first' },
];

const BoardList = ({ token }) => {
  const [boards,            setBoards]            = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [openCreateDialog,  setOpenCreateDialog]  = useState(false);
  const [search,            setSearch]            = useState('');
  const [activeTab,         setActiveTab]         = useState('All');
  const [sort,              setSort]              = useState('last_opened');
  const [starredIds,        setStarredIds]        = useState([]);  // TODO: persist to API
  const [currentPage,       setCurrentPage]       = useState(1);

  useEffect(() => { loadBoards(); }, []);

  // Reset to page 1 whenever filter/search changes
  useEffect(() => { setCurrentPage(1); }, [search, activeTab, sort]);

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

  const toggleStar = (e, id) => {
    e.preventDefault();
    setStarredIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ── Filter + sort ─────────────────────────────────────────────
  const filtered = boards
    .filter(b => {
      const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
      if (activeTab === 'Starred') return matchSearch && starredIds.includes(b._id);
      if (activeTab === 'Recent')  return matchSearch; // TODO: filter by last opened
      return matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'name_asc')  return a.title.localeCompare(b.title);
      if (sort === 'name_desc') return b.title.localeCompare(a.title);
      return 0; // last_opened / newest → keep API order
    });

  const pinned   = filtered.filter(b => starredIds.includes(b._id));
  const unpinned = filtered.filter(b => !starredIds.includes(b._id));

  // ── Pagination (applied to unpinned list) ────────────────────
  const totalPages  = Math.max(1, Math.ceil(unpinned.length / BOARDS_PER_PAGE));
  const paginated   = unpinned.slice(
    (currentPage - 1) * BOARDS_PER_PAGE,
    currentPage * BOARDS_PER_PAGE
  );

  const isImageLatest = (board) =>
    board.backgroundImageUpdatedAt &&
    board.backgroundColorUpdatedAt &&
    new Date(board.backgroundImageUpdatedAt) > new Date(board.backgroundColorUpdatedAt);

  const thumbStyle = (board) => ({
    backgroundImage: isImageLatest(board) && board.backgroundImage
      ? `url(${board.backgroundImage})`
      : 'none',
    backgroundColor: isImageLatest(board)
      ? 'transparent'
      : board.backgroundColor || 'var(--c-primary)',
  });

  const renderCard = (board, index) => {
    const meta = getMeta(index);
    const starred = starredIds.includes(board._id);
    return (
      <Link
        key={board._id}
        to={`/boards/${board._id}`}
        className="board-card"
        style={{ textDecoration: 'none' }}
      >
        <div className="board-card__thumb" style={thumbStyle(board)}>
          <button
            className={`board-card__star${starred ? ' board-card__star--active' : ''}`}
            onClick={e => toggleStar(e, board._id)}
            title={starred ? 'Unstar' : 'Star'}
          >
            {starred
              ? <StarIcon style={{ fontSize: 14 }} />
              : <StarBorderIcon style={{ fontSize: 14 }} />
            }
          </button>
        </div>
        <div className="board-card__body">
          <div className="board-card__title">{board.title}</div>
          <div className="board-card__meta">
            <span className="board-card__meta-item">
              <TableRowsIcon style={{ fontSize: 13 }} />
              {meta.columns} columns
            </span>
            <span className="board-card__meta-item">
              <TaskAltIcon style={{ fontSize: 13 }} />
              {meta.tasks} tasks
            </span>
          </div>
          <div className="board-card__members">
            {meta.members.slice(0, 4).map((m, i) => (
              <div
                key={i}
                className="board-card__avatar"
                style={{ background: m.color }}
                title={m.initials}
              >
                {m.initials}
              </div>
            ))}
            {meta.members.length > 4 && (
              <div className="board-card__avatar board-card__avatar--more">
                +{meta.members.length - 4}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="board-page board-list-page">

      {/* ── Header ── */}
      <div className="board-list-header">
        <div>
          <h1 className="board-list-title">Your Boards</h1>
          <p className="board-list-sub">
            {boards.length} board{boards.length !== 1 ? 's' : ''} · Last updated just now
          </p>
        </div>
        <button className="btn-create-board" onClick={() => setOpenCreateDialog(true)}>
          <AddIcon style={{ fontSize: 18 }} />
          Create New Board
        </button>
      </div>

      {/* ── Filter row ── */}
      <div className="board-filter-row">
        <div className="board-search-wrap">
          <SearchIcon className="board-search-wrap__icon" style={{ fontSize: 17 }} />
          <input
            className="board-search-wrap__input"
            type="text"
            placeholder="Search boards…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="board-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`board-tab${activeTab === tab ? ' board-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Starred' && <StarIcon style={{ fontSize: 14 }} />}
              {tab}
            </button>
          ))}
        </div>

        <select
          className="board-sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{`Sort: ${o.label}`}</option>
          ))}
        </select>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <PageSpinner text="Loading boards…" />
      ) : (
        <>
          {/* ── Pinned section ── */}
          {pinned.length > 0 && (
            <>
              <p className="board-section-label">
                <StarIcon style={{ fontSize: 14, verticalAlign: -2, marginRight: 5, color: 'var(--c-warning)' }} />
                Starred
              </p>
              <div className="board-grid" style={{ marginBottom: 28 }}>
                {pinned.map((b, i) => renderCard(b, i))}
              </div>
            </>
          )}

          {/* ── All boards section ── */}
          {pinned.length > 0 && (
            <p className="board-section-label">All Boards</p>
          )}

          {paginated.length > 0 ? (
            <>
              <div className="board-grid">
                {paginated.map((b, i) => renderCard(b, (currentPage - 1) * BOARDS_PER_PAGE + i))}

                {/* New board card */}
                <div className="board-card board-card--new" onClick={() => setOpenCreateDialog(true)}>
                  <div className="board-card--new__icon">
                    <AddIcon style={{ fontSize: 22 }} />
                  </div>
                  <span className="board-card--new__label">New Board</span>
                </div>
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="board-pagination">
                  <span className="board-pagination__info">
                    Page {currentPage} of {totalPages} · {unpinned.length} boards
                  </span>
                  <div className="board-pagination__controls">
                    <button
                      className="board-pagination__btn"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <NavigateBeforeIcon style={{ fontSize: 20 }} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`board-pagination__btn board-pagination__btn--page${currentPage === page ? ' board-pagination__btn--active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="board-pagination__btn"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <NavigateNextIcon style={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="board-list-empty">
              <div className="board-list-empty__icon">
                <ViewKanbanIcon style={{ fontSize: 48, color: 'var(--c-text-3)' }} />
              </div>
              <p className="board-list-empty__text">
                {search ? `No boards found for "${search}"` : 'No boards yet. Create one to get started!'}
              </p>
              {!search && (
                <button className="btn-create-board" style={{ marginTop: 16 }} onClick={() => setOpenCreateDialog(true)}>
                  <AddIcon style={{ fontSize: 18 }} /> Create New Board
                </button>
              )}
            </div>
          )}
        </>
      )}

      <Dialog open={openCreateDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <BoardCreate token={token} onClose={handleDialogClose} />
      </Dialog>
    </div>
  );
};

export default BoardList;