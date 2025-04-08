import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = ({ token }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get('http://localhost:3001/api/users/me', config);
        const usersRes = await axios.get('http://localhost:3001/api/users/', config);
        setUser(userRes.data);
        setAllUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>
      {user ? (
        <div>
          <h3>Welcome, {user.username}!</h3>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <h3>All Users</h3>
      <ul>
        {allUsers.map((u) => (
          <li key={u._id}>{u.username} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;