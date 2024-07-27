import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ToDoList.css';

const ToDoList = () => {
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
    syncTasksWithCalendar(); // Sync updated task with Calendar
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
    syncTasksWithCalendar(); // Sync new task with Calendar
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    syncTasksWithCalendar(); // Sync deleted task with Calendar
  };

  const syncTasksWithCalendar = async () => {
    try {
      const user = await axios.get('http://localhost:8080/login');
      const currentUser = user.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        const userId = currentUser.id;

        // Sync tasks
        await axios.post('http://localhost:8080/api/events', { tasks, userId });
      }
    } catch (error) {
      console.error('Error syncing tasks with Calendar:', error);
    }
  };

  const renderTasks = (taskList) => {
    return taskList.map((task, index) => (
      <li key={index} className="td-task-item">
        {editingTask.index === index ? (
          <input
            type="text"
            value={editingTask.value}
            onChange={handleEditChange}
            onBlur={() => handleEditSubmit(index)}
            className="td-task-input"
          />
        ) : (
          <span onClick={() => handleEditClick(index, task.title)}>{task.title}</span>
        )}
        <button
          className="td-delete-task-button"
          onClick={() => handleDeleteTask(index)}
        >
          ❌
        </button>
      </li>
    ));
  };

  return (
    <div className="td-container">
      <aside className="td-sidebar">
        <div className="td-user">
          <div className="td-user-icon" onClick={handleUserIconClick}>
            {loggedInUser.charAt(0)}
          </div>
          <div className="td-user-info">
            <div className="td-user-email">{loggedInUser}@gmail.com</div>
            <button onClick={handleLogout} className="td-logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav>
          <button
            className={`td-nav-button ${
              location.pathname === '/Dashboard' ? 'active' : ''
            }`}
            onClick={() => navigate('/Dashboard')}
          >
            <span className="icon">🏠</span> Home
          </button>
          <button
            className={`td-nav-button ${
              location.pathname === '/notes' ? 'active' : ''
            }`}
            onClick={() => navigate('/notes')}
          >
            <span className="icon">📝</span> Notes
          </button>
          <button
            className={`td-nav-button ${
              location.pathname === '/To-Do' ? 'active' : ''
            }`}
            onClick={() => navigate('/To-Do')}
          >
            <span className="icon">✔️</span> To-Do
          </button>
          <button
            className={`td-nav-button ${
              location.pathname === '/calendar' ? 'active' : ''
            }`}
            onClick={() => navigate('/calendar')}
          >
            <span className="icon">📅</span> Calendar
          </button>
        </nav>
      </aside>
      <main className="td-main-content">
        <div className="td-task-box">
          <h2>To-Do List</h2>
          <ul className="td-task-list">{renderTasks(tasks)}</ul>
          <form onSubmit={handleNewTaskSubmit} className="td-new-task-form">
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleNewTaskChange}
              placeholder="New Task Title"
              required
              className="td-new-task-input"
            />
            <label className="td-new-task-important-label">
              <input
                type="checkbox"
                name="important"
                checked={newTask.important}
                onChange={handleNewTaskChange}
                className="td-new-task-important-checkbox"
              />
              Important
            </label>
            <input
              type="date"
              name="date"
              value={newTask.date}
              onChange={handleNewTaskChange}
              className="td-new-task-date"
            />
            <button type="submit" className="td-add-task-button">
              Add Task
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ToDoList;
