import React, { useState } from 'react';

const AddHiveScreen = ({ apiary, onBack, onComplete, onViewApiary }) => {
  const [currentHive, setCurrentHive] = useState({
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
  
  const [hives, setHives] = useState([]);

  const handleInputChange = (field, value) => {
    setCurrentHive({
      ...currentHive,
      [field]: value
    });
  };

  const handleAddHive = () => {
    const hasData = Object.values(currentHive).some(val => val.trim() !== '');
    
    if (!hasData) {
      alert('Per favore, compila almeno un campo');
      return;
    }

    const newHive = {
      id: Date.now(),
      ...currentHive,
      createdAt: new Date()
    };

    setHives([...hives, newHive]);
    
    setCurrentHive({
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

    alert('Arnia aggiunta con successo!');
  };

  const handleBackToMap = () => {
    const updatedApiary = {
      ...apiary,
      hives: hives
    };
    onComplete(updatedApiary);
  };

  const handleViewApiary = () => {
    const updatedApiary = {
      ...apiary,
      hives: hives
    };
    onViewApiary(updatedApiary);
  };

  return (
    <div className="min-h-screen bg-[#fef8e8] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-[#e69a4f] rounded-full px-8 py-3 mb-6 text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Crea una nuova arnia!
          </h1>
        </div>

        <h2 className="text-xl font-normal text-gray-800 mb-6 text-center">
          Imposta le soglie dei sensori:
        </h2>

        <div className="text-center mb-4">
          <p className="text-base text-gray-700">
            Arnie create: <span className="font-bold">{hives.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Peso:</h3>
            <input
              type="text"
              placeholder="Soglia max"
              value={currentHive.pesoMax}
              onChange={(e) => handleInputChange('pesoMax', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Soglia min"
              value={currentHive.pesoMin}
              onChange={(e) => handleInputChange('pesoMin', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Timer"
              value={currentHive.pesoTimer}
              onChange={(e) => handleInputChange('pesoTimer', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Umidità:</h3>
            <input
              type="text"
              placeholder="Soglia max"
              value={currentHive.umiditaMax}
              onChange={(e) => handleInputChange('umiditaMax', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Soglia min"
              value={currentHive.umiditaMin}
              onChange={(e) => handleInputChange('umiditaMin', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Timer"
              value={currentHive.umiditaTimer}
              onChange={(e) => handleInputChange('umiditaTimer', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 text-center">Temperatura:</h3>
            <input
              type="text"
              placeholder="Soglia max"
              value={currentHive.temperaturaMax}
              onChange={(e) => handleInputChange('temperaturaMax', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Soglia min"
              value={currentHive.temperaturaMin}
              onChange={(e) => handleInputChange('temperaturaMin', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Timer"
              value={currentHive.temperaturaTimer}
              onChange={(e) => handleInputChange('temperaturaTimer', e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={handleAddHive}
            className="px-16 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0"
          >
            Aggiungi
          </button>

          <button
            onClick={handleBackToMap}
            className="px-8 py-3 text-base font-normal text-gray-800 bg-white border-2 border-gray-800 rounded-full cursor-pointer transition-all hover:bg-gray-50"
          >
            Aggiungi e torna alla mappa
          </button>

          <button
            onClick={handleViewApiary}
            className="px-8 py-3 text-base font-normal text-gray-800 bg-white border-2 border-gray-800 rounded-full cursor-pointer transition-all hover:bg-gray-50"
          >
            Aggiungi e visualizza apiario
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHiveScreen;