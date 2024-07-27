package com.project.practice.service;

import com.project.practice.model.Event;
import com.project.practice.model.Login;
import com.project.practice.repository.EventRepository;
import com.project.practice.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private LoginRepository loginRepository;

    /**
     * Fetches events based on the user ID.
     * 
     * @param userId The ID of the user.
     * @return A list of events associated with the given user ID.
     */
    public List<Event> getEventsByUserId(Long userId) {
        return eventRepository.findByUserId(userId);
    }

    /**
     * Retrieves an event by its ID.
     * 
     * @param id The ID of the event.
     * @return An Optional containing the event if found, otherwise empty.
     */
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    /**
     * Saves an event to the database. If the event has an ID, it will update the existing event.
     * 
     * @param event The event to save.
     * @return The saved event.
     */
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    /**
     * Deletes an event by its ID.
     * 
     * @param id The ID of the event to delete.
     */
    public void deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Event with ID " + id + " does not exist.");
        }
    }

    /**
     * Retrieves the user ID based on the username.
     * 
     * @param username The username of the user.
     * @return The ID of the user if found, otherwise null.
     */
    public Long getUserIdByUsername(String username) {
        Login login = loginRepository.findByUsername(username);
        return login != null ? login.getId() : null;
    }
}
