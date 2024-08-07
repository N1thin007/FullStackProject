import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AppHeader.css';

const AppHeader = ({ onNavigate, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/', { replace: true });
      };

    const isActive = (path) => location.pathname.includes(path);

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
                    onClick={handleLogout} 
                    className="app-nav-btn app-logout-btn">
                    Log Out
                </button>
            </nav>
        </header>
    );
};

export default AppHeader;