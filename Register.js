import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 
import rightImage from './register picture.webp';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/Login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  return (
    <div className="register-body">
      <img src={rightImage} alt="Right Decorative" className="register-right-image" />
      <div className="register-wrapper">
        <h2>Create Your Account</h2>
        <p>Register to access your Chronocraft account.</p>
        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="register-form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
            />
          </div>
          <div className="register-form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="register-divider"></div>
        <div className="register-signup-text">
          Already have an account? <a href="/login" className="register-signup-link">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
