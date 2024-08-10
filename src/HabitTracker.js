import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './HabitTracker.css';
import AppHeader from './AppHeader';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');
  const [completedCounts, setCompletedCounts] = useState({});
  const [stars, setStars] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const loggedInUser = localStorage.getItem('username');
      try {
        const response = await fetch('http://localhost:8080/login');
        const users = await response.json();
        const currentUser = users.find(user => user.username === loggedInUser);
        if (currentUser) {
          setUserId(currentUser.id);
        } else {
          console.error('User not found in API response');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchHabits = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/habits/${userId}`);
          const data = await response.json();
          setHabits(data);

          // Load completedCounts and stars from local storage
          const storedCompletedCounts = JSON.parse(localStorage.getItem(`completedCounts_${userId}`)) || {};
          const storedStars = JSON.parse(localStorage.getItem(`stars_${userId}`)) || {};
          setCompletedCounts(storedCompletedCounts);
          setStars(storedStars);
        } catch (error) {
          console.error('Error fetching habits:', error);
        }
      };

      fetchHabits();
    }
  }, [userId]);

  const addHabit = async () => {
    if (habitName && userId) {
      const newHabit = { userId, name: habitName };
      try {
        const response = await fetch('http://localhost:8080/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHabit),
        });
        const savedHabit = await response.json();
        setHabits([...habits, savedHabit]);
        setHabitName('');
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  const toggleCompletion = (habit, dayIndex) => {
    const updatedCounts = { ...completedCounts };
    updatedCounts[habit.name] = updatedCounts[habit.name] || Array(7).fill(false);
    updatedCounts[habit.name][dayIndex] = !updatedCounts[habit.name][dayIndex];

    // Check for stars (e.g., every 7 days of progress)
    const completedDays = updatedCounts[habit.name].filter(Boolean).length;
    if (completedDays % 7 === 0 && completedDays > 0) {
      const updatedStars = { ...stars };
      updatedStars[habit.name] = (updatedStars[habit.name] || 0) + 1;
      setStars(updatedStars);

      localStorage.setItem(`stars_${userId}`, JSON.stringify(updatedStars));
    }

    setCompletedCounts(updatedCounts);
    localStorage.setItem(`completedCounts_${userId}`, JSON.stringify(updatedCounts));
  };

  const deleteHabit = async (habit) => {
    try {
      await fetch(`http://localhost:8080/api/habits/${habit.id}`, {
        method: 'DELETE',
      });
      const updatedHabits = habits.filter(h => h.id !== habit.id);
      const { [habit.name]: removedCount, ...updatedCounts } = completedCounts;
      const { [habit.name]: removedStars, ...updatedStars } = stars;

      setHabits(updatedHabits);
      setCompletedCounts(updatedCounts);
      setStars(updatedStars);

      localStorage.setItem(`habits_${userId}`, JSON.stringify(updatedHabits));
      localStorage.setItem(`completedCounts_${userId}`, JSON.stringify(updatedCounts));
      localStorage.setItem(`stars_${userId}`, JSON.stringify(updatedStars));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getCompletionPercentage = (habit) => {
    const completedDays = completedCounts[habit.name]?.filter(Boolean).length || 0;
    return (completedDays / 7) * 100;
  };

  const currentDayIndex = new Date().getDay();

  return (
    <div className="habit-tracker-container">
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
              <th>Stars</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td>{habit.name}</td>
                {daysOfWeek.map((_, dayIndex) => (
                  <td key={dayIndex}>
                    <input
                      type="checkbox"
                      checked={completedCounts[habit.name]?.[dayIndex] || false}
                      onChange={() => toggleCompletion(habit, dayIndex)}
                      disabled={dayIndex !== currentDayIndex}
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
                      strokeWidth={8}
                    />
                  </div>
                </td>
                <td>
                  {Array.from({ length: stars[habit.name] || 0 }).map((_, index) => (
                    <span key={index} role="img" aria-label="star">⭐</span>
                  ))}
                </td>
                <td>
                  <button onClick={() => deleteHabit(habit)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;