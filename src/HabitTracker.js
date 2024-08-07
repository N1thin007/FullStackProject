// src/HabitTracker.js

import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './HabitTracker.css'; // Custom styles for the component
import AppHeader from './AppHeader';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');
  const [completedCounts, setCompletedCounts] = useState({}); // Track completed days for each habit
  const [stars, setStars] = useState(0); // Track stars for achievements

  const addHabit = () => {
    if (habitName) {
      setHabits([...habits, habitName]);
      setCompletedCounts({ ...completedCounts, [habitName]: Array(7).fill(false) }); // Initialize completed days
      setHabitName('');
    }
  };

  const toggleCompletion = (habit, dayIndex) => {
    const updatedCounts = { ...completedCounts };
    updatedCounts[habit][dayIndex] = !updatedCounts[habit][dayIndex]; // Toggle completion

    // Check for stars (e.g., every 7 days of progress)
    const completedDays = updatedCounts[habit].filter(Boolean).length;
    if (completedDays % 7 === 0 && completedDays > 0) {
      setStars(stars + 1);
    }

    setCompletedCounts(updatedCounts);
  };

  const getCompletionPercentage = (habit) => {
    const completedDays = completedCounts[habit]?.filter(Boolean).length || 0;
    return (completedDays / 7) * 100; // Calculate percentage of completed days
  };

  // Get the current day index (0-6 for Sun-Sat)
  const currentDayIndex = new Date().getDay();

  return (
    <div className='habit-tracker-container'>
      <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
        <AppHeader />
      </div>
      <div className="habit-tracker-content">
        <h1>Habit Tracker</h1>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter a new habit"
        />
        <button onClick={addHabit}>Add Habit</button>

        <table className="habit-table">
          <thead>
            <tr>
              <th>Habit</th>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={index}>
                <td>{habit}</td>
                {daysOfWeek.map((_, dayIndex) => (
                  <td key={dayIndex}>
                    <input
                      type="checkbox"
                      checked={completedCounts[habit]?.[dayIndex] || false}
                      onChange={() => toggleCompletion(habit, dayIndex)}
                      disabled={dayIndex !== currentDayIndex} // Disable checkbox for other days
                    />
                  </td>
                ))}
                <td>
                  <div className="progress-container">
                    <CircularProgressbar
                      value={getCompletionPercentage(habit)}
                      styles={buildStyles({
                        textColor: '#fff',
                        pathColor: '#00adb5',
                        tailColor: 'rgba(255,255,255,.2)',
                      })}
                      strokeWidth={8} // Adjust stroke width for smaller appearance
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="stars-container">
          <h2>Stars: {stars}</h2>
          <div className="star-container">
            {Array.from({ length: stars }).map((_, index) => (
              <span key={index} role="img" aria-label="star">⭐</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
