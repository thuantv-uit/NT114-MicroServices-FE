import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCards } from '../services/cardService';
import { showToast } from '../../../utils/toastUtils';
import { Dialog } from '@mui/material';
import {
  DndContext, closestCorners, DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, useDragAndDrop } from './CardList';
import DeleteCardPage from './DeleteCardPage';
import '../styles/card-item.css';

const CardList = ({ columnId, token, boardId, column, onRefresh }) => {
  const [cards,         setCards]         = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [deleteCardId,  setDeleteCardId]  = useState(null);
  const navigate = useNavigate();

  const { sensors, activeCardId, activeCardData, handleDragStart, handleDragEnd } =
    useDragAndDrop(cards, setCards, columnId, column.title, onRefresh);

  useEffect(() => {
    const load = async () => {
      if (!token) { showToast('Missing auth token', 'error'); return; }
      setLoading(true);
      try {
        const data = await fetchCards(columnId);
        const sorted = column.cardOrderIds
          ? column.cardOrderIds.map(id => data.find(c => c._id === id)).filter(Boolean)
          : data;
        setCards(sorted);
      } catch (err) {
        showToast(err.message || 'Failed to load cards', 'error');
      } finally { setLoading(false); }
    };
    load();
  }, [columnId, column.cardOrderIds, token]);

  const handleEdit = (card) => navigate(`/cards/${card._id}/edit`, {
    state: { title: card.title, description: card.description, boardId, columnId },
  });

  // Mở dialog xóa thay vì navigate
  const handleDelete = (cardId) => setDeleteCardId(cardId);

  const handleDeleteClose = () => {
    setDeleteCardId(null);
    onRefresh();
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map(c => c._id)} strategy={verticalListSortingStrategy}>
          <div style={{ minHeight: 4 }}>
            {loading && <p className="card-empty">Loading cards…</p>}
            {!loading && cards.length === 0 && (
              <p className="card-empty">No cards in this column.</p>
            )}
            {cards.map(card => (
              <Card
                key={card._id}
                card={card}
                boardId={boardId}
                columnId={columnId}
                token={token}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onInviteUser={() => showToast('Invite feature coming soon', 'info')}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeCardId && activeCardData ? (
            <Card
              card={activeCardData} boardId={boardId} columnId={columnId} token={token}
              onEdit={() => {}} onDelete={() => {}} onInviteUser={() => {}} onRefresh={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Delete dialog — đồng bộ với DeleteBoard / DeleteColumn */}
      <Dialog
        open={!!deleteCardId}
        onClose={handleDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        {deleteCardId && (
          <DeleteCardPage
            token={token}
            cardId={deleteCardId}
            boardId={boardId}
            onClose={handleDeleteClose}
          />
        )}
      </Dialog>
    </>
  );
};

export default CardList;