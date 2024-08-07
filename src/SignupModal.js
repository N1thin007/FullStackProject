import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com'; 
import './Modal.css';

const SignupModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 

  const sendConfirmationEmail = (email, username) => {
    const templateParams = {
      to_email: email,
      to_name: username,
      message: 'Thank you for registering with ChronoCraft! Your account has been created successfully.',
    };

    emailjs.send('service_grrc09p', 'template_2j8l23n', templateParams, '9qPVcliB0l4Hvmnc3')
      .then((response) => {
        console.log('Confirmation email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send confirmation email:', error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role: 'user' }),
      });

      const data = await response.json();

      if (response.ok) {
        sendConfirmationEmail(email, username); 
        setShowSuccessPopup(true); 
        setTimeout(() => setShowSuccessPopup(false), 3000); 
        onClose(); 
        setIsLoginModalOpen(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Sign Up!</h2>
          <p>Fill in the details to create your account.</p>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="email"
              className="modal-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="modal-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="modal-button signin">
              Sign Up
            </button>
          </form>
          <div className="modal-footer">
            By signing up, you agree to our <a href="#">Terms of Service</a>. Read our{' '}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="success-popup">
          Successfully registered!
        </div>
      )}
    </>
  );
};

export default SignupModal;