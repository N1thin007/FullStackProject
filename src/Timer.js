import React, { useEffect, useState, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactSlider from 'react-slider';
import { FaPlay, FaPause } from 'react-icons/fa'; // Import play and pause icons
import './Slider.css'; // Updated slider CSS
import './Timer.css'; // Custom styles for the Centered Timer component
import AppHeader from './AppHeader';
import loftMusic from './lofi-music.mp3'; // Import your lofi music file

const red = '#f54e4e';
const green = '#4aec8c';

const Timer = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work'); // work/break
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25); // Default work duration
  const [breakMinutes, setBreakMinutes] = useState(5); // Default break duration
  const [pomodoroCount, setPomodoroCount] = useState(1); // Number of Pomodoro sessions
  const [completedPomodoros, setCompletedPomodoros] = useState(0); // Completed Pomodoros
  const [taskName, setTaskName] = useState(''); // Task name
  const [isPlaying, setIsPlaying] = useState(false); // State for music playback

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const audioRef = useRef(null); // Reference for the audio element

  useEffect(() => {
    // Set the initial timer when the component mounts or when the work/break minutes change
    resetTimer();
  }, [workMinutes, breakMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        switchMode();
        return;
      }
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function resetTimer() {
    // Set the initial seconds based on the current mode
    const initialSeconds = modeRef.current === 'work' ? workMinutes * 60 : breakMinutes * 60;
    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;
    isPausedRef.current = true;
    setIsPaused(true);
  }

  function switchMode() {
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';
    modeRef.current = nextMode; // Update the mode reference
    setMode(nextMode); // Update the mode state

    // Set the next seconds based on the new mode
    const nextSeconds = nextMode === 'work' ? workMinutes * 60 : breakMinutes * 60;

    if (nextMode === 'work') {
      setCompletedPomodoros(prev => prev + 1); // Increment completed Pomodoros
    }

    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;
  }

  const totalSeconds = mode === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = '0' + seconds;

  const handleMusicClick = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause the music
      audioRef.current.currentTime = 0; // Reset to the beginning
    } else {
      audioRef.current.play(); // Play the music
    }
    setIsPlaying(!isPlaying); // Toggle the playing state
  };

  return (
    <div className='hehe'>
      <div style={{ marginTop: '30px', marginLeft: '30px', marginRight: '30px', marginBottom: '30px' }}>
        <AppHeader />
        <div>
          <div className='no'>
            <div className="timer-container">
              <h1 className="timer-title">Pomodoro Timer</h1>
              <CircularProgressbar
                value={percentage}
                text={`${minutes}:${seconds}`} // Only show minutes and seconds
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: mode === 'work' ? red : green, // Change color based on mode
                  tailColor: 'rgba(255,255,255,.2)',
                })}
              />
              <div className="timer-controls">
                {isPaused
                  ? <button className="timer-button" onClick={() => { setIsPaused(false); isPausedRef.current = false; }}>Play</button>
                  : <button className="timer-button" onClick={() => { setIsPaused(true); isPausedRef.current = true; }}>Pause</button>}
              </div>
              <div className="timer-controls">
                <button className="timer-rebutton" onClick={resetTimer}>Reset</button>
                <button className="timer-button" onClick={() => setShowSettings(true)}>Settings</button>
              </div>
              {showSettings && (
                <div className="settings-modal">
                  <div className="settings-content">
                    <h2>Settings</h2>
                    <label>Work Duration: {workMinutes} minutes</label>
                    <ReactSlider
                      className={'slider'}
                      thumbClassName={'slider-thumb'}
                      trackClassName={'slider-track'}
                      value={workMinutes}
                      onChange={newValue => {
                        setWorkMinutes(newValue);
                        resetTimer(); // Reset timer to apply new work duration immediately
                      }}
                      min={1}
                      max={120}
                    />
                    <label className="break-duration-label">Break Duration: {breakMinutes} minutes</label>
                    <ReactSlider
                      className={'slider green'}
                      thumbClassName={'slider-thumb'}
                      trackClassName={'slider-track'}
                      value={breakMinutes}
                      onChange={newValue => {
                        setBreakMinutes(newValue);
                        resetTimer(); // Reset timer to apply new break duration immediately
                      }}
                      min={1}
                      max={120}
                    />
                    <div className="settings-controls">
                      <button className="settings-button" onClick={() => setShowSettings(false)}>Back</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Input and Completed Sessions Card */}
      <div className="pomodoro-card">
        <h2>Tasks</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
        />
        <input
          type="number"
          value={pomodoroCount}
          onChange={(e) => setPomodoroCount(parseInt(e.target.value))}
          min={1}
          max={10}
          placeholder='Estimated Pomodoros'
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
        />
        <div className="completed-pomodoros">
          <h3>Completed Pomodoros: {completedPomodoros}/{pomodoroCount}</h3>
        </div>
      </div>

      {/* Music Playback Button */}
      <div className="music-controls">
        <audio ref={audioRef} loop>
          <source src={loftMusic} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <button className="music-button" onClick={handleMusicClick}>
          {isPlaying ? <FaPause /> : <FaPlay />} {/* Use icons instead of text */}
        </button>
      </div>
    </div>
  );
};

export default Timer;
