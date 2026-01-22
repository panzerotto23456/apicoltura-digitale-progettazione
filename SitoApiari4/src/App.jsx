import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MapScreen from './components/MapScreen';
import AddApiaryScreen from './components/AddApiaryScreen';
import AddHiveScreen from './components/AddHiveScreen';
import ApiaryDetailScreen from './components/ApiaryDetailScreen';
import HiveDetailScreen from './components/HiveDetailScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [apiKey, setApiKey] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [currentApiary, setCurrentApiary] = useState(null);
  const [apiaries, setApiaries] = useState([]);
  const [selectedApiaryForView, setSelectedApiaryForView] = useState(null);
  const [selectedHive, setSelectedHive] = useState(null);
  const [selectedHiveNumber, setSelectedHiveNumber] = useState(null);
  const [selectedApiaryName, setSelectedApiaryName] = useState(null);
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);
  const [loadingApiaries, setLoadingApiaries] = useState(false);

  // Carica gli apiari dal database quando l'utente fa il login
  useEffect(() => {
    if (apiKey && currentScreen === 'map') {
      loadApiariesFromDB();
    }
  }, [apiKey, currentScreen]);

  const loadApiariesFromDB = async () => {
    setLoadingApiaries(true);
    try {
      const response = await fetch('https://dbarniadigitale-0abe.restdb.io/rest/apiari', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Apiari caricati dal database:', data);
        
        // Trasforma i dati per compatibilità con il resto dell'app
        const transformedApiaries = data.map(apiary => ({
          ...apiary,
          id: apiary._id,
          hives: apiary.hives || [],
          coordinates: {
            lat: apiary.api_lat,
            lng: apiary.api_lon
          },
          nome: apiary.api_nome,
          luogo: apiary.api_luogo
        }));
        
        setApiaries(transformedApiaries);
      } else {
        console.error('Errore nel caricamento degli apiari');
      }
    } catch (error) {
      console.error('Errore durante il caricamento degli apiari:', error);
    } finally {
      setLoadingApiaries(false);
    }
  };

  const handleLogin = (key) => {
    setApiKey(key);
    setCurrentScreen('map');
  };

  const handleAddApiary = (coordinates) => {
    setSelectedCoordinates(coordinates);
    setCurrentScreen('addApiary');
  };

  const handleApiaryCreated = (apiaryData) => {
    const newApiary = {
      ...apiaryData,
      id: apiaryData._id || apiaryData.id || Date.now(),
      hives: []
    };
    setCurrentApiary(newApiary);
    
    // Aggiungi l'apiario alla lista locale
    setApiaries([...apiaries, newApiary]);
    
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
    const existingApiary = apiaries.find(a => a.id === apiary.id || a._id === apiary._id);
    
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
    const currentApiaryInList = apiaries.find(a => a.id === apiary.id || a._id === apiary._id);
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
      const updatedApiary = apiaries.find(a => a.id === currentApiary.id || a._id === currentApiary._id);
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
    const updatedApiary = apiaries.find(a => a.id === selectedApiaryForView.id || a._id === selectedApiaryForView._id);
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
          apiKey={apiKey}
          onAddApiary={handleAddApiary}
          apiaries={apiaries}
          onViewApiary={handleViewApiary}
        />
      )}
      {currentScreen === 'addApiary' && (
        <AddApiaryScreen 
          apiKey={apiKey}
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