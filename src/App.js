// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import Register from './components/Register';
// import Login from './components/Login';
// import Profile from './components/Profile';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/profile" element={<Profile />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateBoard from './components/CreateBoard';
import BoardDetail from './components/BoardDetail';
import UpdateBoard from './components/UpdateBoard';

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;