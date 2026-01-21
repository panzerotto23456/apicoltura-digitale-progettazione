import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MapScreen from './components/MapScreen';
import AddApiaryScreen from './components/AddApiaryScreen';
import AddHiveScreen from './components/AddHiveScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'map', 'addApiary', 'addHive'
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [currentApiary, setCurrentApiary] = useState(null);
  const [apiaries, setApiaries] = useState([]); // Lista di tutti gli apiari

  const handleLogin = () => {
    setCurrentScreen('map');
  };

  const handleAddApiary = (coordinates) => {
    setSelectedCoordinates(coordinates);
    setCurrentScreen('addApiary');
  };

  const handleApiaryCreated = (apiaryData) => {
    const newApiary = {
      ...apiaryData,
      id: Date.now(),
      hives: []
    };
    setCurrentApiary(newApiary);
    setCurrentScreen('addHive');
  };

  const handleHivesCompleted = (apiary) => {
    // Aggiungi l'apiario alla lista degli apiari
    setApiaries([...apiaries, apiary]);
    setCurrentScreen('map');
    setSelectedCoordinates(null);
    setCurrentApiary(null);
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
    setSelectedCoordinates(null);
    setCurrentApiary(null);
  };

  const handleBackToApiary = () => {
    setCurrentScreen('addApiary');
  };

  return (
    <div className="App">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'map' && (
        <MapScreen 
          onAddApiary={handleAddApiary}
          apiaries={apiaries}
        />
      )}
      {currentScreen === 'addApiary' && (
        <AddApiaryScreen 
          coordinates={selectedCoordinates} 
          onBack={handleBackToMap}
          onApiaryCreated={handleApiaryCreated}
        />
      )}
      {currentScreen === 'addHive' && (
        <AddHiveScreen 
          apiary={currentApiary}
          onBack={handleBackToApiary}
          onComplete={handleHivesCompleted}
        />
      )}
    </div>
  );
}

export default App;