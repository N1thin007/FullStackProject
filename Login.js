import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleLogo from './google.png'; 
import appleLogo from './apple.png'; 
import rightImage from './righ-im.png'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
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
                navigate('/Dashboard');
            } else {
                alert('Login failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('Login failed: Network error or server not responding.');
        }
    };

    return (
        <div className="login-page">
            <img src={rightImage} alt="Right Decor" className="right-image" />
            <div className="login-wrapper">
                <h2>Think it. Make it.</h2>
                <p>Log into your Chronocraft account.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <button type="submit" className="login-button">Continue</button>
                </form>
                <div className="divider"></div>
                <div className="alternative-login">
                    <button>
                        <img src={googleLogo} alt="Google" />
                        Continue with Google
                    </button>
                    <button>
                        <img src={appleLogo} alt="Apple" />
                        Continue with Apple
                    </button>
                </div>
                <div className="signup-text">
                    Don’t have an account? <a href="/signup" className="signup-link">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
