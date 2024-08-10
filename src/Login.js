import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import pattern from './pattern.png';
import googleImage from './google.png';
import appleImage from './apple.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
// Example: After successful login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Login failed: Invalid username or password.');
        } else {
          alert(`Login failed: Server responded with status ${response.status}.`);
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('username', username);
        localStorage.setItem('role', result.role);

        if (result.role === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/Dashboard');
        }
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Login failed: Network error or server not responding.');
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your username and password to Sign In.</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label htmlFor="username" className="login-form-label">Your username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="login-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">Password</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="login-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-form-button">Sign In</button>
          <div className="login-form-footer">
            <div className="login-footer-left">

            </div>
          </div>
          
          <p className="login-signup-text">
            Not registered? <Link to="/signup" className="login-link">Create account</Link>
          </p>
        </form>
      </div>
      <div className="login-image">
        <img src={pattern} alt="Pattern" style={{borderRadius:'1.5rem',height:'780px'}}/>
      </div>
    </section>
  );
};

export default Login;