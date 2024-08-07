import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; 
import SignupModal from './SignupModal'; 
import "./Header.css";


const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); 
  const navigate = useNavigate();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && isVisible) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY && !isVisible) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  const handleRegister = () => {
    setIsSignupModalOpen(true); 
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleFreeDownload = () => {
    alert('Free Download clicked!');
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isVisible]);

  const scrollToSection = (id, offset = 0) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLinkClick = (id) => {
    scrollToSection(id, 260); 
  };

  return (
    <header className="header" style={{ top: isVisible ? "0" : "-80px" }}>
      <div className="header-container">
        <div className="header-logo">ChronoCraft</div>
        <nav className="header-nav">
          <button onClick={handleHome}>Home</button>
          <button onClick={() => handleLinkClick("about")}>About</button>
          <button onClick={handleLogin}>Sign In</button>
          <button onClick={handleRegister}>Sign Up</button> 
        </nav>
        <button className="free-download" onClick={handleFreeDownload}>Free Download</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} /> 
    </header>
  );
};

export default Header;
