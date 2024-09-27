import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'; 
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import Analytics from './components/Analytics';
import Login from './components/Login';

const App = () => {
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/admin  '); // Redirect to admin panel on login
  };



  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/admin" element={isAuthenticated ? <AdminPanel users={users} setUsers={setUsers} handleAddUser={handleAddUser}  /> : <Navigate to="/login" />} />
    </Routes>
  );
};

// Define AdminPanel component to encapsulate the authenticated parts of the app
const AdminPanel = ({ users, setUsers, handleAddUser }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        
      </header>
      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          <AddUser onAdd={handleAddUser} />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <UserList users={users} setUsers={setUsers} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
          <Analytics />
        </section>
      </main>
    </div>
  );
};

export default App;
