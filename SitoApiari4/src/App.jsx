import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MapScreen from './components/MapScreen';
import AddApiaryScreen from './components/AddApiaryScreen';
import AddHiveScreen from './components/AddHiveScreen';
import ApiaryDetailScreen from './components/ApiaryDetailScreen';
import HiveDetailScreen from './components/HiveDetailScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [currentApiary, setCurrentApiary] = useState(null);
  const [apiaries, setApiaries] = useState([]);
  const [selectedApiaryForView, setSelectedApiaryForView] = useState(null);
  const [selectedHive, setSelectedHive] = useState(null);
  const [selectedHiveNumber, setSelectedHiveNumber] = useState(null);
  const [selectedApiaryName, setSelectedApiaryName] = useState(null);
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);

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
    setIsAddingToExisting(false);
    setCurrentScreen('addHive');
  };

  const handleHivesCompleted = (updatedApiary) => {
    if (isAddingToExisting) {
      // Stiamo aggiungendo arnie a un apiario esistente
      const updatedApiaries = apiaries.map(a => 
        a.id === updatedApiary.id ? updatedApiary : a
      );
      setApiaries(updatedApiaries);
    } else {
      // Stiamo creando un nuovo apiario
      const apiaryExists = apiaries.some(a => a.id === updatedApiary.id);
      if (apiaryExists) {
        const updatedApiaries = apiaries.map(a => 
          a.id === updatedApiary.id ? updatedApiary : a
        );
        setApiaries(updatedApiaries);
      } else {
        setApiaries([...apiaries, updatedApiary]);
      }
    }
    
    // Vai sempre alla mappa quando si completa
    setCurrentScreen('map');
    setSelectedCoordinates(null);
    setCurrentApiary(null);
    setIsAddingToExisting(false);
    setSelectedApiaryForView(null);
  };

  const handleViewApiary = (apiary) => {
    // Cerca l'apiario nella lista esistente
    const existingApiary = apiaries.find(a => a.id === apiary.id);
    
    if (existingApiary) {
      // Se esiste, usa quello aggiornato dalla lista
      setSelectedApiaryForView(existingApiary);
    } else {
      // Se non esiste, aggiungilo
      const updatedApiaries = [...apiaries, apiary];
      setApiaries(updatedApiaries);
      setSelectedApiaryForView(apiary);
    }
    
    setCurrentScreen('apiaryDetail');
  };

  const handleAddHiveToApiary = (apiary) => {
    // Trova l'apiario più recente dalla lista
    const currentApiaryInList = apiaries.find(a => a.id === apiary.id);
    setCurrentApiary(currentApiaryInList || apiary);
    setIsAddingToExisting(true);
    setCurrentScreen('addHive');
  };

  const handleViewHive = (hive, hiveNumber, apiaryName) => {
    setSelectedHive(hive);
    setSelectedHiveNumber(hiveNumber);
    setSelectedApiaryName(apiaryName);
    setCurrentScreen('hiveDetail');
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
    setSelectedCoordinates(null);
    setCurrentApiary(null);
    setSelectedApiaryForView(null);
    setSelectedHive(null);
    setIsAddingToExisting(false);
  };

  const handleBackToApiary = () => {
    if (isAddingToExisting) {
      // Se stiamo aggiungendo a un apiario esistente, torna al dettaglio
      const updatedApiary = apiaries.find(a => a.id === currentApiary.id);
      if (updatedApiary) {
        setSelectedApiaryForView(updatedApiary);
      }
      setCurrentScreen('apiaryDetail');
    } else {
      // Altrimenti torna alla schermata di creazione apiario
      setCurrentScreen('addApiary');
    }
  };

  const handleBackToApiaryDetail = () => {
    // Aggiorna l'apiario selezionato con i dati più recenti
    const updatedApiary = apiaries.find(a => a.id === selectedApiaryForView.id);
    if (updatedApiary) {
      setSelectedApiaryForView(updatedApiary);
    }
    setCurrentScreen('apiaryDetail');
    setSelectedHive(null);
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
          onViewApiary={handleViewApiary}
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
          onViewApiary={handleViewApiary}
        />
      )}
      {currentScreen === 'apiaryDetail' && (
        <ApiaryDetailScreen
          apiary={selectedApiaryForView}
          onBack={handleBackToMap}
          onAddHive={handleAddHiveToApiary}
          onViewHive={handleViewHive}
        />
      )}
      {currentScreen === 'hiveDetail' && (
        <HiveDetailScreen
          hive={selectedHive}
          hiveNumber={selectedHiveNumber}
          apiaryName={selectedApiaryName}
          onBack={handleBackToApiaryDetail}
        />
      )}
    </div>
  );
}

export default App;