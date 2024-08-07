import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import axios from 'axios';
import './TodoApp.css';

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('all');
    const [newTask, setNewTask] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const [userId, setUserId] = useState(null);
    const [allCompleted, setAllCompleted] = useState(false); // New state for toggle
    const loggedInUser = localStorage.getItem('username');

    useEffect(() => {
        fetchUserInfo();
    }, [loggedInUser]);

    useEffect(() => {
        if (userId) {
            fetchTasks(userId);
        }
    }, [userId]);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/login');
            const currentUser = response.data.find((user) => user.username === loggedInUser);
            if (currentUser) {
                setUserId(currentUser.id);
            } else {
                console.error('User not found in API response');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tasks/${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async () => {
        if (newTask.trim()) {
            const taskToAdd = { task: newTask, important: isImportant, userId };

            try {
                const response = await axios.post('http://localhost:8080/api/tasks', taskToAdd);
                setTasks((prevTasks) => [...prevTasks, response.data]);
                setNewTask('');
                setIsImportant(false);
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const handleDeleteTask = async (id) => {
        const taskToDelete = tasks.find(task => task.id === id);
        const taskIndex = tasks.indexOf(taskToDelete);

        // Apply inline style for fadeOut effect
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex].style = { opacity: 0, maxHeight: 0, transition: 'opacity 0.5s, max-height 0.5s' };
        setTasks(updatedTasks);

        // Delay the actual deletion to allow the animation to play
        setTimeout(async () => {
            try {
                await axios.delete(`http://localhost:8080/api/tasks/${id}`);
                setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }, 700); // Match this duration with the CSS transition duration
    };

    const handleToggleComplete = async (id) => {
        const updatedTasks = [...tasks];
        const taskToUpdate = updatedTasks.find(task => task.id === id);
        taskToUpdate.completed = !taskToUpdate.completed;

        try {
            await axios.put(`http://localhost:8080/api/tasks/${id}`, taskToUpdate);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleMarkAllComplete = async () => {
        const allCompletedStatus = !allCompleted; // Toggle status
        const updatedTasks = tasks.map(task => ({ ...task, completed: allCompletedStatus }));

        try {
            await Promise.all(updatedTasks.map(task => 
                axios.put(`http://localhost:8080/api/tasks/${task.id}`, task)
            ));
            setTasks(updatedTasks);
            setAllCompleted(allCompletedStatus); // Update state
        } catch (error) {
            console.error('Error marking all tasks:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const taskText = task.task ? task.task.toLowerCase() : '';
        const matchesSearch = taskText.includes(searchText.toLowerCase());
        const matchesFilter = filter === 'all' || 
            (filter === 'completed' && task.completed) || 
            (filter === 'not-completed' && !task.completed);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className='newwwd'>
            <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
                <AppHeader /> 
            </div>
            <div className="todoapp-container">
                <div className="todoapp-search">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="todoapp-search-button" onClick={() => console.log('Search clicked')}>
                        Search
                    </button>
                </div>
                <div className="todoapp-filter">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="not-completed">Not Completed</option>
                    </select>
                    <button onClick={handleMarkAllComplete} className="mark-all-complete-button">
                        {allCompleted ? 'Unmark All' : 'Mark All as Complete'}
                    </button>
                </div>
                <div className="todoapp-add-task">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button 
                        className={`important-button ${isImportant ? 'active' : ''}`} 
                        onClick={() => setIsImportant(!isImportant)}
                    >
                        Important
                    </button>
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
                <ul className="todoapp-tasks">
                    {filteredTasks.map(task => (
                        <li key={task.id} 
                            className={`todoapp-task ${task.completed ? 'completed' : ''}`} 
                            style={task.style || {}}>
                            <span>{task.task}</span>
                            {task.important && <span className="important-task">!</span>}
                            <div className="todoapp-task-actions">
                                <button onClick={() => handleToggleComplete(task.id)}>
                                    {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                                </button>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TodoApp;