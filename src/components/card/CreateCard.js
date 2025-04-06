import React, { useState } from 'react';
import { createCard } from '../../api/cardApi';

function CreateCard({ listId, token, setCards }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCard = await createCard(token, {
        title,
        description,
        listId,
        position: 0, // Có thể thêm logic để tính position
      });
      setCards((prevCards) => [...prevCards, newCard]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Không thể tạo card');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '10px' }}>
        <label>Tiêu đề:</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Mô tả:</label><br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '5px', minHeight: '50px' }}
        />
      </div>
      <button
        type="submit"
        style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
      >
        Tạo Card
      </button>
    </form>
  );
}

export default CreateCard;