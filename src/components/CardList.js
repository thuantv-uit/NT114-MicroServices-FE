import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardEdit from './CardEdit';

const CardList = ({ columnId, token }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);

  // Lấy danh sách cards
  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3004/api/cards/column/${columnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(res.data);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [columnId, token]);

  // Xóa card
  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await axios.delete(`http://localhost:3004/api/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(cards.filter((card) => card._id !== cardId));
      setError('');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to delete card');
    }
  };

  // Cập nhật card sau khi chỉnh sửa
  const handleUpdate = (updatedCard) => {
    setCards(cards.map((card) => (card._id === updatedCard._id ? updatedCard : card)));
    setEditingCard(null);
  };

  return (
    <div>
      {loading && <p>Loading cards...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            {editingCard === card._id ? (
              <CardEdit
                card={card}
                token={token}
                onUpdate={handleUpdate}
                onCancel={() => setEditingCard(null)}
              />
            ) : (
              <>
                {card.title} {card.description && `- ${card.description}`} (Position: {card.position})
                <button
                  onClick={() => setEditingCard(card._id)}
                  style={{ marginLeft: '10px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card._id)}
                  style={{ backgroundColor: 'red', marginLeft: '10px' }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;