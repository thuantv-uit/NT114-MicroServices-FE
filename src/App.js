import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './features/users/components/Login';
import Register from './features/users/components/Register';
import UserDashboard from './features/users/components/userDashboard';
import Navbar from './components/NavBar';
import BoardList from './features/boards/components/BoardList';
import BoardCreate from './features/boards/components/BoardCreate';
import BoardDetail from './features/boards/components/BoardDetail';
import UpdateBoard from './features/boards/components/UpdateBoard';
import DeleteBoard from './features/boards/components/DeleteBoard';
import InviteUser from './features/boards/components/InviteUser';
import CreateColumn from './features/columns/components/CreateColumn';
import EditColumn from './features/columns/components/ColumnEdit';
import DeleteColum from './features/columns/components/DeleteColumn';
import CreateCard from './features/cards/components/CreateCard';

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
        <Route path="/boards/:id/update" element={token ? <UpdateBoard token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards/:id/delete" element={token ? <DeleteBoard token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards/:id/invite" element={token ? <InviteUser token={token} /> : <Navigate to="/login" />} />
        <Route path="/boards/:id/columns/create" element={token ? <CreateColumn token={token} /> : <Navigate to="/login" />} />
        <Route path="/columns/:columnId/edit" element={token ? <EditColumn token={token} /> : <Navigate to="/login" />} />
        <Route path="/columns/:columnId/delete" element={token ? <DeleteColumn token={token} /> : <Navigate to="/login" />} />
        <Route path="/columns/:columnId/cards/create" element={token ? <CreateCard token={token} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;