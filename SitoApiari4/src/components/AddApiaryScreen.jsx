import React, { useState } from 'react';

const AddApiaryScreen = ({ coordinates, onBack, onApiaryCreated }) => {
  const [luogo, setLuogo] = useState('');
  const [latitudine, setLatitudine] = useState(coordinates?.lat.toFixed(6) || '');
  const [longitudine, setLongitudine] = useState(coordinates?.lng.toFixed(6) || '');
  const [nome, setNome] = useState('');

  const handleSubmit = () => {
    if (!luogo.trim() || !nome.trim()) {
      alert('Per favore, compila tutti i campi obbligatori');
      return;
    }

    const apiaryData = {
      luogo,
      latitudine,
      longitudine,
      nome,
      coordinates: {
        lat: parseFloat(latitudine),
        lng: parseFloat(longitudine)
      }
    };

    console.log('Apiario creato:', apiaryData);
    onApiaryCreated(apiaryData);
  };

  return (
    <div className="min-h-screen bg-[#fef8e8] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-lg">
        {/* Titolo principale */}
        <div className="bg-[#e69a4f] rounded-full px-8 py-3 mb-6 text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Crea un nuovo apiario!
          </h1>
        </div>

        {/* Sottotitolo */}
        <h2 className="text-xl font-normal text-gray-800 mb-6 text-center">
          Imposta nome e luogo:
        </h2>

        {/* Form */}
        <div className="space-y-4 mb-8">
          {/* Campo Luogo */}
          <input
            type="text"
            placeholder="Luogo"
            value={luogo}
            onChange={(e) => setLuogo(e.target.value)}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
          />

          {/* Campo Latitudine */}
          <input
            type="text"
            placeholder="Latitudine"
            value={latitudine}
            onChange={(e) => setLatitudine(e.target.value)}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
          />

          {/* Campo Longitudine */}
          <input
            type="text"
            placeholder="Longitudine"
            value={longitudine}
            onChange={(e) => setLongitudine(e.target.value)}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
          />

          {/* Campo Nome */}
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400"
          />
        </div>

        {/* Bottone Aggiungi */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-16 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0"
          >
            Aggiungi
          </button>
        </div>

        {/* Bottone Indietro */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Torna alla mappa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApiaryScreen;