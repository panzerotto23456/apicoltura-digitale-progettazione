import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (apiKey.trim() === '') {
      alert('Per favore, inserisci una API key');
      return;
    }
    
    setLoading(true);

    try {
      // Test della connessione al database con l'API key fornita
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/apiari`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': apiKey
        }
      });

      if (response.ok) {
        console.log('Login effettuato con successo');
        // Salva l'API key per usarla nell'app
        onLogin(apiKey);
      } else if (response.status === 401 || response.status === 403) {
        alert('API key non valida. Riprova.');
        setApiKey('');
      } else {
        alert('Errore di connessione. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      alert('Errore di connessione al database. Verifica la tua connessione internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fef8e8] px-5">
      <div className="flex flex-col items-center w-full max-w-lg">
        <h1 className="text-3xl font-normal text-gray-800 mb-8 text-center">
          Inserisci la tua API key!
        </h1>
        
        <input
          type="password"
          className="w-full max-w-96 px-5 py-4 text-base border-2 border-gray-800 rounded-full outline-none mb-6 bg-white focus:border-[#e69a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Inserisci API key"
          disabled={loading}
        />
        
        <button 
          className="px-16 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0 mb-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifica in corso...' : 'Accedi'}
        </button>
        
        <p className="text-sm text-gray-600 text-center">
          Hai dimenticato la tua API?{' '}
          <a href="#contattaci" className="text-blue-500 no-underline hover:text-blue-700 hover:underline transition-colors">
            Contattaci.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;