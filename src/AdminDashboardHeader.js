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
            <nav>
                <button 
                    onClick={() => navigate('/admindashboard')} 
                    className={`app-nav-btn ${isActive('/admindashoard') ? 'active' : ''}`}>
                    Manage Users
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