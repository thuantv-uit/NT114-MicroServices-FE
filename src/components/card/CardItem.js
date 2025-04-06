// src/components/card/CardItem.js
import React, { useState } from 'react';
import { updateCard, deleteCard } from '../../api/cardApi';

function CardItem({ card, token, setCards }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleUpdate = async () => {
    try {
      const updatedCard = await updateCard(token, card._id, { title, description });
      setCards((prevCards) =>
        prevCards.map((c) => (c._id === card._id ? updatedCard : c))
      );
      setIsEditing(false);
    } catch (err) {
      console.error('Không thể cập nhật card');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCard(token, card._id);
      setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
    } catch (err) {
      console.error('Không thể xóa card');
    }
  };

  return (
    <li style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '5px', minHeight: '50px' }}
          />
          <button
            onClick={handleUpdate}
            style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', marginRight: '5px' }}
          >
            Lưu
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
          >
            Hủy
          </button>
        </>
      ) : (
        <>
          <h4 style={{ margin: '0 0 5px 0' }}>{card.title}</h4>
          <p style={{ margin: '0 0 10px 0' }}>{card.description}</p>
          <button
            onClick={() => setIsEditing(true)}
            style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', marginRight: '5px' }}
          >
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
          >
            Xóa
          </button>
        </>
      )}
    </li>
  );
}

export default CardItem;