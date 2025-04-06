import React, { useState, useEffect } from 'react';
import { getCardsByList } from '../../api/cardApi';
import CardItem from './CardItem';

function CardList({ listId, token }) {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData = await getCardsByList(token, listId);
        setCards(cardsData);
      } catch (err) {
        setError('Không thể tải danh sách cards');
      }
    };
    if (token && listId) fetchCards();
  }, [token, listId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {cards.map((card) => (
        <CardItem key={card._id} card={card} token={token} setCards={setCards} />
      ))}
    </ul>
  );
}

export default CardList;