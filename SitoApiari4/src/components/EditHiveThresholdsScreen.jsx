import React, { useState, useEffect } from 'react';

const EditHiveThresholdsScreen = ({ hive, hiveNumber, apiaryName, onBack, apiKey }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sensors, setSensors] = useState([]);
  
  const [thresholds, setThresholds] = useState({
    pesoMax: '',
    pesoMin: '',
    pesoTimer: '',
    umiditaMax: '',
    umiditaMin: '',
    umiditaTimer: '',
    temperaturaMax: '',
    temperaturaMin: '',
    temperaturaTimer: ''
  });

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sensoriarnia`, {
        headers: { 'x-apikey': apiKey }
      });
      
      const allSensors = await response.json();
      
      // Filtra i sensori di questa arnia specifica
      const hiveSensors = allSensors.filter(s => s.sea_arn_id === hive.arn_id);
      setSensors(hiveSensors);
      
      // Carica i valori correnti nelle soglie
      const pesoSensor = hiveSensors.find(s => s.sea_tip_id === 6);
      const tempSensor = hiveSensors.find(s => s.sea_tip_id === 11);
      const umidSensor = hiveSensors.find(s => s.sea_tip_id !== 6 && s.sea_tip_id !== 11);
      
      setThresholds({
        pesoMax: pesoSensor?.sea_max || '',
        pesoMin: pesoSensor?.sea_min || '',
        pesoTimer: pesoSensor?.sea_timer || '',
        umiditaMax: umidSensor?.sea_max || '',
        umiditaMin: umidSensor?.sea_min || '',
        umiditaTimer: umidSensor?.sea_timer || '',
        temperaturaMax: tempSensor?.sea_max || '',
        temperaturaMin: tempSensor?.sea_min || '',
        temperaturaTimer: tempSensor?.sea_timer || ''
      });
    } catch (error) {
      console.error('Errore caricamento sensori:', error);
      alert('Errore nel caricamento dei sensori');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setThresholds({
      ...thresholds,
      [field]: value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const pesoSensor = sensors.find(s => s.sea_tip_id === 11);
      const tempSensor = sensors.find(s => s.sea_tip_id === 12);
      const umidSensor = sensors.find(s => s.sea_tip_id === 10);

      const updates = [];

      // Aggiorna sensore peso
      if (pesoSensor) {
        console.log(pesoSensor._id);
        updates.push(
          fetch(`${import.meta.env.VITE_API_BASE_URL}/sensoriarnia/${pesoSensor._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-apikey': apiKey
            },
            body: JSON.stringify({
              sea_max: parseFloat(thresholds.pesoMax) || pesoSensor.sea_max,
              sea_min: parseFloat(thresholds.pesoMin) || pesoSensor.sea_min,
            })
          })
        );
      }

      // Aggiorna sensore umidità
      if (umidSensor) {
        updates.push(
          fetch(`${import.meta.env.VITE_API_BASE_URL}/sensoriarnia/${umidSensor._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-apikey': apiKey
            },
            body: JSON.stringify({
              sea_max: parseFloat(thresholds.umiditaMax) || umidSensor.sea_max,
              sea_min: parseFloat(thresholds.umiditaMin) || umidSensor.sea_min,

            })
          })
        );
      }

      // Aggiorna sensore temperatura
      if (tempSensor) {
        updates.push(
          fetch(`${import.meta.env.VITE_API_BASE_URL}/sensoriarnia/${tempSensor._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-apikey': apiKey
            },
            body: JSON.stringify({
              sea_max: parseFloat(thresholds.temperaturaMax) || tempSensor.sea_max,
              sea_min: parseFloat(thresholds.temperaturaMin) || tempSensor.sea_min,
            })
          })
        );
      }

      await Promise.all(updates);
      
      alert('Soglie aggiornate con successo!');
      onBack();
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      alert('Errore durante il salvataggio delle soglie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef8e8] flex items-center justify-center">
        <p className="text-xl text-gray-800">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef8e8] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-[#e69a4f] rounded-full px-8 py-3 mb-6 text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Modifica Soglie Arnia {hiveNumber}
          </h1>
        </div>

        <h2 className="text-xl font-normal text-gray-800 mb-2 text-center">
          Apiario: {apiaryName}
        </h2>
        <p className="text-base text-gray-600 mb-6 text-center">
          MAC Address: {hive.MacAddress || 'N/A'}
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-6 text-center">
          Imposta le soglie dei sensori:
        </h3>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Peso */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Peso:</h3>
            <input
              type="number"
              step="0.1"
              placeholder="Soglia max (kg)"
              value={thresholds.pesoMax}
              onChange={(e) => handleInputChange('pesoMax', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Soglia min (kg)"
              value={thresholds.pesoMin}
              onChange={(e) => handleInputChange('pesoMin', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          {/* Umidità */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Umidità:</h3>
            <input
              type="number"
              step="0.1"
              placeholder="Soglia max (%)"
              value={thresholds.umiditaMax}
              onChange={(e) => handleInputChange('umiditaMax', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Soglia min (%)"
              value={thresholds.umiditaMin}
              onChange={(e) => handleInputChange('umiditaMin', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          {/* Temperatura */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Temperatura:</h3>
            <input
              type="number"
              step="0.1"
              placeholder="Soglia max (°C)"
              value={thresholds.temperaturaMax}
              onChange={(e) => handleInputChange('temperaturaMax', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Soglia min (°C)"
              value={thresholds.temperaturaMin}
              onChange={(e) => handleInputChange('temperaturaMin', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50"
            />

          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-16 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
          </button>

          <button
            onClick={onBack}
            disabled={saving}
            className="px-8 py-3 text-base font-normal text-gray-800 bg-white border-2 border-gray-800 rounded-full cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHiveThresholdsScreen;