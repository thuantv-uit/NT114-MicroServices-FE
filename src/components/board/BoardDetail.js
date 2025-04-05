import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getBoardById } from '../../api/boardApi';
import { getListsByBoard, createList, updateList, deleteList } from '../../api/listApi';

function BoardDetail() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // Lấy ID của board từ URL
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [error, setError] = useState('');
  const [newListTitle, setNewListTitle] = useState(''); // State để lưu tiêu đề list mới

  // Lấy thông tin board và lists khi component mount
  useEffect(() => {
    const fetchBoardAndLists = async () => {
      try {
        const boardData = await getBoardById(token, id);
        const listsData = await getListsByBoard(token, id);
        setBoard(boardData);
        setLists(listsData);
      } catch (err) {
        setError('Không thể tải thông tin board hoặc lists');
      }
    };
    if (token && id) fetchBoardAndLists();
  }, [token, id]);

  // Hàm tạo list mới
  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const newList = await createList(token, {
        title: newListTitle,
        boardId: id,
        position: lists.length, // Vị trí mặc định là cuối danh sách
      });
      setLists([...lists, newList]);
      setNewListTitle(''); // Reset input sau khi tạo
    } catch (err) {
      setError('Không thể tạo list');
    }
  };

  // Hàm cập nhật list
  const handleUpdateList = async (listId, newTitle) => {
    try {
      const updatedList = await updateList(token, listId, { title: newTitle });
      setLists(lists.map((list) => (list._id === listId ? updatedList : list)));
    } catch (err) {
      setError('Không thể cập nhật list');
    }
  };

  // Hàm xóa list
  const handleDeleteList = async (listId) => {
    try {
      await deleteList(token, listId);
      setLists(lists.filter((list) => list._id !== listId));
    } catch (err) {
      setError('Không thể xóa list');
    }
  };

  if (!board) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{board.title}</h2>
      <p>{board.description}</p>

      <h3>Danh sách Lists</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {lists.map((list) => (
          <li key={list._id}>
            <input
              type="text"
              defaultValue={list.title}
              onBlur={(e) => handleUpdateList(list._id, e.target.value)} // Cập nhật khi mất focus
            />
            <button onClick={() => handleDeleteList(list._id)}>Xóa</button>
          </li>
        ))}
      </ul>

      <h3>Tạo List mới</h3>
      <form onSubmit={handleCreateList}>
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Nhập tiêu đề list"
          required
        />
        <button type="submit">Tạo</button>
      </form>
    </div>
  );
}

export default BoardDetail;