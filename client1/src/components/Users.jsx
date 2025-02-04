import React from "react";
import { useState, useEffect } from "react";
import { getAll, create, deleteById, update } from "../service/BaseService";
import "../styles/Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTasks, setUserTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [editingUser, setEditingUser] = useState({
        _id: '',
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        getAll("http://localhost:3080/api/users")
            .then((res) => setUsers(res))
            .catch((err) => console.log(err));
    };

    const handleUserClick = (userId) => {
        if (selectedUser === userId) {
            setSelectedUser(null);
            setUserTasks([]);
        } else {
            setSelectedUser(userId);
            getAll(`http://localhost:3080/api/users/${userId}/tasks`)
                .then((res) => setUserTasks(res))
                .catch((err) => console.log(err));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await create('http://localhost:3080/api/users', newUser);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '' });
            loadUsers();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Failed to create user. Please try again.");
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: ''
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteById(`http://localhost:3080/api/users/${userToDelete}`);
            setShowDeleteModal(false);
            setUserToDelete(null);
            loadUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user. Please try again.");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                name: editingUser.name,
                email: editingUser.email
            };
            if (editingUser.password) {
                updateData.password = editingUser.password;
            }
            await update(`http://localhost:3080/api/users/${editingUser._id}`, updateData);
            setShowEditModal(false);
            setEditingUser({ _id: '', name: '', email: '', password: '' });
            loadUsers();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user. Please try again.");
        }
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h2 className="users-title">Users Management</h2>
                <button 
                    className="add-user-button"
                    onClick={() => setShowAddModal(true)}
                >
                    Add User
                </button>
            </div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map((user) => (
                        <React.Fragment key={user._id}>
                            <tr>
                                <td onClick={() => handleUserClick(user._id)}>{user.name}</td>
                                <td onClick={() => handleUserClick(user._id)}>{user.email}</td>
                                <td className="action-buttons">
                                    <button 
                                        className="btn btn-update"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-delete"
                                        onClick={() => handleDeleteClick(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {selectedUser === user._id && userTasks.length > 0 && (
                                <tr>
                                    <td colSpan="2">
                                        <div className="user-tasks">
                                            <h4>Tasks for {user.name}</h4>
                                            <table className="tasks-subtable">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>Due Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {userTasks.map((task) => (
                                                        <tr key={task._id}>
                                                            <td>{task.title}</td>
                                                            <td>{task.description}</td>
                                                            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
                                                                    {task.completed ? "Completed" : "Pending"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    )) : <tr><td colSpan="3" style={{textAlign: 'center'}}>No users found</td></tr>}
                </tbody>
            </table>

            {showAddModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3 className="modal-title">Add New User</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="modal-button cancel"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="modal-button confirm"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3 className="modal-title">Edit User</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (leave blank to keep current):</label>
                                <input
                                    type="password"
                                    value={editingUser.password}
                                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                                    minLength="6"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="modal-button cancel"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="modal-button confirm"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3 className="modal-title">Confirm Delete</h3>
                        <p>Are you sure you want to delete this user? All associated tasks will also be deleted.</p>
                        <div className="modal-buttons">
                            <button 
                                className="modal-button cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-button confirm"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;