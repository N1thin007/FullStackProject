import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 
import imageSrc from './image.png';
import logo from './logo.png'; 

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className='landing-body'>
      <header className="landing-header">
        <img src={logo} alt="Logo" className="landing-logo" /> 
        <div className="landing-header-buttons">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </header>
      <div className="landing-container">
        <div className="landing-content">
          <h1>Master Your Time with Chronocraft</h1>
          <p>
          Transform chaos into clarity with Chronocraft! Discover effortless planning, seamless collaboration, and innovative solutions to streamline your workflow and unlock your team's full potential.
          </p>
        </div>
        <div className="landing-image">
          <img src={imageSrc} alt="Hand Picked Candidates" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
