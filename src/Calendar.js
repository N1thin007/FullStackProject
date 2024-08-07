import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './Calendar.css';
import AppHeader from './AppHeader';
const Calendar = () => {
  const [email, setEmail] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [userId, setUserId] = useState(null);
  const loggedInUser = localStorage.getItem('username');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
const [popupMessage, setPopupMessage] = useState('');

const showPopup = (message) => {
  setPopupMessage(message);
  setIsPopupVisible(true);
  setTimeout(() => {
    setIsPopupVisible(false);
  }, 3000);
};

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/login');
        const currentUser = response.data.find(user => user.username === loggedInUser);
        if (currentUser) {
          setUserId(currentUser.id);
          setEmail(currentUser.email);
        } else {
          console.error('User not found in API response');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [loggedInUser]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const upcomingEvents = events.filter(event => {
        const startTime = new Date(event.start);
        const timeDifference = startTime - now;
        return timeDifference > 0 && timeDifference <= 600000; 
      });

      upcomingEvents.forEach(event => {
        sendEmailAlert(event);
      });
    }, 60000); 
  
    return () => clearInterval(interval);
  }, [events]);
  
  const sendEmailAlert = (event) => { 
    const templateParams = {
      to_email: email,
      event_title: event.title,
      event_start: new Date(event.start).toLocaleString(),
      event_description: event.description || 'No description provided',
    };

    emailjs.send('service_grrc09p', 'template_fz3jxvw', templateParams, '9qPVcliB0l4Hvmnc3')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
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
        showPopup(isEdit ? 'Event updated!' : 'New event added!');
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
          showPopup('Event deleted!');
        })
        .catch(error => console.error("Error deleting event:", error));
    } else {
      console.error("No event ID specified for deletion.");
    }
  };

  return (
    <div className='mainaaa'>
         <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
        <AppHeader />
        </div>
    <div className="calendar-main-content">
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
      {isPopupVisible && (
  <div className="calendar-popup">
    {popupMessage}
  </div>
)}
    </div>
    </div>
  );
};

export default Calendar;