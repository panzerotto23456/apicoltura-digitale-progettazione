import React, { useState, useEffect } from 'react';
import { Scale, Droplets, Thermometer, ArrowLeft, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HiveDetailScreen = ({ hive, hiveNumber, apiaryName, onBack, apiKey }) => {
  const [viewMode, setViewMode] = useState('combinato');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHiveReadings();
  }, [hive.id]);

  const loadHiveReadings = async () => {
    setLoading(true);
    try {
      const [sensorsRes, readingsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/sensoriarnia`, {
          headers: { 'x-apikey': apiKey }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/rilevazioni`, {
          headers: { 'x-apikey': apiKey }
        })
      ]);

      const sensors = await sensorsRes.json();
      const readings = await readingsRes.json();

      // Trova i sensori di questa arnia
      const hiveSensors = sensors.filter(s => s.sea_arn_id === hive.arn_id);
      
      // Mappa tipo sensore
      const pesoSensor = hiveSensors.find(s => s.sea_tip_id === 6);
      const tempSensor = hiveSensors.find(s => s.sea_tip_id === 11);
      const umidSensor = hiveSensors.find(s => s.sea_tip_id !== 6 && s.sea_tip_id !== 11);

      // Recupera tutte le rilevazioni per ogni sensore
      const pesoReadings = pesoSensor ? readings.filter(r => r.ril_sea_id === pesoSensor.sea_id) : [];
      const tempReadings = tempSensor ? readings.filter(r => r.ril_sea_id === tempSensor.sea_id) : [];
      const umidReadings = umidSensor ? readings.filter(r => r.ril_sea_id === umidSensor.sea_id) : [];

      // Combina i dati per il grafico
      const readingsMap = new Map();

      [...pesoReadings, ...tempReadings, ...umidReadings].forEach(r => {
        const time = new Date(r.ril_dataOra).getTime();
        if (!readingsMap.has(time)) {
          readingsMap.set(time, { time: r.ril_dataOra });
        }
        
        const entry = readingsMap.get(time);
        if (pesoReadings.includes(r)) entry.peso = parseFloat(r.ril_dato);
        if (tempReadings.includes(r)) entry.temperatura = parseFloat(r.ril_dato);
        if (umidReadings.includes(r)) entry.umidita = parseFloat(r.ril_dato);
      });

      const sortedData = Array.from(readingsMap.values())
        .sort((a, b) => new Date(a.time) - new Date(b.time))
        .slice(-24) // Ultime 24 rilevazioni
        .map(d => ({
          ...d,
          timeFormatted: new Date(d.time).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

      setChartData(sortedData);
    } catch (error) {
      console.error('Errore caricamento rilevazioni:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentValues = chartData.length > 0 ? {
    peso: chartData[chartData.length - 1].peso?.toFixed(1) || 'N/A',
    temperatura: chartData[chartData.length - 1].temperatura?.toFixed(1) || 'N/A',
    umidita: chartData[chartData.length - 1].umidita?.toFixed(1) || 'N/A'
  } : { peso: 'N/A', temperatura: 'N/A', umidita: 'N/A' };

  return (
    <div className="min-h-screen bg-[#fef8e8] px-6 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-base font-medium text-gray-800 bg-[#e69a4f] rounded-full hover:bg-[#d88a3f] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Torna all'Apiario</span>
        </button>

        <div className="flex gap-2 bg-white rounded-full p-1 border-2 border-gray-800">
          <button
            onClick={() => setViewMode('combinato')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'combinato' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            Combinato
          </button>
          <button
            onClick={() => setViewMode('diviso')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'diviso' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            Diviso
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Arnia {hiveNumber}</h1>
        <p className="text-lg text-gray-600">{apiaryName}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-gray-600 mt-4">Caricamento dati...</p>
        </div>
      ) : viewMode === 'combinato' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Peso</span>
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-800">{currentValues.peso}</span>
                <span className="text-sm text-gray-600">kg</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Temperatura</span>
                <Thermometer className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-800">{currentValues.temperatura}</span>
                <span className="text-sm text-gray-600">°C</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Umidità</span>
                <Droplets className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-800">{currentValues.umidita}</span>
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Panoramica Completa</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="timeFormatted" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} dot={false} name="Peso (kg)" />
                <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} dot={false} name="Temperatura (°C)" />
                <Line type="monotone" dataKey="umidita" stroke="#06b6d4" strokeWidth={2} dot={false} name="Umidità (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {['peso', 'temperatura', 'umidita'].map((metric) => {
            const config = {
              peso: { title: 'Peso', color: '#3b82f6', label: 'Peso (kg)' },
              temperatura: { title: 'Temperatura', color: '#ef4444', label: 'Temperatura (°C)' },
              umidita: { title: 'Umidità', color: '#06b6d4', label: 'Umidità (%)' }
            }[metric];

            return (
              <div key={metric} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{config.title}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="timeFormatted" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey={metric} stroke={config.color} strokeWidth={2} dot={false} name={config.label} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HiveDetailScreen;