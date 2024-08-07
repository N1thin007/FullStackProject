import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import AppHeader from './AdminDashboardHeader';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]); // State to hold user data
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '' }); // State for new user data
    const [isEditing, setIsEditing] = useState(false); // State to track if editing
    const [currentUserId, setCurrentUserId] = useState(null); // State to hold the ID of the user being edited
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/login'); // Fetch users from the API
            setUsers(response.data); // Set users in state
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/login/${id}`)
            .then(() => setUsers(users.filter(user => user.id !== id))) // Update users state after deletion
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleLogout = () => {
        localStorage.removeItem('username'); 
        navigate('/login'); // Redirect to login page
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value }); // Update new user state
    };

    const handleAddUser = () => {
        axios.post('http://localhost:8080/login', newUser) // Send POST request to add new user
            .then(response => {
                setUsers([...users, response.data]); // Add new user to users state
                setNewUser({ username: '', email: '', password: '', role: '' }); // Reset form
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const handleEditUser = (user) => {
        setNewUser({ username: user.username, email: user.email, password: user.password, role: user.role }); // Set form fields with user data
        setCurrentUserId(user.id); // Set the current user ID
        setIsEditing(true); // Set editing mode
    };

    const handleUpdateUser = () => {
        axios.put(`http://localhost:8080/login/${currentUserId}`, newUser) // Send PUT request to update user
            .then(response => {
                setUsers(users.map(user => (user.id === currentUserId ? response.data : user))); // Update user in users state
                setNewUser({ username: '', email: '', password: '', role: '' }); // Reset form
                setIsEditing(false); // Exit editing mode
                setCurrentUserId(null); // Clear current user ID
            })
            .catch(error => console.error('Error updating user:', error));
    };

    return (
        <div className='nob'>
      <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
            <AppHeader handleLogout={handleLogout} />
        </div>
        <div className="dashboard-container">
            <main className="dashboard-main-content">
                <h2 className="content-title">Admin Dashboard</h2>
                
                {/* Add User Form */}
                <div className="add-user-form">
                    <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={handleInputChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={handleInputChange}
                    />
                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    {isEditing ? (
                        <button className="add-button" onClick={handleUpdateUser}>Update User</button>
                    ) : (
                        <button className="add-button" onClick={handleAddUser}>Add User</button>
                    )}
                </div>

                {/* User Table */}
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5">Loading user data...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
        </div>
    );
};

export default AdminDashboard;