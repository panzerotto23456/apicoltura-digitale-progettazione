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
    console.log('UseEffect triggered - Screen:', currentScreen, 'ApiKey:', apiKey);
    if (apiKey && currentScreen === 'map') {
      loadApiariesFromDB();
    }
  }, [apiKey, currentScreen]);

  const loadApiariesFromDB = async () => {
  console.log('=== INIZIO CARICAMENTO APIARI DAL DATABASE ===');
  console.log('API Key utilizzata:', apiKey);
  
  setLoadingApiaries(true);
  try {
    // Carica apiari
    const apiariesResponse = await fetch('https://databaseclone2-bc78.restdb.io/rest/apiari', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': apiKey
      }
    });

    // Carica arnie
    const hivesResponse = await fetch('https://databaseclone2-bc78.restdb.io/rest/arnie', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': apiKey
      }
    });

    if (apiariesResponse.ok && hivesResponse.ok) {
      const apiariesData = await apiariesResponse.json();
      const hivesData = await hivesResponse.json();
      
      console.log('=== DATI RICEVUTI DAL DATABASE ===');
      console.log('Numero di apiari:', apiariesData.length);
      console.log('Numero di arnie:', hivesData.length);
      console.log('Apiari:', apiariesData);
      console.log('Arnie:', hivesData);
      
      // Trasforma i dati per compatibilità con il resto dell'app
      const transformedApiaries = apiariesData.map(apiary => {
        // Trova tutte le arnie associate a questo apiario
        const apiaryHives = hivesData
          .filter(hive => hive.arn_api_id === apiary._id)
          .map(hive => ({
            id: hive._id,
            pesoMax: hive.arn_pesoMax,
            pesoMin: hive.arn_pesoMin,
            umiditaMax: hive.arn_umiditaMax,
            umiditaMin: hive.arn_umiditaMin,
            temperaturaMax: hive.arn_temperaturaMax,
            temperaturaMin: hive.arn_temperaturaMin,
            dataInst: hive.arn_dataInst,
            piena: hive.arn_piena,
            MacAddress: hive.arn_MacAddress
          }));
        
        console.log(`Apiario ${apiary.api_nome}: ${apiaryHives.length} arnie`);
        console.log('ID apiario:', apiary._id);
        console.log('Arnie trovate:', apiaryHives);
        
        const transformed = {
          ...apiary,
          id: apiary._id,
          hives: apiaryHives,
          coordinates: {
            lat: apiary.api_lat,
            lng: apiary.api_lon
          },
          nome: apiary.api_nome,
          luogo: apiary.api_luogo
        };
        
        return transformed;
      });
      
      console.log('=== APIARI TRASFORMATI ===');
      console.log('Numero:', transformedApiaries.length);
      console.log('Dati completi:', transformedApiaries);
      
      setApiaries(transformedApiaries);
    } else {
      console.error('Errore nel caricamento dei dati');
      alert('Errore nel caricamento dei dati dal database');
    }
  } catch (error) {
    console.error('=== ERRORE DURANTE IL CARICAMENTO ===');
    console.error('Errore:', error);
    console.error('Stack:', error.stack);
    alert('Errore di rete: ' + error.message);
  } finally {
    setLoadingApiaries(false);
    console.log('=== FINE CARICAMENTO APIARI ===');
  }
};
  const handleLogin = (key) => {
    console.log('Login effettuato con chiave:', key);
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

  console.log('=== RENDER APP ===');
  console.log('Current screen:', currentScreen);
  console.log('Numero apiari:', apiaries.length);
  console.log('Apiari:', apiaries);

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
          loadingApiaries={loadingApiaries}
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