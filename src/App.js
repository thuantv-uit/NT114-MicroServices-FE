// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './features/users/components/Login';
import Register from './features/users/components/Register';
import UserDashboard from './features/users/components/UserDashboard';
import Navbar from './components/Navbar';
import BoardList from './features/boards/components/BoardList';
import BoardCreate from './features/boards/components/BoardCreate';
import BoardDetail from './features/boards/components/BoardDetail';
import UpdateBoard from './features/boards/components/UpdateBoard';
import DeleteBoard from './features/boards/components/DeleteBoard';
import InviteUser from './features/boards/components/InviteUser';
import CreateColumn from './features/columns/components/CreateColumn';
import ColumnEdit from './features/columns/components/ColumnEdit';
import DeleteColumn from './features/columns/components/DeleteColumn';
import CreateCard from './features/cards/components/CreateCard';
import EditCardPage from './features/cards/components/EditCardPage'; // Thêm import
import DeleteCardPage from './features/cards/components/DeleteCardPage'; // Thêm import
import { PrivateRoute, PublicRoute } from './utils/RouteUtils';
import useAuth from './hooks/useAuth';

function App() {
  const { token, setToken, handleLogout } = useAuth();

  return (
    <div className="App">
      <Navbar token={token} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<PublicRoute token={token} redirectTo="/dashboard" component={<Login setToken={setToken} />} />} />
        <Route path="/login" element={<PublicRoute token={token} redirectTo="/dashboard" component={<Login setToken={setToken} />} />} />
        <Route path="/register" element={<PublicRoute token={token} redirectTo="/dashboard" component={<Register />} />} />
        <Route path="/dashboard" element={<PrivateRoute token={token} component={<UserDashboard token={token} />} />} />
        <Route path="/boards" element={<PrivateRoute token={token} component={<BoardList token={token} />} />} />
        <Route path="/boards/create" element={<PrivateRoute token={token} component={<BoardCreate token={token} />} />} />
        <Route path="/boards/:id" element={<PrivateRoute token={token} component={<BoardDetail token={token} />} />} />
        <Route path="/boards/:id/update" element={<PrivateRoute token={token} component={<UpdateBoard token={token} />} />} />
        <Route path="/boards/:id/delete" element={<PrivateRoute token={token} component={<DeleteBoard token={token} />} />} />
        <Route path="/boards/:id/invite" element={<PrivateRoute token={token} component={<InviteUser token={token} />} />} />
        <Route path="/boards/:id/columns/create" element={<PrivateRoute token={token} component={<CreateColumn token={token} />} />} />
        <Route path="/columns/:columnId/edit" element={<PrivateRoute token={token} component={<ColumnEdit token={token} />} />} />
        <Route path="/columns/:columnId/delete" element={<PrivateRoute token={token} component={<DeleteColumn token={token} />} />} />
        <Route path="/columns/:columnId/cards/create" element={<PrivateRoute token={token} component={<CreateCard token={token} />} />} />
        <Route path="/cards/:cardId/edit" element={<PrivateRoute token={token} component={<EditCardPage token={token} />} />} />
        <Route path="/cards/:cardId/delete" element={<PrivateRoute token={token} component={<DeleteCardPage token={token} />} />} />
      </Routes>
    </div>
  );
}

export default App;