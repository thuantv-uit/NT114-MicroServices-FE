import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/userDashboard';
import Navbar from './components/NavBar';
import BoardList from './components/BoardList';
import BoardCreate from './components/BoardCreate';
import BoardDetail from './components/BoardDetail';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="App">
      <Navbar token={token} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <UserDashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards" element={token ? <BoardList token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards/create" element={token ? <BoardCreate token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards/:id" element={token ? <BoardDetail token={token} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;