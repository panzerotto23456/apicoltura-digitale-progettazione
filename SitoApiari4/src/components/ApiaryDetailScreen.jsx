import React from 'react';
import { Scale, Droplets, Thermometer, AlertTriangle, ArrowLeft, Settings } from 'lucide-react';

const ApiaryDetailScreen = ({ apiary, onBack, onViewHive, onEditHiveThresholds }) => {
  // Calcola le medie usando i valori CORRENTI delle rilevazioni
  const calculateAverages = () => {
    if (!apiary.hives || apiary.hives.length === 0) {
      return { peso: 0, umidita: 0, temperatura: 0 };
    }

    let totalPeso = 0;
    let totalUmidita = 0;
    let totalTemp = 0;
    let countPeso = 0;
    let countUmidita = 0;
    let countTemp = 0;

    apiary.hives.forEach(hive => {
      if (hive.pesoCurrent != null) {
        totalPeso += parseFloat(hive.pesoCurrent);
        countPeso++;
      }
      if (hive.umiditaCurrent != null) {
        totalUmidita += parseFloat(hive.umiditaCurrent);
        countUmidita++;
      }
      if (hive.temperaturaCurrent != null) {
        totalTemp += parseFloat(hive.temperaturaCurrent);
        countTemp++;
      }
    });

    return {
      peso: countPeso > 0 ? (totalPeso / countPeso).toFixed(1) : '0.0',
      umidita: countUmidita > 0 ? (totalUmidita / countUmidita).toFixed(1) : '0.0',
      temperatura: countTemp > 0 ? (totalTemp / countTemp).toFixed(1) : '0.0'
    };
  };

  // Determina lo stato dell'arnia in base alle soglie e ai valori correnti
  const getHiveStatus = (hive) => {
    const peso = parseFloat(hive.pesoCurrent) || 0;
    const temp = parseFloat(hive.temperaturaCurrent) || 0;
    const umid = parseFloat(hive.umiditaCurrent) || 0;

    const pesoMax = parseFloat(hive.pesoMax) || Infinity;
    const pesoMin = parseFloat(hive.pesoMin) || 0;
    const tempMax = parseFloat(hive.temperaturaMax) || Infinity;
    const tempMin = parseFloat(hive.temperaturaMin) || 0;
    const umidMax = parseFloat(hive.umiditaMax) || Infinity;
    const umidMin = parseFloat(hive.umiditaMin) || 0;

    // Stato CRITICO: fuori dalle soglie massime/minime
    if (temp > tempMax || temp < tempMin || 
        umid > umidMax || umid < umidMin || 
        peso > pesoMax || peso < pesoMin) {
      return 'critica';
    }

    // Stato ATTENZIONE: vicino alle soglie (90% della soglia max o 110% della soglia min)
    const tempThresholdMax = tempMax * 0.9;
    const tempThresholdMin = tempMin * 1.1;
    const umidThresholdMax = umidMax * 0.9;
    const umidThresholdMin = umidMin * 1.1;
    const pesoThresholdMax = pesoMax * 0.9;
    
    if (temp > tempThresholdMax || temp < tempThresholdMin ||
        umid > umidThresholdMax || umid < umidThresholdMin ||
        peso > pesoThresholdMax) {
      return 'attenzione';
    }

    return 'normale';
  };

  const averages = calculateAverages();

  return (
    <div className="min-h-screen bg-[#fef8e8] px-6 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-base font-medium text-gray-800 bg-[#e69a4f] rounded-full hover:bg-[#d88a3f] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Torna alla Lista Apiari</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Apiario {apiary.nome}</h1>
      <p className="text-lg text-gray-600 mb-8">Totale arnie: {apiary.hives.length}</p>

      {/* Card medie generali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef3e0] p-3 rounded-full">
              <Scale className="w-6 h-6 text-[#e69a4f]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Peso Medio</p>
              <p className="text-2xl font-semibold text-gray-800">{averages.peso} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-[#e0f2fe] p-3 rounded-full">
              <Droplets className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Umidità Media</p>
              <p className="text-2xl font-semibold text-gray-800">{averages.umidita}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-[#fee2e2] p-3 rounded-full">
              <Thermometer className="w-6 h-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Temperatura Media</p>
              <p className="text-2xl font-semibold text-gray-800">{averages.temperatura}°C</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Arnie</h2>

      {/* Griglia arnie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apiary.hives.map((hive, index) => {
          const status = getHiveStatus(hive);
          
          const borderColor = 
            status === 'critica' ? 'border-red-500' :
            status === 'attenzione' ? 'border-yellow-500' :
            'border-green-500';

          const bgColor = 
            status === 'critica' ? 'bg-red-50' :
            status === 'attenzione' ? 'bg-yellow-50' :
            'bg-green-50';

          return (
            <div
              key={hive.id}
              className={`${bgColor} rounded-2xl p-4 border-2 ${borderColor} hover:shadow-lg transition-all relative group`}
            >
              {/* Intestazione con titolo e icona modifica */}
              <div className="flex items-center justify-between mb-3">
                <h3 
                  onClick={() => onViewHive(hive, index + 1, apiary.nome)}
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-[#e69a4f]"
                >
                  Arnia {index + 1}
                </h3>
                <div className="flex items-center gap-2">
                  {status !== 'normale' && (
                    <AlertTriangle 
                      className={`w-5 h-5 ${status === 'critica' ? 'text-red-500' : 'text-yellow-500'}`}
                    />
                  )}
                  <button
                    onClick={() => onEditHiveThresholds(hive, index + 1, apiary.nome)}
                    className="p-1.5 rounded-full bg-white border border-gray-300 hover:bg-[#e69a4f] hover:border-[#e69a4f] transition-colors"
                    title="Modifica soglie"
                  >
                    <Settings className="w-4 h-4 text-gray-600 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#e69a4f]" />
                    <span className="text-gray-700">Peso:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {hive.pesoCurrent ? parseFloat(hive.pesoCurrent).toFixed(1) : 'N/A'} kg
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#0ea5e9]" />
                    <span className="text-gray-700">Umidità:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {hive.umiditaCurrent ? parseFloat(hive.umiditaCurrent).toFixed(1) : 'N/A'}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#ef4444]" />
                    <span className="text-gray-700">Temp:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {hive.temperaturaCurrent ? parseFloat(hive.temperaturaCurrent).toFixed(1) : 'N/A'}°C
                  </span>
                </div>
              </div>

              {status !== 'normale' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    status === 'critica' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {status === 'critica' ? '⚠️ Critica' : '⚠ Attenzione'}
                  </span>
                </div>
              )}

              {hive.lastUpdate && (
                <div className="mt-2 text-xs text-gray-500">
                  Agg: {new Date(hive.lastUpdate).toLocaleString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {apiary.hives.length === 0 && (
        <div className="text-center py-12">
          <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nessuna arnia presente in questo apiario</p>
        </div>
      )}
    </div>
  );
};

export default ApiaryDetailScreen;