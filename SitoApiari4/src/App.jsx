import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  // --- STATO GIOCO SOLARE ---
  const [suns, setSuns] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [sunglasses, setSunglasses] = useState(false);
  const [photosynthesis, setPhotosynthesis] = useState(0);

  // --- STATO API & DATI ---
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- GESTIONE SOLARE ---
  useEffect(() => {
    if (suns >= 10) {
      setIsExploded(true);
      setSunglasses(false);
    }
  }, [suns]);

  const addSun = () => !isExploded && setSuns((prev) => prev + 1);
  
  const chargePhotosynthesis = () => {
    if (isExploded) return;
    setPhotosynthesis((prev) => (prev >= 100 ? 0 : prev + 10));
  };

  const resetUniverse = () => {
    setSuns(0);
    setIsExploded(false);
    setPhotosynthesis(0);
    setSunglasses(false);
    fetchData(); // Ricarica anche i dati
  };

  // --- GESTIONE API (New!) ---
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTA: Sostituisci questo URL con il tuo di restdb.io o vercel
      // Sto usando jsonplaceholder per garantire che funzioni subito senza API KEY
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      // Ritardo artificiale per farti vedere lo Skeleton di caricamento (estetica!)
      setTimeout(() => {
        setUsers(data.slice(0, 5)); // Prendo solo i primi 5 per spazio
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Carica i dati al montaggio del componente
  useEffect(() => {
    fetchData();
  }, []);

  // Determina lo sfondo
  const bgClass = isExploded
    ? "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 animate-pulse"
    : "bg-gradient-to-br from-cyan-400 via-sky-300 to-emerald-200";

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-8 font-sans transition-all duration-700 ${bgClass}`}>
      
      {/* Overlay Occhiali */}
      <div className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-500 ${sunglasses ? 'opacity-60' : 'opacity-0'}`}></div>

      {/* --- SEZIONE 1: SOLAR CONTROL --- */}
      <div className={`relative mb-8 mx-auto max-w-4xl w-full overflow-hidden rounded-3xl border border-white/50 bg-white/30 p-8 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl transition-all ${isExploded ? 'animate-[shake_0.5s_infinite]' : ''}`}>
        
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/40 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex gap-6 mb-6">
            <img src={viteLogo} alt="Vite" className="h-12 drop-shadow-md" />
            <img src={reactLogo} alt="React" className={`h-12 drop-shadow-md ${isExploded ? 'animate-spin' : 'animate-[spin_10s_linear_infinite]'}`} />
          </div>

          <h1 className="mb-2 text-4xl font-extrabold text-white drop-shadow-lg stroke-black">
            {isExploded ? "⚠️ SYSTEM CRITICAL ⚠️" : "Solar Control Center"}
          </h1>

          <div className="grid w-full gap-6 md:grid-cols-2 mt-6">
            {/* Reattore */}
            <div className="rounded-2xl border border-white/40 bg-white/20 p-6 shadow-inner backdrop-blur-sm">
              <h2 className="text-lg font-bold text-slate-700 mb-2">Reattore</h2>
              <div className="mb-4 text-3xl h-12">
                {Array.from({ length: Math.min(suns, 10) }).map((_, i) => (
                  <span key={i} className="inline-block animate-[bounce_1s_infinite]" style={{animationDelay: `${i * 0.1}s`}}>☀️</span>
                ))}
              </div>
              <button 
                onClick={isExploded ? resetUniverse : addSun}
                className={`w-full relative overflow-hidden rounded-xl px-6 py-2 font-bold text-white shadow-md transition-all active:translate-y-1 ${isExploded ? 'bg-gray-800' : 'bg-gradient-to-b from-yellow-300 to-orange-400 hover:brightness-110'}`}
              >
                {isExploded ? "RESET SYSTEM" : "Aggiungi Sole"}
              </button>
            </div>

            {/* Controlli Vari */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/40 bg-white/20 p-3 shadow-inner flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm">Visiera</span>
                <button onClick={() => !isExploded && setSunglasses(!sunglasses)} className="px-3 py-1 text-sm rounded bg-blue-500 text-white shadow font-bold">
                  {sunglasses ? "OFF" : "ON"}
                </button>
              </div>
              
              <div className="rounded-2xl border border-white/40 bg-white/20 p-3 shadow-inner cursor-pointer" onClick={chargePhotosynthesis}>
                <div className="flex justify-between mb-1 text-xs font-bold text-slate-700">
                  <span>Fotosintesi</span>
                  <span>{photosynthesis}%</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full border border-gray-300 shadow-inner overflow-hidden relative">
                  <div style={{ width: `${photosynthesis}%` }} className="h-full bg-gradient-to-r from-lime-400 to-green-600 relative">
                     <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEZIONE 2: INTERGALACTIC DATA UPLINK (API) --- */}
      <div className="relative mx-auto max-w-4xl w-full rounded-3xl border border-white/60 bg-gradient-to-b from-white/40 to-white/20 p-8 shadow-2xl backdrop-blur-md">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 drop-shadow-sm flex items-center gap-2">
            📡 Intergalactic Data Uplink
          </h2>
          <button 
            onClick={fetchData} 
            className="rounded-full bg-white/50 p-2 hover:bg-white/80 transition shadow text-xl"
            title="Ricarica Dati"
          >
            🔄
          </button>
        </div>

        {/* GESTIONE STATI */}
        {error && (
          <div className="rounded-xl border-l-4 border-red-500 bg-red-100/80 p-4 text-red-700 shadow-md mb-4 animate-pulse">
            <strong>Errore di Comunicazione:</strong> {error}
          </div>
        )}

        {isLoading ? (
          // --- SKELETON LOADING (Caricamento Frutiger) ---
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 rounded-xl bg-white/30 p-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-white/50"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/50"></div>
                  <div className="h-3 w-1/2 rounded bg-white/40"></div>
                </div>
              </div>
            ))}
            <div className="mt-4 h-32 rounded-xl bg-white/20"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 1. VISUALIZZAZIONE TABELLA (TABLE) */}
            <div className="overflow-hidden rounded-xl border border-white/40 shadow-lg">
              <table className="min-w-full bg-white/30 text-left text-sm">
                <thead className="bg-white/50 text-slate-700 uppercase tracking-wider font-extrabold backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Astronauta (Name)</th>
                    <th className="px-6 py-3">Frequenza (Email)</th>
                    <th className="px-6 py-3 hidden sm:table-cell">Settore (City)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/40 transition-colors cursor-default group">
                      <td className="px-6 py-4 font-bold text-slate-600">#{user.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 italic">{user.email}</td>
                      <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">{user.address.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. VISUALIZZAZIONE GRAFICO (CHARTS) */}
            <div className="rounded-xl border border-white/40 bg-white/20 p-6 shadow-inner">
              <h3 className="mb-4 text-lg font-bold text-slate-700">📊 Analisi Lunghezza Nomi (Energy Consumption)</h3>
              <div className="flex h-40 items-end justify-between gap-2">
                {users.map((user) => {
                  // Calcolo altezza random basata sulla lunghezza del nome per simulare dati
                  const height = Math.min(user.name.length * 10, 100); 
                  return (
                    <div key={user.id} className="group relative flex h-full w-full flex-col justify-end">
                      <div 
                        style={{ height: `${height}%` }} 
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all hover:brightness-110 relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 right-0 h-2 bg-white/50"></div>
                      </div>
                      <div className="absolute bottom-0 w-full text-center text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mb-5">
                        {user.username}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          25% { transform: translate(-2px, 0px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          75% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(0px, -1px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

export default App;