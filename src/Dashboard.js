import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for making API calls
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [userId, setUserId] = useState(null); // State for userId
  const [importantTasks, setImportantTasks] = useState([]); // State to hold important tasks
  const [todaysEvents, setTodaysEvents] = useState([]); // State to hold today's events
  const loggedInUser = localStorage.getItem('username'); // Get the logged-in username

  const cards = [
    { title: 'Notes', content: 'Manage your notes and ideas.', link: '/notes' },
    { title: 'To-Do List', content: 'Track your tasks and deadlines.', link: '/todo' },
    { title: 'Calendar', content: 'View and schedule events.', link: '/calendar' },
    { title: 'Pomodoro Timer', content: 'Boost your productivity with time management.', link: '/timer' },
    { title: 'AI Scheduler', content: 'Automate your scheduling tasks.', link: '/ai' },
    { title: 'Habit Tracker', content: 'Track your habits and progress.', link: '/habit' },
  ];

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);

  useEffect(() => {
    if (userId) {
      fetchImportantTasks(userId); // Fetch important tasks for the user
      fetchTodaysEvents(userId); // Fetch today's events for the user
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
      } else {
        console.error('User not found in API response');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchImportantTasks = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/important'); // Fetch all important tasks
      const tasks = response.data || []; // Ensure tasks is an array

      // Filter tasks to only include those belonging to the logged-in user
      const userTasks = tasks.filter(task => task.userId === userId && task.important === true);
      setImportantTasks(userTasks); // Set the important tasks in state
    } catch (error) {
      console.error('Error fetching important tasks:', error);
    }
  };

  const fetchTodaysEvents = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${userId}`);
      const events = response.data || []; // Ensure events is an array

      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Filter events to include only those happening today
      const filteredEvents = events.filter(event => event.start && event.start.split('T')[0] === today);
      setTodaysEvents(filteredEvents); // Set today's events in state
      console.log("Today's events fetched:", filteredEvents); // Log today's events for debugging
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); // Remove the username from local storage
    setUserId(null); // Clear the userId state
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}

      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="dashboard-card" 
            onClick={() => navigate(card.link)} // Navigate to the link when card is clicked
            style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate it's clickable
          >
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        ))}
      </div>

      <div className="tasks-container">
        <div className="tasks-section todays-tasks">
          <h2 className="tasks-title">Today's Events</h2>
          <ul className='desc'>
            {todaysEvents.length > 0 ? todaysEvents.map(event => (
              <li key={event.id}>{event.title}</li>
            )) : <li>No events for today.</li>}
          </ul>
        </div>

        <div className="tasks-section important-tasks">
          <h2 className="tasks-title">Important Tasks</h2>
          <ul className='desc'>
            {importantTasks.length > 0 ? importantTasks.map(task => (
              <li key={task.id}>{task.task}</li>
            )) : <li>No important tasks.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;