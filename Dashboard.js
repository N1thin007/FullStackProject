import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const initialTasks = JSON.parse(localStorage.getItem('tasks')) || [
    { title: 'Buy groceries', important: true, date: new Date().toDateString() },
    { title: 'Meeting with team', important: false, date: new Date().toDateString() },
    { title: 'Doctor appointment', important: true, date: new Date().toDateString() },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState({ index: null, value: '' });
  const [newTask, setNewTask] = useState({ title: '', important: false, date: new Date().toDateString() });

  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  const handleUserIconClick = () => {
    navigate('/profile');
  };

  const today = new Date();
  const todayTasks = tasks.filter((task) => task.date === today.toDateString());
  const importantTasks = tasks.filter((task) => task.important);

  const handleEditClick = (index, title) => {
    setEditingTask({ index, value: title });
  };

  const handleEditChange = (e) => {
    setEditingTask({ ...editingTask, value: e.target.value });
  };

  const handleEditSubmit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = editingTask.value;
    setTasks(updatedTasks);
    setEditingTask({ index: null, value: '' });
  };

  const handleNewTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewTaskSubmit = (e) => {
    e.preventDefault();
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTask({ title: '', important: false, date: new Date().toDateString() });
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const renderTasks = (taskList) => {
    return taskList.map((task, index) => (
      <li key={index} className="db-task-item">
        {editingTask.index === index ? (
          <input
            type="text"
            value={editingTask.value}
            onChange={handleEditChange}
            onBlur={() => handleEditSubmit(index)}
            className="db-task-input"
          />
        ) : (
          <span onClick={() => handleEditClick(index, task.title)}>{task.title}</span>
        )}
        <button
          className="db-delete-task-button"
          onClick={() => handleDeleteTask(index)}
        >
          ❌
        </button>
      </li>
    ));
  };

  return (
    <div className="db-container">
      <aside className="db-sidebar">
        <div className="db-user">
          <div className="db-user-icon" onClick={handleUserIconClick}>
            {loggedInUser.charAt(0)}
          </div>
          <div className="db-user-info">
            <div className="db-user-email">{loggedInUser}@gmail.com</div>
            <button onClick={handleLogout} className="db-logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav>
          <button
            className={`db-nav-button ${
              location.pathname === '/Dashboard' ? 'active' : ''
            }`}
            onClick={() => navigate('/Dashboard')}
          >
            <span className="icon">🏠</span> Home
          </button>
          <button
            className={`db-nav-button ${
              location.pathname === '/notes' ? 'active' : ''
            }`}
            onClick={() => navigate('/notes')}
          >
            <span className="icon">📝</span> Notes
          </button>
          <button
            className={`db-nav-button ${
              location.pathname === '/tasks' ? 'active' : ''
            }`}
            onClick={() => navigate('/To-Do')}
          >
            <span className="icon">✔️</span> To-Do
          </button>
          <button
            className={`db-nav-button ${
              location.pathname === '/calendar' ? 'active' : ''
            }`}
            onClick={() => navigate('/calendar')}
          >
            <span className="icon">📅</span> Calendar
          </button>
        </nav>
      </aside>
      <main className="db-main-content">
        <div className="db-dashboard-content">
          <div className="db-task-box">
            <h2>Today's Tasks</h2>
            <ul className="db-task-list">{renderTasks(todayTasks)}</ul>
          </div>
          <div className="db-task-box">
            <h2>Important Tasks</h2>
            <ul className="db-task-list">{renderTasks(importantTasks)}</ul>
          </div>
          <form onSubmit={handleNewTaskSubmit} className="db-new-task-form">
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleNewTaskChange}
              placeholder="New Task Title"
              required
              className="db-new-task-input"
            />
            <label className="db-new-task-important-label">
              <input
                type="checkbox"
                name="important"
                checked={newTask.important}
                onChange={handleNewTaskChange}
                className="db-new-task-important-checkbox"
              />
              Important
            </label>
            <input
              type="date"
              name="date"
              value={newTask.date}
              onChange={handleNewTaskChange}
              className="db-new-task-date"
            />
            <button type="submit" className="db-add-task-button">
              Add Task
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
