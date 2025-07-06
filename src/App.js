import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute, PublicRoute } from './utils/RouteUtils';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './features/users/components/Login';
import Register from './features/users/components/Register';
import UserDashboard from './features/users/components/UserDashboard';
import BoardList from './features/boards/components/BoardList';
import BoardDetail from './features/boards/components/BoardDetail';
import BoardCreate from './features/boards/components/BoardCreate';
import UpdateBoard from './features/boards/components/UpdateBoard';
import DeleteBoard from './features/boards/components/DeleteBoard';
import ChangeColor from './features/boards/components/ChangeColor';
import CreateColumn from './features/columns/components/CreateColumn';
import ColumnEdit from './features/columns/components/ColumnEdit';
import DeleteColumn from './features/columns/components/DeleteColumn';
import CreateCard from './features/cards/components/CreateCard';
import EditCardPage from './features/cards/components/EditCardPage';
import DeleteCardPage from './features/cards/components/DeleteCardPage';
import InviteToBoardPage from './features/invitations/components/InviteToBoardPage';
import InviteToColumnPage from './features/invitations/components/InviteToColumnPage';
import AcceptRejectInvitationPage from './features/invitations/components/AcceptRejectInvitationPage';
import PendingInvitationsPage from './features/invitations/components/PendingInvitationsPage';
import Chatbot from './features/ai/chatbot';

/**
 * Main application component
 * @returns {JSX.Element}
 */
function App() {
  const { token, setToken, logout } = useAuth();
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const location = useLocation(); // Lấy đường dẫn hiện tại

  // Chỉ hiển thị Navbar nếu không phải các trang /, /login, /register
  const showNavbar = !['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <Navbar token={token} logout={logout} backgroundColor={backgroundColor} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute token={token} redirectTo="/dashboard" component={<Login setToken={setToken} />} />
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute token={token} redirectTo="/dashboard" component={<Register />} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token} component={<UserDashboard token={token} />} />
          }
        />
        <Route
          path="/boards"
          element={
            <PrivateRoute token={token} component={<BoardList token={token} />} />
          }
        />
        <Route
          path="/boards/:id"
          element={
            <PrivateRoute
              token={token}
              component={<BoardDetail token={token} setBackgroundColor={setBackgroundColor} />}
            />
          }
        />
        <Route
          path="/boards/create"
          element={
            <PrivateRoute token={token} component={<BoardCreate token={token} />} />
          }
        />
        <Route
          path="/boards/:id/update"
          element={
            <PrivateRoute token={token} component={<UpdateBoard token={token} />} />
          }
        />
        <Route
          path="/boards/:id/delete"
          element={
            <PrivateRoute token={token} component={<DeleteBoard token={token} />} />
          }
        />
        <Route
          path="/boards/:id/invite-to-board"
          element={
            <PrivateRoute token={token} component={<InviteToBoardPage token={token} />} />
          }
        />
        <Route
          path="/boards/:id/invite-to-column"
          element={
            <PrivateRoute token={token} component={<InviteToColumnPage token={token} />} />
          }
        />
        <Route
          path="/boards/:id/change-color"
          element={
            <PrivateRoute token={token} component={<ChangeColor token={token} />} />
          }
        />
        <Route
          path="/boards/:id/columns/create"
          element={
            <PrivateRoute token={token} component={<CreateColumn token={token} />} />
          }
        />
        <Route
          path="/columns/:columnId/edit"
          element={
            <PrivateRoute token={token} component={<ColumnEdit token={token} />} />
          }
        />
        <Route
          path="/columns/:columnId/delete"
          element={
            <PrivateRoute token={token} component={<DeleteColumn token={token} />} />
          }
        />
        <Route
          path="/columns/:columnId/invite-to-column"
          element={
            <PrivateRoute token={token} component={<InviteToColumnPage token={token} />} />
          }
        />
        <Route
          path="/columns/:columnId/cards/create"
          element={
            <PrivateRoute token={token} component={<CreateCard token={token} />} />
          }
        />
        <Route
          path="/cards/:cardId/edit"
          element={
            <PrivateRoute token={token} component={<EditCardPage token={token} />} />
          }
        />
        <Route
          path="/cards/:cardId/delete"
          element={
            <PrivateRoute token={token} component={<DeleteCardPage token={token} />} />
          }
        />
        <Route
          path="/invitations/:invitationId"
          element={
            <PrivateRoute token={token} component={<AcceptRejectInvitationPage token={token} />} />
          }
        />
        <Route
          path="/pending-invitations/:userId"
          element={
            <PrivateRoute token={token} component={<PendingInvitationsPage token={token} />} />
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute token={token} component={<Chatbot />} />
          }
        />
      </Routes>
    </>
  );
}

export default App;