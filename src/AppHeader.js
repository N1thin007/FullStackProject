import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AppHeader.css';

const AppHeader = ({ onNavigate, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get username and email from local storage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email')||'';

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/', { replace: true });
    };

    const isActive = (path) => location.pathname.includes(path);

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="app-header">
            <h1 className="app-header-title">ChronoCraft</h1>
            <nav className="app-header-navigation">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`app-nav-btn ${isActive('/dashboard') ? 'active' : ''}`}>
                    Dashboard
                </button>
                <button
                    onClick={() => navigate('/notes')}
                    className={`app-nav-btn ${isActive('notes') ? 'active' : ''}`}>
                    Notes
                </button>
                <button
                    onClick={() => navigate('/todo')}
                    className={`app-nav-btn ${isActive('todo') ? 'active' : ''}`}>
                    To-Do List
                </button>
                <button
                    onClick={() => navigate('/calendar')}
                    className={`app-nav-btn ${isActive('calendar') ? 'active' : ''}`}>
                    Calendar
                </button>
                <button
                    onClick={() => navigate('/timer')}
                    className={`app-nav-btn ${isActive('timer') ? 'active' : ''}`}>
                    Pomodoro Timer
                </button>
                <button
                    onClick={() => navigate('/ai')}
                    className={`app-nav-btn ${isActive('ai') ? 'active' : ''}`}>
                    AI Scheduler
                </button>
                <button
                    onClick={() => navigate('/habit')}
                    className={`app-nav-btn ${isActive('habit') ? 'active' : ''}`}>
                    Habit Tracker
                </button>
                <div className="app-profile-container">
                    <button
                        onClick={handleProfileClick}
                        className="app-profile-btn">
                        {email.charAt(0).toUpperCase()}
                    </button>
                    {isDropdownOpen && (
                        <div className="app-profile-dropdown">
                            <div className="app-profile-info">
                                <p><strong>Username:</strong> {username}</p>
                                <p><strong>Email:</strong> {email}</p>
                            </div>
                            <div className="app-profile-actions">
                                <button className='settings-but'onClick={() => navigate('/setting')}>Settings</button>
                                <button className='log-app' onClick={handleLogout}>Log Out</button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default AppHeader;