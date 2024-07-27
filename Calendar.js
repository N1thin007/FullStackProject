import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [userId, setUserId] = useState(null);
  const loggedInUser = localStorage.getItem('username');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
      } else {
        console.error('User not found in API response');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);

  // Fetch events for the user
  useEffect(() => {
    if (userId !== null) {
      axios.get(`http://localhost:8080/api/events/${userId}`)
        .then(response => setEvents(response.data))
        .catch(error => console.error("Error fetching events:", error));
    }
  }, [userId, loggedInUser]);

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
  
    setNewEvent({
      title: event.title || '',
      start: event.startStr || '',
      end: event.endStr || '',
      description: event.extendedProps.description || ''
    });
    setIsEdit(true);
    setCurrentEventId(event.id);
    setIsModalOpen(true);
  };

  const handleSelect = (selectInfo) => {
    const selectedStartDate = new Date(selectInfo.startStr);
    const selectedEndDate = new Date(selectedStartDate);
    selectedEndDate.setHours(selectedEndDate.getHours() + 1);
  
    const formatDate = (date) => date.toISOString().slice(0, 16);
  
    setNewEvent({
      title: '',
      start: formatDate(selectedStartDate),
      end: formatDate(selectedEndDate),
      description: ''
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewEvent({ title: '', start: '', end: '', description: '' });
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const url = isEdit 
        ? `http://localhost:8080/api/events/${currentEventId}` 
        : 'http://localhost:8080/api/events';
      const method = isEdit ? 'put' : 'post';
      
      axios({
        method: method,
        url: url,
        data: { ...newEvent, userId }
      })
      .then(() => {
        axios.get(`http://localhost:8080/api/events/${userId}`)
          .then(response => setEvents(response.data))
          .catch(error => console.error("Error fetching events:", error));
        setIsModalOpen(false);
        setNewEvent({ title: '', start: '', end: '', description: '' });
      })
      .catch(error => console.error("Error saving event:", error));
    } else {
      console.error("Please fill all required fields");
    }
  };

  const handleDeleteEvent = () => {
    if (currentEventId) {
      axios.delete(`http://localhost:8080/api/events/${currentEventId}`)
        .then(() => {
          axios.get(`http://localhost:8080/api/events/${userId}`)
            .then(response => setEvents(response.data))
            .catch(error => console.error("Error fetching events:", error));
          setIsModalOpen(false);
          setNewEvent({ title: '', start: '', end: '', description: '' });
        })
        .catch(error => console.error("Error deleting event:", error));
    } else {
      console.error("No event ID specified for deletion.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  return (
    <div className="db-container">
      <aside className="db-sidebar">
        <div className="db-user">
          <div className="db-user-icon">{loggedInUser.charAt(0)}</div>
          <div className="db-user-info">
            <div className="db-user-email">{loggedInUser}@gmail.com</div>
            <button onClick={handleLogout} className="db-logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav>
          <button
            className={`db-nav-button ${location.pathname === '/Dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/Dashboard')}
          >
            <span className="icon">🏠</span> Home
          </button>
          <button
            className={`db-nav-button ${location.pathname === '/notes' ? 'active' : ''}`}
            onClick={() => navigate('/notes')}
          >
            <span className="icon">📝</span> Notes
          </button>
          <button
            className={`db-nav-button ${location.pathname === '/tasks' ? 'active' : ''}`}
            onClick={() => navigate('/To-Do')}
          >
            <span className="icon">✔️</span> To-Do
          </button>
          <button
            className={`db-nav-button ${location.pathname === '/calendar' ? 'active' : ''}`}
            onClick={() => navigate('/calendar')}
          >
            <span className="icon">📅</span> Calendar
          </button>
        </nav>
      </aside>
      <main className="calendar-main-content">
        <div className="calendar-view-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="80vh"
            events={events}
            eventClick={handleEventClick}
            selectable={true}
            select={handleSelect}
          />
        </div>
        {isModalOpen && (
          <div className="calendar-modal">
            <div className="calendar-modal-content">
              <h2>{isEdit ? 'Edit Event' : 'Add New Event'}</h2>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={handleInputChange}
              />
              <input
                type="datetime-local"
                name="start"
                placeholder="Start Date"
                value={newEvent.start}
                onChange={handleInputChange}
              />
              <input
                type="datetime-local"
                name="end"
                placeholder="End Date"
                value={newEvent.end}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newEvent.description}
                onChange={handleInputChange}
              />
              <div className="calendar-modal-buttons">
                <button onClick={handleSaveEvent}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
                {isEdit && <button onClick={handleDeleteEvent}>Delete</button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Calendar;
