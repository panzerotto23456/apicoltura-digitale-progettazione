import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const AddApiaryScreen = ({ coordinates, onBack, onApiaryCreated, apiKey }) => {
  const [luogo, setLuogo] = useState('');
  const [latitudine, setLatitudine] = useState(coordinates?.lat.toFixed(6) || '');
  const [longitudine, setLongitudine] = useState(coordinates?.lng.toFixed(6) || '');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!luogo.trim() || !nome.trim()) {
      alert('Per favore, compila tutti i campi obbligatori');
      return;
    }

    setLoading(true);

    try {
      // Prepara i dati nel formato richiesto dal database
      const apiaryData = {
        api_luogo: luogo,
        api_lon: parseFloat(longitudine),
        api_lat: parseFloat(latitudine),
        api_nome: nome
      };

      // Invia i dati al database
      const response = await fetch(`${API_BASE_URL}/apiari`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': apiKey
        },
        body: JSON.stringify(apiaryData)
      });

      if (response.ok) {
        const savedApiary = await response.json();
        console.log('Apiario salvato nel database:', savedApiary);
        
        // Aggiungi hives array vuoto per compatibilità con il resto dell'app
        const apiaryWithHives = {
          ...savedApiary,
          hives: [],
          coordinates: {
            lat: savedApiary.api_lat,
            lng: savedApiary.api_lon
          }
        };
        
        onApiaryCreated(apiaryWithHives);
      } else {
        const errorData = await response.json();
        console.error('Errore dal server:', errorData);
        alert('Errore durante il salvataggio dell\'apiario. Riprova.');
      }
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      alert('Errore di connessione. Verifica la tua connessione internet.');
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Campo Latitudine */}
          <input
            type="text"
            placeholder="Latitudine"
            value={latitudine}
            onChange={(e) => setLatitudine(e.target.value)}
            disabled={loading}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Campo Longitudine */}
          <input
            type="text"
            placeholder="Longitudine"
            value={longitudine}
            onChange={(e) => setLongitudine(e.target.value)}
            disabled={loading}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Campo Nome */}
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
            className="w-full px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none bg-white focus:border-[#e69a4f] transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Bottone Aggiungi */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-16 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Salvataggio...' : 'Aggiungi'}
          </button>
        </div>

        {/* Bottone Indietro */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onBack}
            disabled={loading}
            className="text-sm text-gray-600 hover:text-gray-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Torna alla mappa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApiaryScreen;