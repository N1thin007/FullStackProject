import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdMic, MdMicOff } from 'react-icons/md'; 
import './AIScheduler.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AppHeader from './AppHeader';

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split('T')[0];

const predefinedInstruction = `
  Please provide the following event details in JSON format: title, start time, end time, and description.
  Today's date is ${currentDateString}.
  I want appropriate Title good Grammer try to limit words but don't change or make difficult meaning.
  if time not mentioned then set the time as per the universal standards.
  just give me only in JSON format alone such that I can post in backend, if extra words you give then error, so strictly follow json what ever condition maybe please.
  Example format: [
    {
      "title": "Event Title",
      "start": "2024-07-26T00:00",
      "end": "2024-07-26T01:00",
      "description": "Event Description"
    }
  ]
`;

const AIScheduler = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');
  const [userId, setUserId] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setPrompt(transcript);
  }, [transcript]);

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

  const parseResponseToEvents = (responseText) => {
    try {
      const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let events = JSON.parse(cleanedText);

      if (Array.isArray(events)) {
        return events.map(event => ({
          userId: userId,
          title: event.title ? event.title.trim() : 'Untitled',
          start: event.start ? event.start.trim() : new Date().toISOString(),
          end: event.end ? event.end.trim() : new Date(new Date().getTime() + 3600000).toISOString(),
          description: event.description ? event.description.trim() : 'No description'
        }));
      } else {
        throw new Error('Parsed data is not an array.');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      alert('Failed to parse AI response. Please ensure the format is correct.');
      return [];
    }
  };

  const handleGenerate = async () => {
    try {
      const fullPrompt = predefinedInstruction + '\n' + prompt;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyARWROMSPKHahhdQDW193k6WHZ9UBm1bDY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ]
        }),
      });

      const data = await response.json();
      console.log('Full API response:', data);

      if (response.ok) {
        if (data.candidates && data.candidates.length > 0) {
          const responseText = data.candidates[0].content.parts.map(part => part.text).join(' ');
          console.log('Raw response text:', responseText);

          const events = parseResponseToEvents(responseText);

          if (events.length > 0) {
            setResponses(events); 
          } else {
            alert('No valid events to display.');
          }
        } else {
          alert('No valid response received from the AI.');
        }
      } else {
        alert('Error: ' + (data.message || 'Unknown error occurred'));
      }

      
    } catch (error) {
      console.error('Error during API call:', error);
      alert('API call failed: Network error or server not responding.');
    }
  };

  const handleDeclineAll = () => {
    setResponses([]);
    setPrompt(''); 
    alert('All events have been declined.');
  };
  
  const handleApproveAll = async () => {
    try {
      const calendarResponse = await fetch('http://localhost:8080/api/events/multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });
  
      if (calendarResponse.ok) {
        alert('All events added to calendar successfully.');
        setResponses([]); // Clear the responses after approval
        setPrompt(''); // Reset the prompt textarea
      } else {
        alert('Failed to add events to calendar.');
      }
    } catch (error) {
      console.error('Error adding events to calendar:', error);
      alert('Failed to add events to calendar.');
    }
  };
  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = { ...updatedResponses[index], [field]: value };
    setResponses(updatedResponses);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode); // Toggle edit mode
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className='Vb'>
      <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
        <AppHeader username={loggedInUser} />
      </div>
      <div className="ai-container">
        <div className="ai-content">
          <h1>AI Scheduler</h1>
          <div className="ai-prompt-container">
            <div className="ai-prompt-input-container">
              <textarea
                className="ai-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
              />
              <button className="ai-mic-button" onClick={handleMicClick}>
                {listening ? <MdMic size={24} /> : <MdMicOff size={24} />} {/* Use microphone icons */}
              </button>
              <button className="ai-generate-button" onClick={handleGenerate}>Generate</button>
            </div>
          </div>
          {responses.length > 0 && (
            <div className="ai-response">
              <h2>AI Responses</h2>
              <button className="edit-button" onClick={toggleEditMode}>
                {isEditMode ? 'Save' : 'Edit'}
              </button>
              <table className="ai-response-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((event, index) => (
                    <tr key={index}>
                      <td>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                          />
                        ) : (
                          event.title
                        )}
                      </td>
                      <td>
                        {isEditMode ? (
                          <input
                            type="datetime-local"
                            value={event.start}
                            onChange={(e) => handleInputChange(index, 'start', e.target.value)}
                          />
                        ) : (
                          event.start
                        )}
                      </td>
                      <td>
                        {isEditMode ? (
                          <input
                            type="datetime-local"
                            value={event.end}
                            onChange={(e) => handleInputChange(index, 'end', e.target.value)}
                          />
                        ) : (
                          event.end
                        )}
                      </td>
                      <td>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={event.description}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                          />
                        ) : (
                          event.description
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                <button className="decline-all-button" onClick={handleDeclineAll} style={{marginRight:'10px'}}>Decline All</button>
                <button className="approve-all-button" onClick={handleApproveAll}>Approve All</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScheduler;