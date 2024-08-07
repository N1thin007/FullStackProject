import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com'; 
import { useNavigate } from 'react-router-dom'; 
import "./Home.css";
import Header from "./Header";
import homepageImage from './homepage.png'; 

const Home = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(Array(3).fill(false)); 
  const navigate = useNavigate();
  const handleContactFormSubmit = (event) => {
    event.preventDefault();

    const templateParams = {
      from_name: fullName,
      from_email: email,
      message: message,
    };

    emailjs.send('service_grrc09p', 'template_2j8l23n', templateParams, '9qPVcliB0l4Hvmnc3')
      .then((response) => {
        console.log('Message sent successfully!', response.status, response.text);
        alert('Your message has been sent!');
        setFullName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        alert('Failed to send your message. Please try again later.');
      });
  };

  const features = [
    {
      color: "blue",
      title: "Task Management",
      icon: "🔒",
      description: "Easily manage tasks with our intuitive interface. Track progress and stay organized.",
    },
    {
      color: "green",
      title: "AI-Powered Insights",
      icon: "🤖",
      description: "Leverage advanced AI algorithms to gain actionable insights. Analyze data trends, automate tasks, and enhance decision-making.",
    },
    {
      color: "red",
      title: "Time Tracking",
      icon: "⏰",
      description: "Track time spent on tasks and projects. Optimize productivity and efficiency.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        setIsVisible((prev) => {
          const newVisible = [...prev];
          newVisible[index] = entry.isIntersecting; 
          return newVisible;
        });
      });
    });

    const cards = document.querySelectorAll('.chronoCraft-feature-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card)); 
    };
  }, []);

  return (
    <div className="chronoCraft-home">
      <Header />
      <div className="chronoCraft-hero-section" id="home">
        <div className="chronoCraft-hero-overlay"></div>
        <div className="chronoCraft-hero-content">
          <h1>Welcome to ChronoCraft</h1>
          <p>
            ChronoCraft is your ultimate workflow management system, designed to enhance productivity and streamline your projects. Join us and revolutionize the way you work.
          </p>
          <img src={homepageImage} alt="Homepage" className="homepage-image" /> {/* Add the image */}
        </div>
      </div>
      <section className="chronoCraft-features-section">
        <div className="chronoCraft-features-container">
          {features.map(({ color, title, icon, description }, index) => (
            <div key={title} className={`chronoCraft-feature-card chronoCraft-${color} ${isVisible[index] ? 'fade-in' : 'fade-out'}`}>
              <div className="chronoCraft-feature-card-icon">{icon}</div>
              <h3>{title}</h3>
              <div className="chronoCraft-feature-card-content">
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chronoCraft-about-section" id="about">
          <div className="chronoCraft-about-text">
            <div className="chronoCraft-about-icon">🔒</div>
            <h3>Empowering Your Team</h3>
            <p>
              ChronoCraft offers powerful tools to help your team work together effectively. From task management to real-time collaboration, we've got you covered. Join us and experience a new level of productivity.
              <br />
              <br />
              Our platform is designed to adapt to your needs, providing flexibility and efficiency in managing your workflow. Get started today and see the difference.
            </p>
            <button className="chronoCraft-learn-more-button"
            onClick={()=>navigate('/learn-more')}>Learn More</button>
          </div>
        </div>
      </section>
      <section className="chronoCraft-contact-section" id="sign-in">
        <div className="chronoCraft-contact-container">
          <h2>Get in Touch</h2>
          <p>
            Have questions or want to learn more? Complete the form below, and we'll get back to you within 24 hours.
          </p>
          <form className="chronoCraft-contact-form" onSubmit={handleContactFormSubmit}>
            <div className="chronoCraft-form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <textarea
              placeholder="Message"
              rows="8"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="chronoCraft-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </section>
      <section id="sign-up">
      </section>
      <footer className="chronoCraft-footer">
        <p>© 2024 ChronoCraft. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;