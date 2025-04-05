import { useState } from 'react';

function ListItem({ list, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleUpdate = () => {
    onUpdate(list._id, title);
    setIsEditing(false);
  };

  return (
    <div style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleUpdate}>Lưu</button>
          <button onClick={() => setIsEditing(false)}>Hủy</button>
        </>
      ) : (
        <>
          <h4>{list.title}</h4>
          <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
          <button onClick={() => onDelete(list._id)}>Xóa</button>
        </>
      )}
    </div>
  );
}

export default ListItem;