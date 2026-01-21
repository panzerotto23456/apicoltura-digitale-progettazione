import React from 'react';
import { Scale, Droplets, Thermometer, AlertTriangle } from 'lucide-react';

const ApiaryDetailScreen = ({ apiary, onBack }) => {
  // Calcola le medie per i sensori
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
      // Peso medio
      if (hive.pesoMax && hive.pesoMin) {
        const pesoMax = parseFloat(hive.pesoMax);
        const pesoMin = parseFloat(hive.pesoMin);
        if (!isNaN(pesoMax) && !isNaN(pesoMin)) {
          totalPeso += (pesoMax + pesoMin) / 2;
          countPeso++;
        }
      }

      // Umidità media
      if (hive.umiditaMax && hive.umiditaMin) {
        const umiditaMax = parseFloat(hive.umiditaMax);
        const umiditaMin = parseFloat(hive.umiditaMin);
        if (!isNaN(umiditaMax) && !isNaN(umiditaMin)) {
          totalUmidita += (umiditaMax + umiditaMin) / 2;
          countUmidita++;
        }
      }

      // Temperatura media
      if (hive.temperaturaMax && hive.temperaturaMin) {
        const tempMax = parseFloat(hive.temperaturaMax);
        const tempMin = parseFloat(hive.temperaturaMin);
        if (!isNaN(tempMax) && !isNaN(tempMin)) {
          totalTemp += (tempMax + tempMin) / 2;
          countTemp++;
        }
      }
    });

    return {
      peso: countPeso > 0 ? (totalPeso / countPeso).toFixed(1) : 0,
      umidita: countUmidita > 0 ? (totalUmidita / countUmidita).toFixed(1) : 0,
      temperatura: countTemp > 0 ? (totalTemp / countTemp).toFixed(1) : 0
    };
  };

  // Determina lo stato dell'arnia (normale, attenzione, critica)
  const getHiveStatus = (hive) => {
    // Logica semplificata: se i valori superano certe soglie, mostro attenzione o critico
    const pesoMax = parseFloat(hive.pesoMax) || 0;
    const umiditaMax = parseFloat(hive.umiditaMax) || 0;
    const temperaturaMax = parseFloat(hive.temperaturaMax) || 0;

    // Esempio: temperatura > 38 è critico, > 36 è attenzione
    if (temperaturaMax > 38 || umiditaMax > 75) {
      return 'critica';
    } else if (temperaturaMax > 36 || umiditaMax > 70 || pesoMax > 50) {
      return 'attenzione';
    }
    return 'normale';
  };

  const averages = calculateAverages();

  // Genera valori simulati per ogni arnia (per mostrare dati realistici)
  const getHiveData = (hive, index) => {
    const baseWeight = 44 + (index % 5);
    const baseHumidity = 55 + (index % 30);
    const baseTemp = 33 + (index % 8);

    return {
      peso: hive.pesoMax && hive.pesoMin 
        ? ((parseFloat(hive.pesoMax) + parseFloat(hive.pesoMin)) / 2).toFixed(1)
        : baseWeight.toFixed(1),
      umidita: hive.umiditaMax && hive.umiditaMin
        ? ((parseFloat(hive.umiditaMax) + parseFloat(hive.umiditaMin)) / 2).toFixed(0)
        : baseHumidity,
      temperatura: hive.temperaturaMax && hive.temperaturaMin
        ? ((parseFloat(hive.temperaturaMax) + parseFloat(hive.temperaturaMin)) / 2).toFixed(1)
        : baseTemp.toFixed(1)
    };
  };

  return (
    <div className="min-h-screen bg-[#fef8e8] px-6 py-8">
      {/* Header con bottone indietro */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-base font-medium text-gray-800 bg-[#e69a4f] rounded-full hover:bg-[#d88a3f] transition-colors"
        >
          <span>←</span>
          <span>Torna alla Lista Apiari</span>
        </button>
      </div>

      {/* Titolo apiario */}
      <h1 className="text-3xl font-medium text-gray-800 mb-2">
        Apiario {apiary.nome}
      </h1>
      <p className="text-lg text-[#e69a4f] mb-8">
        Totale arnie: {apiary.hives.length}
      </p>

      {/* Card medie generali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Peso Medio */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 flex items-center gap-4">
          <div className="bg-[#fef3e0] p-3 rounded-full">
            <Scale className="w-6 h-6 text-[#e69a4f]" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Peso Medio</p>
            <p className="text-2xl font-medium text-gray-800">{averages.peso} kg</p>
          </div>
        </div>

        {/* Umidità Media */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 flex items-center gap-4">
          <div className="bg-[#e0f2fe] p-3 rounded-full">
            <Droplets className="w-6 h-6 text-[#0ea5e9]" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Umidità Media</p>
            <p className="text-2xl font-medium text-gray-800">{averages.umidita}%</p>
          </div>
        </div>

        {/* Temperatura Media */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 flex items-center gap-4">
          <div className="bg-[#fee2e2] p-3 rounded-full">
            <Thermometer className="w-6 h-6 text-[#ef4444]" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Temperatura Media</p>
            <p className="text-2xl font-medium text-gray-800">{averages.temperatura}°C</p>
          </div>
        </div>
      </div>

      {/* Sezione Arnie */}
      <h2 className="text-2xl font-medium text-gray-800 mb-4">Arnie</h2>

      {/* Griglia arnie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apiary.hives.map((hive, index) => {
          const status = getHiveStatus(hive);
          const data = getHiveData(hive, index);
          
          const borderColor = 
            status === 'critica' ? 'border-red-500' :
            status === 'attenzione' ? 'border-yellow-500' :
            'border-gray-200';

          const bgColor = 
            status === 'critica' ? 'bg-red-50' :
            status === 'attenzione' ? 'bg-yellow-50' :
            'bg-white';

          return (
            <div
              key={hive.id}
              className={`${bgColor} rounded-2xl p-4 border-2 ${borderColor} transition-all hover:shadow-lg`}
            >
              {/* Header arnia */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Arnia {index + 1}
                </h3>
                {status !== 'normale' && (
                  <AlertTriangle 
                    className={`w-5 h-5 ${status === 'critica' ? 'text-red-500' : 'text-yellow-500'}`}
                  />
                )}
              </div>

              {/* Dati sensori */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Scale className="w-4 h-4 text-[#e69a4f]" />
                  <span className="text-gray-700">{data.peso} kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="w-4 h-4 text-[#0ea5e9]" />
                  <span className="text-gray-700">{data.umidita}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-gray-700">{data.temperatura}°C</span>
                </div>
              </div>

              {/* Badge stato */}
              {status !== 'normale' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    status === 'critica' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {status === 'critica' ? 'Critica' : 'Attenzione'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Messaggio se non ci sono arnie */}
      {apiary.hives.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nessuna arnia presente in questo apiario</p>
        </div>
      )}
    </div>
  );
};

export default ApiaryDetailScreen;