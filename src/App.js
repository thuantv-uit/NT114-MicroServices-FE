import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/user/Navbar';
import Home from './components/user/Home';
import Register from './components/user/Register';
import Login from './components/user/Login';
import Profile from './components/user/Profile';
import CreateBoard from './components/board/CreateBoard';
import BoardDetail from './components/board/BoardDetail';
import UpdateBoard from './components/board/UpdateBoard';
import ListDetail from './components/list/listDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/create-board" element={<CreateBoard />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/update-board/:id" element={<UpdateBoard />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/" element={<Profile />} />
          
          <Route path="/lists/:id" element={<ListDetail />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;