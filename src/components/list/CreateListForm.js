import { useState } from 'react';

function CreateListForm({ onCreate }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề list"
        required
      />
      <button type="submit">Tạo List</button>
    </form>
  );
}

export default CreateListForm;