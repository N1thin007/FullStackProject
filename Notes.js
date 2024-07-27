import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Notes.css';

const Notes = () => {
  const initialNotes = JSON.parse(localStorage.getItem('notes')) || [
    { title: 'Untitled', timestamp: 'Just now', content: '' },
    { title: 'Untitled', timestamp: '20 minutes ago', content: '' },
  ];

  const [notes, setNotes] = useState(initialNotes);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInUser = localStorage.getItem('username');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleNewNote = () => {
    const newNote = {
      title: newNoteTitle || 'Untitled',
      timestamp: 'Just now',
      content: newNoteContent,
    };
    setNotes([...notes, newNote]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setActiveNote(newNote);
  };

  const handleNoteClick = (note) => {
    setActiveNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
  };

  const handleUpdateNote = () => {
    if (activeNote) {
      const updatedNotes = notes.map((note) =>
        note === activeNote
          ? { ...note, title: newNoteTitle, content: newNoteContent }
          : note
      );
      setNotes(updatedNotes);
    }
  };

  const handleDeleteNote = (noteToDelete) => {
    const updatedNotes = notes.filter(note => note !== noteToDelete);
    setNotes(updatedNotes);
    if (activeNote === noteToDelete) {
      setActiveNote(null);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  return (
    <div className="notes-container">
      <aside className="notes-sidebar">
        <div className="notes-user">
          <div className="notes-user-icon">{loggedInUser.charAt(0)}</div>
          <div className="notes-user-info">
            <div className="notes-user-email">{loggedInUser}@gmail.com</div>
            <button onClick={handleLogout} className="notes-logout-button">
              Logout
            </button>
          </div>
        </div>
        <nav>
          <button
            className={`notes-nav-button ${
              location.pathname === '/Dashboard' ? 'active' : ''
            }`}
            onClick={() => navigate('/Dashboard')}
          >
            <span className="icon">🏠</span> Home
          </button>
          <button
            className={`notes-nav-button ${
              location.pathname === '/notes' ? 'active' : ''
            }`}
            onClick={() => navigate('/notes')}
          >
            <span className="icon">📝</span> Notes
          </button>
          <button
            className={`notes-nav-button ${
              location.pathname === '/tasks' ? 'active' : ''
            }`}
            onClick={() => navigate('/To-Do')}
          >
            <span className="icon">✔️</span> To-Do
          </button>
          <button
            className={`notes-nav-button ${
              location.pathname === '/calendar' ? 'active' : ''
            }`}
            onClick={() => navigate('/calendar')}
          >
            <span className="icon">📅</span> Calendar
          </button>
        </nav>
      </aside>
      <main className="notes-main-content">
        <div className="notes-header">
          <h1>Notes</h1>
          <button className="notes-new-note-button" onClick={handleNewNote}>
            <span className="icon">➕</span> New Note
          </button>
        </div>
        <div className="notes-list">
          {notes.map((note, index) => (
            <div key={index} className="notes-item">
              <div onClick={() => handleNoteClick(note)}>
                <div className="notes-title">{note.title}</div>
                <div className="notes-timestamp">{note.timestamp}</div>
              </div>
              <button
                className="notes-delete-button"
                onClick={() => handleDeleteNote(note)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        <div className="notes-editor">
          <h2>Title</h2>
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title"
          />
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Note content"
          />
          <button onClick={handleUpdateNote}>Update Note</button>
        </div>
      </main>
    </div>
  );
};

export default Notes;
