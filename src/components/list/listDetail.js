import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getListById } from '../../api/listApi';
import CardList from '../card/CardList';
import CreateCard from '../card/CreateCard';

function ListDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // listId
  const [list, setList] = useState(null);
  const [setCards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const listData = await getListById(token, id);
        setList(listData);
      } catch (err) {
        setError('Không thể tải thông tin list');
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchList();
  }, [token, id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!list) return <p>Không tìm thấy list</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{list.title}</h2>
      <p>ID: {list._id}</p>
      <p>Thuộc Board: {list.boardId}</p>
      <p>Vị trí: {list.position}</p>

      <h3>Danh sách Cards</h3>
      <CardList listId={id} token={token} />

      <h3>Tạo Card mới</h3>
      <CreateCard listId={id} token={token} setCards={setCards} />
    </div>
  );
}

export default ListDetail;