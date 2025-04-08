import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, handleLogout }) => {
  return (
    <nav className="navbar">
      <h1>Trello App</h1>
      <div>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/boards">Boards</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;