import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MapScreen from './components/MapScreen';
import ApiaryDetailScreen from './components/ApiaryDetailScreen';
import HiveDetailScreen from './components/HiveDetailScreen';
import { API_BASE_URL } from './config';
import EditHiveThresholdsScreen from './components/EditHiveThresholdsScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [apiKey, setApiKey] = useState(null);
  const [apiaries, setApiaries] = useState([]);
  const [selectedApiary, setSelectedApiary] = useState(null);
  const [selectedHive, setSelectedHive] = useState(null);
  const [selectedHiveNumber, setSelectedHiveNumber] = useState(null);
  const [loadingApiaries, setLoadingApiaries] = useState(false);

  useEffect(() => {
    if (apiKey && currentScreen === 'map') {
      loadApiariesFromDB();
    }
  }, [apiKey, currentScreen]);

  const loadApiariesFromDB = async () => {
    setLoadingApiaries(true);
    try {
      const [apiariesRes, hivesRes, sensorsRes, readingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/apiari`, {
          headers: { 'x-apikey': apiKey }
        }),
        fetch(`${API_BASE_URL}/arnie`, {
          headers: { 'x-apikey': apiKey }
        }),
        fetch(`${API_BASE_URL}/sensoriarnia`, {
          headers: { 'x-apikey': apiKey }
        }),
        fetch(`${API_BASE_URL}/rilevazioni`, {
          headers: { 'x-apikey': apiKey }
        })
      ]);

      const apiariesData = await apiariesRes.json();
      const hivesData = await hivesRes.json();
      const sensorsData = await sensorsRes.json();
      const readingsData = await readingsRes.json();

      const transformedApiaries = apiariesData.map(apiary => {
        const apiaryHives = hivesData
          .filter(hive => hive.arn_api_id === apiary.api_id)
          .map(hive => {
            const hiveSensors = sensorsData.filter(s => s.sea_arn_id === hive.arn_id);
            
            const getLatestReading = (sensorTypeId) => {
              const sensor = hiveSensors.find(s => s.sea_tip_id === sensorTypeId);
              if (!sensor) return null;
              
              const sensorReadings = readingsData
                .filter(r => r.ril_sea_id === sensor.sea_id)
                .sort((a, b) => new Date(b.ril_dataOra) - new Date(a.ril_dataOra));
              
              return sensorReadings[0] || null;
            };
            
            const pesoReading = getLatestReading(6);
            const tempReading = getLatestReading(11);
            const umidSensor = hiveSensors.find(s => s.sea_tip_id !== 6 && s.sea_tip_id !== 11);
            const umidReading = umidSensor ? readingsData
              .filter(r => r.ril_sea_id === umidSensor.sea_id)
              .sort((a, b) => new Date(b.ril_dataOra) - new Date(a.ril_dataOra))[0] : null;
            
            const pesoSensor = hiveSensors.find(s => s.sea_tip_id === 6);
            const tempSensor = hiveSensors.find(s => s.sea_tip_id === 11);
            
            return {
              id: hive._id,
              arn_id: hive.arn_id,
              pesoMax: pesoSensor?.sea_max,
              pesoMin: pesoSensor?.sea_min,
              pesoCurrent: pesoReading?.ril_dato,
              umiditaMax: umidSensor?.sea_max,
              umiditaMin: umidSensor?.sea_min,
              umiditaCurrent: umidReading?.ril_dato,
              temperaturaMax: tempSensor?.sea_max,
              temperaturaMin: tempSensor?.sea_min,
              temperaturaCurrent: tempReading?.ril_dato,
              MacAddress: hive.arn_MacAddress,
              lastUpdate: [pesoReading, tempReading, umidReading]
                .filter(r => r)
                .map(r => new Date(r.ril_dataOra))
                .sort((a, b) => b - a)[0]
            };
          });
        
        return {
          id: apiary._id,
          api_id: apiary.api_id,
          nome: apiary.api_nome,
          luogo: apiary.api_luogo,
          coordinates: { lat: apiary.api_lat, lng: apiary.api_lon },
          hives: apiaryHives
        };
      });

      setApiaries(transformedApiaries);
    } catch (error) {
      console.error('Errore caricamento dati:', error);
      alert('Errore nel caricamento dei dati: ' + error.message);
    } finally {
      setLoadingApiaries(false);
    }
  };

  const handleLogin = (key) => {
    setApiKey(key);
    setCurrentScreen('map');
  };

  const handleViewApiary = (apiary) => {
    setSelectedApiary(apiary);
    setCurrentScreen('apiaryDetail');
  };

  const handleViewHive = (hive, hiveNumber, apiaryName) => {
    setSelectedHive(hive);
    setSelectedHiveNumber(hiveNumber);
    setCurrentScreen('hiveDetail');
  };

  const handleEditHiveThresholds = (hive, hiveNumber, apiaryName) => {
    setSelectedHive(hive);
    setSelectedHiveNumber(hiveNumber);
    setCurrentScreen('editHiveThresholds');
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
    setSelectedApiary(null);
    setSelectedHive(null);
    loadApiariesFromDB(); // Ricarica i dati dopo le modifiche
  };

  const handleBackToApiary = () => {
    setCurrentScreen('apiaryDetail');
    setSelectedHive(null);
    loadApiariesFromDB(); // Ricarica i dati dopo le modifiche
  };

  return (
    <div className="App">
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === 'map' && (
        <MapScreen 
          apiaries={apiaries} 
          onViewApiary={handleViewApiary}
          loadingApiaries={loadingApiaries}
        />
      )}
      {currentScreen === 'apiaryDetail' && selectedApiary && (
        <ApiaryDetailScreen
          apiary={selectedApiary}
          onBack={handleBackToMap}
          onViewHive={handleViewHive}
          onEditHiveThresholds={handleEditHiveThresholds}
        />
      )}
      {currentScreen === 'hiveDetail' && selectedHive && (
        <HiveDetailScreen
          hive={selectedHive}
          hiveNumber={selectedHiveNumber}
          apiaryName={selectedApiary?.nome}
          onBack={handleBackToApiary}
          apiKey={apiKey}
        />
      )}
      {currentScreen === 'editHiveThresholds' && selectedHive && (
        <EditHiveThresholdsScreen
          hive={selectedHive}
          hiveNumber={selectedHiveNumber}
          apiaryName={selectedApiary?.nome}
          onBack={handleBackToApiary}
          apiKey={apiKey}
        />
      )}
    </div>
  );
}

export default App;