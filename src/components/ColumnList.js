import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColumnEdit from './ColumnEdit';
import CardList from './CardList';
import CardCreate from './CardCreate';

const ColumnList = ({ boardId, token }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);

  // Lấy danh sách columns
  const fetchColumns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3003/api/columns/board/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColumns(res.data);
    } catch (err) {
      setError(err.response?.data.message || 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [boardId, token]);

  // Xóa column
  const handleDelete = async (columnId) => {
    if (!window.confirm('Are you sure you want to delete this column?')) return;
    try {
      await axios.delete(`http://localhost:3003/api/columns/${columnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColumns(columns.filter((column) => column._id !== columnId));
      setError('');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to delete column');
    }
  };

  // Cập nhật column sau khi chỉnh sửa
  const handleUpdate = (updatedColumn) => {
    setColumns(columns.map((column) => (column._id === updatedColumn._id ? updatedColumn : column)));
    setEditingColumn(null);
  };

  return (
    <div>
      {loading && <p>Loading columns...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {columns.map((column) => (
          <div key={column._id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px' }}>
            {editingColumn === column._id ? (
              <ColumnEdit
                column={column}
                token={token}
                onUpdate={handleUpdate}
                onCancel={() => setEditingColumn(null)}
              />
            ) : (
              <>
                <h4>{column.title} (Position: {column.position})</h4>
                <button
                  onClick={() => setEditingColumn(column._id)}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(column._id)}
                  style={{ backgroundColor: 'red' }}
                >
                  Delete
                </button>
                {/* Quản lý cards */}
                <CardCreate columnId={column._id} token={token} onCardCreated={() => fetchColumns()} />
                <CardList columnId={column._id} token={token} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnList;