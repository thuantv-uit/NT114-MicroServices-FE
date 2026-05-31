import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates, cloneBoardFromTemplate } from '../services/boardService';
import { showToast } from '../../../utils/toastUtils';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GridViewIcon from '@mui/icons-material/GridView';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { columnInstance } from '../../../services/axiosConfig';
import { cardInstance } from '../../../services/axiosConfig';
import { PageSpinner, ThunioSpinner, LoadingButton } from '../../../Logo/components/ThunioSpinner';
import '../styles/board.css';
import '../styles/template.css';

const ALL_CATEGORIES = [
  'All', 'Engineering', 'Marketing', 'Product', 'Human Resources',
  'Media', 'Sales', 'Operations', 'Personal', 'Design', 'Support',
];

const TemplatePage = ({ token }) => {
  const navigate = useNavigate();

  const [templates,      setTemplates]      = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Preview dialog
  const [previewDialog,  setPreviewDialog]  = useState({ open: false, template: null });
  const [previewColumns, setPreviewColumns] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Clone dialog
  const [cloneDialog,    setCloneDialog]    = useState({ open: false, template: null });
  const [cloneTitle,     setCloneTitle]     = useState('');
  const [cloning,        setCloning]        = useState(false);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = templates.filter(t => {
    const matchSearch   = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // ── Preview handlers ──────────────────────────────────────────────────────
  const openPreview = async (template) => {
    setPreviewDialog({ open: true, template });
    setPreviewColumns([]);
    setPreviewLoading(true);
    try {
      // 1. Lấy columns của template board
      const colRes = await columnInstance.get(`/board/${template._id}`);
      const columns = colRes.data;

      // 2. Lấy cards của từng column song song
      const columnsWithCards = await Promise.all(
        columns.map(async (col) => {
          try {
            const cardRes = await cardInstance.get(`/column/${col._id}`);
            return { ...col, cards: cardRes.data };
          } catch {
            return { ...col, cards: [] };
          }
        })
      );

      // 3. Sắp xếp theo columnOrderIds
      const orderedIds = template.columnOrderIds.map(id => id.toString());
      const sorted = columnsWithCards.sort(
        (a, b) => orderedIds.indexOf(a._id.toString()) - orderedIds.indexOf(b._id.toString())
      );

      setPreviewColumns(sorted);
    } catch (err) {
      showToast('Failed to load template preview', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, template: null });
    setPreviewColumns([]);
  };

  // ── Clone handlers ────────────────────────────────────────────────────────
  const openCloneDialog = (e, template) => {
    e.stopPropagation();
    setCloneTitle(`Copy of ${template.title}`);
    setCloneDialog({ open: true, template });
  };

  const openCloneFromPreview = () => {
    const template = previewDialog.template;
    closePreview();
    setTimeout(() => {
      setCloneTitle(`Copy of ${template.title}`);
      setCloneDialog({ open: true, template });
    }, 200);
  };

  const handleClone = async () => {
    if (!cloneTitle.trim()) {
      showToast('Please enter a board name', 'error');
      return;
    }
    setCloning(true);
    try {
      const newBoard = await cloneBoardFromTemplate(cloneDialog.template._id, cloneTitle.trim());
      showToast('Board created successfully!', 'success');
      setCloneDialog({ open: false, template: null });
      console.log('✅ newBoard:', newBoard);
    //   navigate(`/boards/${newBoard._id}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCloning(false);
    }
  };

  const handleCloneDialogClose = () => {
    if (cloning) return;
    setCloneDialog({ open: false, template: null });
  };

  // ── Render template card ──────────────────────────────────────────────────
  const renderCard = (template) => (
    <div
      key={template._id}
      className="tpl-card"
      onClick={() => openPreview(template)}
      style={{ cursor: 'pointer' }}
    >
      {/* Thumb */}
      <div
        className="tpl-card__thumb"
        style={{ backgroundColor: template.backgroundColor || '#3B5BDB' }}
      >
        {/* Mini kanban preview */}
        <div className="tpl-card__preview">
          {(template.columnOrderIds || []).slice(0, 3).map((_, i) => (
            <div key={i} className="tpl-card__preview-col">
              <div className="tpl-card__preview-col-header" />
              {[...Array(i === 0 ? 3 : i === 1 ? 2 : 1)].map((__, j) => (
                <div key={j} className="tpl-card__preview-item" />
              ))}
            </div>
          ))}
        </div>

        {/* Use template button */}
        <button
          className="tpl-card__use-btn"
          onClick={e => openCloneDialog(e, template)}
        >
          <ContentCopyIcon style={{ fontSize: 14 }} />
          Use Template
        </button>
      </div>

      {/* Body */}
      <div className="tpl-card__body">
        {template.category && (
          <span className="tpl-card__category">{template.category}</span>
        )}
        <div className="tpl-card__title">{template.title}</div>
        {template.description && (
          <p className="tpl-card__desc">{template.description}</p>
        )}
        <div className="tpl-card__footer">
          <span className="tpl-card__meta">
            <ViewKanbanIcon style={{ fontSize: 13 }} />
            {(template.columnOrderIds || []).length} columns
          </span>
          <button
            className="tpl-card__clone-btn"
            onClick={e => openCloneDialog(e, template)}
          >
            <AddIcon style={{ fontSize: 14 }} />
            Use this
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="board-page tpl-page">

      {/* ── Hero header ── */}
      <div className="tpl-hero">
        <div className="tpl-hero__icon">
          <GridViewIcon style={{ fontSize: 28 }} />
        </div>
        <div>
          <h1 className="board-list-title">Board Templates</h1>
          <p className="board-list-sub">
            Get started faster with {templates.length} ready-made templates across multiple categories
          </p>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="board-filter-row">
        <div className="board-search-wrap">
          <SearchIcon className="board-search-wrap__icon" style={{ fontSize: 17 }} />
          <input
            className="board-search-wrap__input"
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="tpl-categories">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tpl-category-pill${activeCategory === cat ? ' tpl-category-pill--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <PageSpinner text="Loading templates…" />
      ) : filtered.length > 0 ? (
        <>
          <p className="board-section-label" style={{ marginBottom: 16 }}>
            {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {search ? ` for "${search}"` : ''}
          </p>
          <div className="tpl-grid">
            {filtered.map(renderCard)}
          </div>
        </>
      ) : (
        <div className="board-list-empty">
          <div className="board-list-empty__icon">
            <ViewKanbanIcon style={{ fontSize: 48, color: 'var(--c-text-3)' }} />
          </div>
          <p className="board-list-empty__text">
            {search
              ? `No templates found for "${search}"`
              : `No templates in "${activeCategory}" yet`}
          </p>
        </div>
      )}

      {/* ── Preview Dialog ── */}
      <Dialog
        open={previewDialog.open}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {previewDialog.template && (
          <>
            {/* Header với màu của template */}
            <div
              className="tpl-preview-header"
              style={{ backgroundColor: previewDialog.template.backgroundColor || '#3B5BDB' }}
            >
              <button className="tpl-preview-back" onClick={closePreview}>
                <ArrowBackIcon style={{ fontSize: 18 }} />
              </button>
              <div className="tpl-preview-header__info">
                {previewDialog.template.category && (
                  <span className="tpl-preview-header__cat">{previewDialog.template.category}</span>
                )}
                <h2 className="tpl-preview-header__title">{previewDialog.template.title}</h2>
                {previewDialog.template.description && (
                  <p className="tpl-preview-header__desc">{previewDialog.template.description}</p>
                )}
              </div>
              <button
                className="tpl-preview-use-btn"
                onClick={openCloneFromPreview}
              >
                <ContentCopyIcon style={{ fontSize: 16 }} />
                Use Template
              </button>
            </div>

            <DialogContent sx={{ p: 0, background: 'var(--c-bg)' }}>
              {previewLoading ? (
                <PageSpinner text="Loading preview…" />
              ) : (
                <div className="tpl-preview-board">
                  {previewColumns.map(col => (
                    <div key={col._id} className="tpl-preview-col">
                      {/* Column header */}
                      <div className="tpl-preview-col__header">
                        <span className="tpl-preview-col__title">{col.title}</span>
                        <span className="tpl-preview-col__count">
                          {(col.cards || []).length}
                        </span>
                      </div>
                      {/* Cards */}
                      <div className="tpl-preview-col__cards">
                        {(col.cards || []).map(card => (
                          <div key={card._id} className="tpl-preview-card">
                            {card.title}
                          </div>
                        ))}
                        {(col.cards || []).length === 0 && (
                          <div className="tpl-preview-col__empty">No cards</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--c-border)' }}>
              <button className="btn btn--ghost" onClick={closePreview}>
                Close
              </button>
              <button className="btn btn--primary" onClick={openCloneFromPreview}>
                <ContentCopyIcon style={{ fontSize: 16 }} />
                Use This Template
              </button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Clone Dialog ── */}
      <Dialog
        open={cloneDialog.open}
        onClose={handleCloneDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, pb: 1 }}>
          Use Template
        </DialogTitle>

        <DialogContent>
          {cloneDialog.template && (
            <div className="tpl-dialog-preview">
              <div
                className="tpl-dialog-preview__thumb"
                style={{ backgroundColor: cloneDialog.template.backgroundColor || '#3B5BDB' }}
              />
              <div>
                <div className="tpl-dialog-preview__name">{cloneDialog.template.title}</div>
                {cloneDialog.template.category && (
                  <div className="tpl-dialog-preview__cat">{cloneDialog.template.category}</div>
                )}
              </div>
            </div>
          )}

          <label className="generic-form__label" style={{ marginTop: 16, display: 'block' }}>
            Board Name
          </label>
          <input
            className="generic-form__input"
            type="text"
            placeholder="Enter board name…"
            value={cloneTitle}
            onChange={e => setCloneTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleClone()}
            autoFocus
            style={{ marginTop: 6 }}
          />

          <div className="tpl-dialog-info">
            <CheckCircleOutlineIcon style={{ fontSize: 14, color: 'var(--c-success)' }} />
            All columns and cards from the template will be copied to your new board
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <button
            className="btn btn--ghost"
            onClick={handleCloneDialogClose}
            disabled={cloning}
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleClone}
            disabled={cloning || !cloneTitle.trim()}
          >
            {cloning
              ? <><PageSpinner text="Creating board…" /></>
              : <><AddIcon style={{ fontSize: 16 }} /> Create Board</>
            }
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplatePage;