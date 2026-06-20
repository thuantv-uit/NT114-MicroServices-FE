import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute, PublicRoute } from './utils/RouteUtils';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import Home1 from './components/Home1';
import NotFound from './components/NotFound';
import Login from './features/users/components/Login';
import Register from './features/users/components/Register';
import VerifyOTP from './features/users/components/VerifyOTP';
import ForgotPassword from './features/users/components/Forgotpassword';
import VerifyForgotPassword from './features/users/components/Verifyforgotpassword';
import ResetPassword from './features/users/components/Resetpassword';
import OAuthSuccess from './features/users/components/OAuthSuccess';
import UserDashboard from './features/users/components/UserDashboard';
import BoardList from './features/boards/components/BoardList';
import BoardDetail from './features/boards/components/BoardDetail';
import BoardCreate from './features/boards/components/BoardCreate';
import UpdateBoard from './features/boards/components/UpdateBoard';
import DeleteBoard from './features/boards/components/DeleteBoard';
import ChangeBackground from './features/boards/components/ChangeColor';
import CreateColumn from './features/columns/components/CreateColumn';
import ColumnEdit from './features/columns/components/ColumnEdit';
import DeleteColumn from './features/columns/components/DeleteColumn';
import CreateCard from './features/cards/components/CreateCard';
import EditCardPage from './features/cards/components/EditCardPage';
import DeleteCardPage from './features/cards/components/DeleteCardPage';
import InviteToColumnPage from './features/invitations/components/InviteToColumnPage';
import PendingInvitationsPage from './features/invitations/components/PendingInvitationsPage';
import Chatbot from './features/ai/chatbot';
import Calendar from './features/cards/components/Calendar';
import Summary from './features/cards/components/Summary';
import TemplatePage from './features/boards/components/TemplatePage';
import ProfilePage from './features/users/components/Profile';
import './styles/variables.css';

const AUTH_ROUTES = ['/', '/login', '/register', '/verify-otp', '/forgot-password', '/verify-forgot-password', '/reset-password'];

function App() {
  const { token, setToken, logout } = useAuth();
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isSidebarOpen, setIsSidebarOpen]     = useState(true);
  const location = useLocation();

  const showChrome = token && !AUTH_ROUTES.includes(location.pathname);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div>
      {showChrome && (
        <Navbar
          token={token}
          logout={logout}
          backgroundColor={backgroundColor}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      {showChrome && (
        <CategorySidebar
          token={token}
          logout={logout}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <div
        style={{
          marginTop:  showChrome ? 'var(--navbar-h, 60px)' : '0',
          marginLeft: showChrome && isSidebarOpen ? 'var(--sidebar-w, 240px)' : '0',
          width:      showChrome && isSidebarOpen
                        ? 'calc(100% - var(--sidebar-w, 240px))'
                        : '100%',
          transition: 'margin-left 0.18s ease, width 0.18s ease',
          minHeight:  showChrome ? 'calc(100vh - var(--navbar-h, 60px))' : '100vh',
          boxSizing:  'border-box',
          overflowX:  'hidden',
          background: 'var(--c-primary-lt)',
        }}
      >
        <Routes>
          <Route path="/" element={<Home1 />} />

          {/* Public routes */}
          <Route path="/login"                   element={<PublicRoute token={token} redirectTo="/dashboard" component={<Login setToken={setToken} />} />} />
          <Route path="/register"                element={<PublicRoute token={token} redirectTo="/dashboard" component={<Register />} />} />
          <Route path="/verify-otp"              element={<PublicRoute token={token} redirectTo="/dashboard" component={<VerifyOTP />} />} />
          <Route path="/forgot-password"         element={<PublicRoute token={token} redirectTo="/dashboard" component={<ForgotPassword />} />} />
          <Route path="/verify-forgot-password"  element={<PublicRoute token={token} redirectTo="/dashboard" component={<VerifyForgotPassword />} />} />
          <Route path="/reset-password"          element={<PublicRoute token={token} redirectTo="/dashboard" component={<ResetPassword />} />} />

          <Route path="/oauth-success" element={<OAuthSuccess setToken={setToken} />} />

          {/* Private routes */}
          <Route path="/dashboard" element={<PrivateRoute token={token} component={<UserDashboard token={token} />} />} />
          <Route path="/profile"   element={<PrivateRoute token={token} component={<ProfilePage token={token} />} />} />

          <Route path="/boards"    element={<PrivateRoute token={token} component={<BoardList token={token} />} />} />
          <Route path="/boards/:id" element={<PrivateRoute token={token} component={<BoardDetail token={token} setBackgroundColor={setBackgroundColor} />} />} />
          <Route path="/templates" element={<PrivateRoute token={token} component={<TemplatePage token={token} />} />} />
          <Route path="/boards/create" element={<PrivateRoute token={token} component={<BoardCreate token={token} />} />} />
          <Route path="/boards/:id/update" element={<PrivateRoute token={token} component={<UpdateBoard token={token} />} />} />
          <Route path="/boards/:id/delete" element={<PrivateRoute token={token} component={<DeleteBoard token={token} />} />} />
          <Route path="/boards/:id/change-background" element={<PrivateRoute token={token} component={<ChangeBackground token={token} />} />} />
          <Route path="/boards/:id/invite-to-column" element={<PrivateRoute token={token} component={<InviteToColumnPage token={token} />} />} />
          <Route path="/boards/:id/columns/create" element={<PrivateRoute token={token} component={<CreateColumn token={token} />} />} />
          <Route path="/boards/:boardId/calendar" element={<PrivateRoute token={token} component={<Calendar token={token} />} />} />
          <Route path="/boards/:boardId/summary"  element={<PrivateRoute token={token} component={<Summary token={token} />} />} />

          <Route path="/columns/:columnId/edit"             element={<PrivateRoute token={token} component={<ColumnEdit token={token} />} />} />
          <Route path="/columns/:columnId/delete"           element={<PrivateRoute token={token} component={<DeleteColumn token={token} />} />} />
          <Route path="/columns/:columnId/invite-to-column" element={<PrivateRoute token={token} component={<InviteToColumnPage token={token} />} />} />
          <Route path="/columns/:columnId/cards/create"     element={<PrivateRoute token={token} component={<CreateCard token={token} />} />} />

          <Route path="/cards/:cardId/edit"   element={<PrivateRoute token={token} component={<EditCardPage token={token} />} />} />
          <Route path="/cards/:cardId/delete" element={<PrivateRoute token={token} component={<DeleteCardPage token={token} />} />} />

          <Route path="/pending-invitations/:userId" element={<PrivateRoute token={token} component={<PendingInvitationsPage token={token} />} />} />
          <Route path="/chatbot" element={<PrivateRoute token={token} component={<Chatbot />} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

// Test pipeline part 3