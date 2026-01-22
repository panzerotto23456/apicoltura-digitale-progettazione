import React, { useState } from 'react';
import { Scale, Droplets, Thermometer, ArrowLeft, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HiveDetailScreen = ({ hive, hiveNumber, apiaryName, onBack }) => {
  const [viewMode, setViewMode] = useState('diviso'); // 'diviso' o 'combinato'

  // Genera dati simulati per i grafici
  const generateChartData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      
      // Calcola valori basati sui min/max dell'arnia
      const pesoBase = hive.pesoMax && hive.pesoMin 
        ? (parseFloat(hive.pesoMax) + parseFloat(hive.pesoMin)) / 2 
        : 45;
      const tempBase = hive.temperaturaMax && hive.temperaturaMin 
        ? (parseFloat(hive.temperaturaMax) + parseFloat(hive.temperaturaMin)) / 2 
        : 35;
      const umidBase = hive.umiditaMax && hive.umiditaMin 
        ? (parseFloat(hive.umiditaMax) + parseFloat(hive.umiditaMin)) / 2 
        : 65;
      
      data.push({
        time: `${hours}:${minutes}`,
        peso: (pesoBase + Math.sin(i * 0.3) * 2 + Math.random() * 0.5).toFixed(1),
        temperatura: (tempBase + Math.sin(i * 0.4) * 1.5 + Math.random() * 0.3).toFixed(1),
        umidita: (umidBase + Math.sin(i * 0.5) * 8 + Math.random() * 2).toFixed(1)
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  // Calcola i valori correnti (ultimo dato)
  const currentValues = {
    peso: chartData[chartData.length - 1].peso,
    temperatura: chartData[chartData.length - 1].temperatura,
    umidita: chartData[chartData.length - 1].umidita
  };

  // Determina lo stato dell'arnia
  const getHiveStatus = () => {
    const temperaturaMax = parseFloat(hive.temperaturaMax) || 0;
    const umiditaMax = parseFloat(hive.umiditaMax) || 0;

    if (temperaturaMax > 38 || umiditaMax > 75) {
      return { status: 'critica', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-500' };
    } else if (temperaturaMax > 36 || umiditaMax > 70) {
      return { status: 'attenzione', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500' };
    }
    return { status: 'normale', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-500' };
  };

  const statusInfo = getHiveStatus();

  return (
    <div className="min-h-screen bg-[#fef8e8] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-base font-medium text-gray-800 bg-[#e69a4f] rounded-full hover:bg-[#d88a3f] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Pagina precedente</span>
        </button>

        {/* Switch visualizzazione */}
        <div className="flex gap-2 bg-white rounded-full p-1 border-2 border-gray-800">
          <button
            onClick={() => setViewMode('combinato')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'combinato' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Combinato
          </button>
          <button
            onClick={() => setViewMode('diviso')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === 'diviso' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Diviso
          </button>
        </div>
      </div>

      {/* Titolo */}
      <div className="mb-6">
        <h1 className="text-3xl font-medium text-gray-800 mb-2">
          Monitoraggio Arnia {hiveNumber}
        </h1>
        <p className="text-lg text-gray-600">
          Dashboard in tempo reale dei parametri dell'alveare
        </p>
      </div>

      {/* Vista Diviso */}
      {viewMode === 'diviso' && (
        <div className="space-y-6">
          {/* Grafico Peso */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Peso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafico Temperatura */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Temperatura</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="Temperatura (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grafico Umidità */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Umidità</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="umidita" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={false}
                  name="Umidità (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Vista Combinato */}
      {viewMode === 'combinato' && (
        <div className="space-y-6">
          {/* Card valori correnti */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Peso */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Peso</span>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-gray-800">{currentValues.peso}</span>
                <span className="text-sm text-gray-600">kg</span>
              </div>
            </div>

            {/* Temperatura */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Temperatura</span>
                <div className="bg-red-100 p-2 rounded-full">
                  <Thermometer className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-gray-800">{currentValues.temperatura}</span>
                <span className="text-sm text-gray-600">°C</span>
              </div>
            </div>

            {/* Umidità */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Umidità</span>
                <div className="bg-cyan-100 p-2 rounded-full">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-gray-800">{currentValues.umidita}</span>
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          </div>

          {/* Grafico combinato */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Panoramica Completa</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="Peso (kg)"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="Temperatura (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="umidita" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={false}
                  name="Umidità (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiveDetailScreen;