import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getBoardById } from '../../api/boardApi';
import { getListsByBoard, createList, updateList, deleteList } from '../../api/listApi';

function BoardDetail() {
  const { token, logout } = useContext(AuthContext); // Giả sử logout có trong AuthContext
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [error, setError] = useState('');
  const [newListTitle, setNewListTitle] = useState('');

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

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const newList = await createList(token, {
        title: newListTitle,
        boardId: id,
        position: lists.length,
      });
      setLists([...lists, newList]);
      setNewListTitle('');
    } catch (err) {
      setError('Không thể tạo list');
    }
  };

  const handleUpdateList = async (listId, newTitle) => {
    try {
      const updatedList = await updateList(token, listId, { title: newTitle });
      setLists(lists.map((list) => (list._id === listId ? updatedList : list)));
    } catch (err) {
      setError('Không thể cập nhật list');
    }
  };

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
      {/* Ẩn thông tin hồ sơ (board title và description) */}
      {/* <h2>{board.title}</h2>
      <p>{board.description}</p> */}

      <h3>Danh sách</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {lists.map((list) => (
          <li key={list._id} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              defaultValue={list.title}
              onBlur={(e) => handleUpdateList(list._id, e.target.value)}
            />
            <button onClick={() => handleDeleteList(list._id)} style={{ marginLeft: '10px' }}>
              Xóa
            </button>
            <button style={{ marginLeft: '10px' }}>
              <a href={`/lists/${list._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                Vào List
              </a>
            </button>
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

      {/* Hiển thị nút Logout khi đã đăng nhập, ẩn Login và Home */}
      {token && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;