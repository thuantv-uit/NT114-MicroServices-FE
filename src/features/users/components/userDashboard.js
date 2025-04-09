// src/features/users/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchUserData, fetchAllUsers } from '../services/userService';

const UserDashboard = ({ token }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserData(token);
        const usersData = await fetchAllUsers(token);
        setUser(userData);
        setAllUsers(usersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [token]);

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>
      {loading && <p>Loading...</p>}
      {user ? (
        <div>
          <h3>Welcome, {user.username}!</h3>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user data</p>
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