import { useState } from "react";

function LoginScreen({ onLogin }) {
  const [apiKey, setApiKey] = useState("");

  const handleLogin = () => {
    if (apiKey === "admin") {
      onLogin();
    } else {
      alert("API key non valida!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FEF9E7] text-slate-800 font-serif">
      <div className="w-full max-w-2xl px-8 py-12 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl mb-10 text-[#2d2d2d] tracking-wide">
          Inserisci la tua API key!
        </h1>

        <div className="w-full max-w-lg mb-8 group">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder=""
            className="w-full rounded-full border border-slate-400 bg-white px-8 py-4 text-xl outline-none transition-all duration-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 hover:shadow-md"
          />
        </div>

        <button 
          onClick={handleLogin}
          className="group relative mb-8 overflow-hidden rounded-full border border-slate-700 bg-[#F4A950] px-16 py-3 text-2xl text-slate-900 transition-transform active:scale-95 hover:brightness-105 hover:shadow-lg"
        >
          <span className="relative z-10">Accedi</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        </button>

        <p className="text-slate-600 text-lg">
          Hai dimenticato la tua API?{" "}
          <a
            href="#"
            className="text-[#6C9AC3] underline decoration-1 underline-offset-4 transition-colors hover:text-[#4a7aab]"
          >
            Contattaci.
          </a>
        </p>
      </div>
    </div>
  );
}

function MapScreen({ onLogout }) {
  const [apiaries, setApiaries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiaryName, setNewApiaryName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Inizializza la mappa quando il componente viene montato
  useState(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.async = true;
    script.onload = () => initMap();
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);
  }, []);

  const initMap = () => {
    if (typeof window.L === 'undefined') return;
    
    setTimeout(() => {
      const map = window.L.map('map').setView([45.4642, 9.1900], 13);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      map.on('click', (e) => {
        if (showAddForm) {
          setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });

      setMapInstance(map);
    }, 100);
  };

  // Aggiungi marker quando cambiano gli apiari
  useState(() => {
    if (!mapInstance || typeof window.L === 'undefined') return;

    // Rimuovi tutti i marker esistenti
    mapInstance.eachLayer((layer) => {
      if (layer instanceof window.L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Aggiungi i marker degli apiari
    apiaries.forEach((apiary) => {
      const customIcon = window.L.divIcon({
        html: `<div style="background-color: #F4A950; width: 30px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #2d2d2d; position: relative;">
                 <div style="background-color: white; width: 12px; height: 12px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
               </div>`,
        className: 'custom-marker',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
      });

      const marker = window.L.marker([apiary.location.lat, apiary.location.lng], {
        icon: customIcon
      }).addTo(mapInstance);

      marker.bindPopup(`<strong>${apiary.name}</strong>`);
    });

    // Marker temporaneo per la selezione
    if (showAddForm && selectedLocation) {
      const tempIcon = window.L.divIcon({
        html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: 'temp-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      window.L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: tempIcon
      }).addTo(mapInstance);
    }
  }, [apiaries, selectedLocation, showAddForm, mapInstance]);

  const addApiary = () => {
    if (newApiaryName && selectedLocation) {
      setApiaries([
        ...apiaries,
        {
          id: Date.now(),
          name: newApiaryName,
          location: selectedLocation
        }
      ]);
      setNewApiaryName("");
      setSelectedLocation(null);
      setShowAddForm(false);
    } else {
      alert("Inserisci un nome e clicca sulla mappa per selezionare la posizione!");
    }
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewApiaryName("");
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#FEF9E7] font-serif p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header con titolo e bottone logout */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl text-[#2d2d2d] tracking-wide">I tuoi Apiari</h1>
          <button
            onClick={onLogout}
            className="rounded-full border border-slate-400 bg-white px-6 py-2 text-lg text-slate-700 transition-all hover:bg-slate-50 active:scale-95 hover:shadow-md"
          >
            ← Torna al login
          </button>
        </div>

        {/* Mappa container */}
        <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-slate-700 overflow-hidden mb-6">
          <div id="map" style={{ height: '500px', width: '100%' }}></div>

          {/* Form aggiunta apiario sovrapposto */}
          {showAddForm && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
              <div className="bg-[#FEF9E7] rounded-3xl shadow-2xl border-2 border-slate-700 p-6">
                <h2 className="text-2xl mb-4 text-[#2d2d2d] text-center">Nuovo Apiario</h2>
                
                <input
                  type="text"
                  value={newApiaryName}
                  onChange={(e) => setNewApiaryName(e.target.value)}
                  placeholder="Nome apiario..."
                  className="w-full rounded-full border border-slate-400 bg-white px-6 py-3 mb-4 text-lg outline-none transition-all duration-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50"
                />

                {selectedLocation ? (
                  <p className="text-green-600 mb-4 text-center">📍 Posizione selezionata!</p>
                ) : (
                  <p className="text-slate-600 mb-4 text-center text-sm">Clicca sulla mappa per selezionare la posizione</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={cancelAdd}
                    className="flex-1 rounded-full border border-slate-400 bg-white px-6 py-2 text-lg text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={addApiary}
                    className="flex-1 group relative overflow-hidden rounded-full border border-slate-700 bg-[#F4A950] px-6 py-2 text-lg text-slate-900 transition-transform active:scale-95 hover:brightness-105"
                  >
                    <span className="relative z-10">Conferma</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contatore apiari */}
          {apiaries.length > 0 && (
            <div className="absolute top-4 right-4 bg-white/95 rounded-full px-5 py-2 shadow-lg border border-slate-300 z-[999]">
              <p className="text-slate-700 font-medium text-sm">
                🍯 {apiaries.length} {apiaries.length === 1 ? 'Apiario' : 'Apiari'}
              </p>
            </div>
          )}
        </div>

        {/* Bottone Aggiungi Apiario sotto la mappa */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm}
            className="group relative overflow-hidden rounded-full border border-slate-700 bg-[#F4A950] px-12 py-3 text-xl text-slate-900 transition-transform active:scale-95 hover:brightness-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">Aggiungi apiario</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <MapScreen onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  );
}