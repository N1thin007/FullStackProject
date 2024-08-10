import React, { useEffect, useState } from 'react';
import './Profile.css';
import AppHeader from './AppHeader';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const Profile = () => {
  const [habits, setHabits] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [userInfo, setUserInfo] = useState({ username: '', email: '', password: '' });
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false); // State for popup visibility

  useEffect(() => {
    const fetchUserInfo = async () => {
      const loggedInUser = localStorage.getItem('username');
      if (!loggedInUser) {
        console.error('Username not found in local storage.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/login');
        const users = response.data;
        const currentUser = users.find(user => user.username === loggedInUser);

        if (currentUser) {
          setUserId(currentUser.id);
          setUsername(currentUser.username);
          setEmail(currentUser.email);
          setCurrentUserId(currentUser.id);
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
    const fetchUserData = async () => {
      if (!userId) {
        console.error('User ID is not set.');
        return;
      }

      try {
        const [habitsResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/habits/${userId}`),
          axios.get(`http://localhost:8080/login/${userId}`)
        ]);

        const habitsData = habitsResponse.data;
        const userData = userResponse.data;

        setHabits(habitsData);
        setUserInfo({
          username: userData.username,
          email: userData.email,
          password: userData.password
        });

        const totalHabitsCalc = habitsData.length;
        const totalStarsCalc = habitsData.reduce((acc, habit) => {
          const stars = JSON.parse(localStorage.getItem(`stars_${userId}`)) || {};
          return acc + (stars[habit.name] || 0);
        }, 0);

        const completionRateCalc = habitsData.reduce((acc, habit) => {
          const completedCounts = JSON.parse(localStorage.getItem(`completedCounts_${userId}`)) || {};
          const habitCompletionRate = (completedCounts[habit.name]?.filter(Boolean).length / 7) * 100 || 0;
          return acc + habitCompletionRate;
        }, 0) / habitsData.length;

        setTotalHabits(totalHabitsCalc);
        setTotalStars(totalStarsCalc);
        setCompletionRate(completionRateCalc || 0);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    const updatedUser = {
      username,
      email,
      password: userInfo.password, // Use userInfo.password
      role: 'user' // Role is fixed as 'user'
    };

    try {
      const response = await axios.put(`http://localhost:8080/login/${currentUserId}`, updatedUser);
      setUserInfo(prev => ({ ...prev, username, email, password: userInfo.password }));
      setPopupVisible(true); // Show the popup
      setIsEditing(false);
      setCurrentUserId(null);

      // Hide the popup after 3 seconds
      setTimeout(() => {
        setPopupVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating user details:', error);
      setPopupVisible(true); // Show the popup for failure as well
    }
  };

  return (
    <div className='pro'>
      <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
        <AppHeader />
      </div>
      <div className="profile-container">
        <div className="profile-content">
          <h1>User Analytics</h1>

          <div className="user-info">
            <h2>User Information</h2>
            {isEditing ? (
              <form onSubmit={handleUpdateUserDetails}>
                <div>
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={userInfo.password} // Use userInfo.password
                    onChange={(e) => setUserInfo(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit">Update Details</button>
              </form>
            ) : (
              <>
                <p><strong>Username:</strong> {userInfo.username}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <button onClick={() => setIsEditing(true)}>Edit Details</button>
              </>
            )}
          </div>

          {popupVisible && (
            <div className="pooopup">
              <p>Update Successful!</p>
            </div>
          )}

          <div className="analytics-overview">
            <div className="analytics-card">
              <h3>Total Habits</h3>
              <p>{totalHabits}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Stars Earned</h3>
              <p>{totalStars}</p>
            </div>
            <div className="analytics-card">
              <h3>Overall Completion Rate</h3>
              <div className="progress-bar">
                <CircularProgressbar
                  value={completionRate}
                  text={`${completionRate.toFixed(1)}%`}
                  styles={buildStyles({
                    textColor: '#fff',
                    pathColor: '#00adb5',
                    trailColor: '#303841',
                  })}
                />
              </div>
            </div>
          </div>

          <div className="habit-details">
            <h2>Individual Habit Progress</h2>
            <table className="habit-tablee">
              <thead>
                <tr>
                  <th>Habit</th>
                  <th>Completion Rate</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => {
                  const stars = JSON.parse(localStorage.getItem(`stars_${userId}`)) || {};
                  const completedCounts = JSON.parse(localStorage.getItem(`completedCounts_${userId}`)) || {};
                  const habitCompletionRate = (completedCounts[habit.name]?.filter(Boolean).length / 7) * 100 || 0;

                  return (
                    <tr key={habit.id}>
                      <td>{habit.name}</td>
                      <td className='newp'>
                        <CircularProgressbar
                          value={habitCompletionRate}
                          text={`${habitCompletionRate.toFixed(1)}%`}
                          styles={buildStyles({
                            textColor: '#fff',
                            pathColor: '#00adb5',
                            trailColor: '#303841',
                          })}
                        />
                      </td>
                      <td>{stars[habit.name] || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;