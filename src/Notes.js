import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDeleteForever, MdSearch, MdAdd } from 'react-icons/md';
import './Notes.css';
import AppHeader from './AppHeader';

const Notes = ({ onNavigate }) => {
    const [notes, setNotes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    const [activeNote, setActiveNote] = useState(null);
    const [userId, setUserId] = useState(null);
    const [characterLimit] = useState(300);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const navigate = useNavigate();

    const loggedInUser = localStorage.getItem('username');

    useEffect(() => {
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

        if (loggedInUser) {
            fetchUserInfo();
        }
    }, [loggedInUser]);

    useEffect(() => {
        const fetchNotes = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notes/${userId}`);
                    setNotes(response.data);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            }
        };

        fetchNotes();
    }, [userId]);

    const handleSaveClick = async () => {
        if (activeNote) {
            await updateNote();
        } else {
            await addNote();
        }
    };

    const addNote = async () => {
        if (noteTitle.trim() || noteDescription.trim()) {
            try {
                const newNote = {
                    userId,
                    title: noteTitle || 'Untitled',
                    notes: noteDescription || '',
                    timestamp: new Date().toISOString(),
                };
                const response = await axios.post('http://localhost:8080/api/notes', newNote);
                setNotes(prevNotes => [response.data, ...prevNotes]);
                resetNoteFields();
                setIsPopupVisible(false);
            } catch (error) {
                console.error('Error adding note:', error);
            }
        }
    };

    const updateNote = async () => {
        if (activeNote && userId) {
            try {
                const updatedNote = { ...activeNote, title: noteTitle, notes: noteDescription };
                await axios.put(`http://localhost:8080/api/notes/${activeNote.id}`, updatedNote);
                setNotes(prevNotes =>
                    prevNotes.map(note => (note.id === activeNote.id ? updatedNote : note))
                );
                resetNoteFields();
                setActiveNote(null);
                setIsPopupVisible(false);
            } catch (error) {
                console.error('Error updating note:', error);
            }
        }
    };

    const deleteNote = async (id) => {
        try {
            const noteToDelete = document.querySelector(`.note-card[data-id="${id}"]`);
            if (noteToDelete) {
                noteToDelete.classList.add('note-card-disappear');
                setTimeout(async () => {
                    await axios.delete(`http://localhost:8080/api/notes/${id}`);
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
                    if (expandedNoteId === id) {
                        setExpandedNoteId(null);
                    }
                }, 600);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const resetNoteFields = () => {
        setNoteTitle('');
        setNoteDescription('');
    };

    const toggleExpandNote = (id) => {
        if (expandedNoteId === id) {
            setExpandedNoteId(null);
            resetNoteFields();
            setActiveNote(null);
        } else {
            setExpandedNoteId(id);
            const noteToEdit = notes.find(note => note.id === id);
            if (noteToEdit) {
                setActiveNote(noteToEdit);
                setNoteTitle(noteToEdit.title || '');
                setNoteDescription(noteToEdit.notes || '');
            }
        }
    };

    const handleTitleChange = (event) => setNoteTitle(event.target.value);

    const handleDescriptionChange = (event) => {
        if (characterLimit - event.target.value.length >= 0) {
            setNoteDescription(event.target.value);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/Login', { replace: true });
    };

    return (
        <div className={`notes-container ${darkMode ? 'notes-dark-mode' : ''}`}>
            <AppHeader onNavigate={onNavigate} onLogout={handleLogout} />

            <div className="notes-search">
                <MdSearch className="notes-search-icon" size="1.3em" />
                <input
                    onChange={(event) => setSearchText(event.target.value)}
                    type="text"
                    placeholder="Type to search..."
                    className="notes-search-input"
                />
            </div>

            <div className="notes-list">
                {notes
                    .filter(note =>
                        (note.title && note.title.toLowerCase().includes(searchText.toLowerCase())) ||
                        (note.notes && note.notes.toLowerCase().includes(searchText.toLowerCase()))
                    )
                    .map(note => (
                        <div
                            key={note.id}
                            className={`note-card ${expandedNoteId === note.id ? 'expanded' : ''}`}
                            data-id={note.id}
                            onClick={() => toggleExpandNote(note.id)}
                        >
                            <div className="note-card-title">
                                {note.title || 'Untitled'}
                            </div>
                            {expandedNoteId === note.id && (
                                <>
                                    <span className="note-card-description">
                                        {note.notes}
                                    </span>
                                    <div className="note-card-footer">
                                        <MdDeleteForever
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNote(note.id);
                                            }}
                                            className="note-card-delete-icon"
                                            size="1.3em"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                {/* Popup for adding or updating a note */}
                {isPopupVisible && (
                    <div className="notes-popup">
                        <div className="notes-popup-content">
                            <input
                                type="text"
                                placeholder="Title"
                                value={noteTitle}
                                onChange={handleTitleChange}
                                className="new-note-title"
                            />
                            <textarea
                                rows="8"
                                cols="10"
                                placeholder="Description"
                                value={noteDescription}
                                onChange={handleDescriptionChange}
                                className="new-note-textarea"
                            ></textarea>
                            <div className="notes-popup-footer">
                                <small className="new-note-remaining">
                                    {characterLimit - noteDescription.length} Remaining
                                </small>
                                <button className="notes-save-btn" onClick={handleSaveClick}>
                                    {activeNote ? 'Update' : 'Save'}
                                </button>
                                <button className="notes-popup-close" onClick={() => setIsPopupVisible(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="add-note-btn" onClick={() => setIsPopupVisible(true)}>
                <MdAdd size="2em" />
            </button>
        </div>
    );
};

export default Notes;