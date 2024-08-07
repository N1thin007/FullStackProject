import React from 'react';

const SettingsContext = React.createContext({
  workMinutes: 25,
  breakMinutes: 5,
  setWorkMinutes: () => {},
  setBreakMinutes: () => {},
});

export default SettingsContext;
