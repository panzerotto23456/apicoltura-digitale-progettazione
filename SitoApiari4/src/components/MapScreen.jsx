import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/config';

const MapScreen = ({ onAddApiary, apiaries, onViewApiary, apiKey, loadingApiaries }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const apiaryMarkersRef = useRef([]);

  console.log('=== RENDER MAPSCREEN ===');
  console.log('Numero apiari ricevuti:', apiaries ? apiaries.length : 0);
  console.log('Apiari:', apiaries);
  console.log('Loading:', loadingApiaries);

  useEffect(() => {
    console.log('useEffect - Caricamento Leaflet');
    // Carica Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Carica Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log('Leaflet caricato!');
        initMap();
      };
      document.body.appendChild(script);
    } else {
      console.log('Leaflet già disponibile');
      initMap();
    }

    return () => {
      console.log('Cleanup mappa');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Aggiorna i marker degli apiari quando cambiano
  useEffect(() => {
    console.log('useEffect - Aggiornamento marker');
    console.log('mapInstanceRef.current:', mapInstanceRef.current);
    console.log('window.L:', window.L);
    console.log('apiaries.length:', apiaries.length);
    
    if (mapInstanceRef.current && window.L) {
      if (apiaries && apiaries.length > 0) {
        console.log('Chiamata updateApiaryMarkers');
        updateApiaryMarkers();
      } else {
        console.log('Nessun apiario da visualizzare');
      }
    } else {
      console.log('Mappa o Leaflet non ancora pronti');
    }
  }, [apiaries]);

  const createCustomIcon = (numHives) => {
    return window.L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: #e69a4f;
          border: 3px solid #333;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          color: #333;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${numHives}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  const updateApiaryMarkers = () => {
    console.log('=== UPDATE APIARY MARKERS ===');
    
    if (!mapInstanceRef.current) {
      console.error('Mappa non inizializzata!');
      return;
    }

    // Rimuovi tutti i marker precedenti degli apiari
    console.log('Rimozione marker precedenti:', apiaryMarkersRef.current.length);
    apiaryMarkersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    apiaryMarkersRef.current = [];

    // Aggiungi marker per ogni apiario
    console.log('Numero apiari da processare:', apiaries.length);
    
    apiaries.forEach((apiary, index) => {
      console.log(`\n--- Apiario ${index + 1} ---`);
      console.log('Dati completi:', apiary);
      
      const numHives = apiary.hives ? apiary.hives.length : 0;
      console.log('Numero arnie:', numHives);
      
      // Gestisce sia il formato del database che quello locale
      let lat, lng;
      
      // PROVA TUTTE LE COMBINAZIONI POSSIBILI
      if (apiary.api_lat !== undefined && apiary.api_lon !== undefined) {
        console.log('Usando campi api_lat e api_lon dal DB');
        console.log('api_lat:', apiary.api_lat);
        console.log('api_lon:', apiary.api_lon);
        
        // Prova prima la combinazione corretta
        lat = apiary.api_lat;
        lng = apiary.api_lon;
        
        // Se i valori sembrano invertiti (lat > 90 o < -90), invertili
        if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
          console.log('Coordinate sembrano invertite, inversione...');
          [lat, lng] = [lng, lat];
        }
      } else if (apiary.coordinates) {
        console.log('Usando campo coordinates');
        lat = apiary.coordinates.lat;
        lng = apiary.coordinates.lng;
      } else {
        console.warn('NESSUNA COORDINATA TROVATA per apiario:', apiary);
        return;
      }
      
      console.log('Coordinate finali - Lat:', lat, 'Lng:', lng);

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.error('COORDINATE NON VALIDE!');
        console.error('Lat:', lat, 'tipo:', typeof lat);
        console.error('Lng:', lng, 'tipo:', typeof lng);
        return;
      }

      // Converti in numeri
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      console.log('Creazione marker a:', latNum, lngNum);

      try {
        const marker = window.L.marker(
          [latNum, lngNum],
          { icon: createCustomIcon(numHives) }
        ).addTo(mapInstanceRef.current);

        console.log('Marker creato con successo!');

        // Crea popup con pulsante "Visualizza"
        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'sans-serif';
        popupContent.innerHTML = `
          <div>
            <strong style="font-size: 16px;">${apiary.api_nome || apiary.nome || 'Senza nome'}</strong><br/>
            <span style="font-size: 14px;">Luogo: ${apiary.api_luogo || apiary.luogo || 'N/A'}</span><br/>
            <span style="font-size: 14px;">Arnie: ${numHives}</span><br/>
            <span style="font-size: 12px; color: #666;">
              ${latNum.toFixed(4)}, ${lngNum.toFixed(4)}
            </span>
          </div>
        `;

        // Aggiungi pulsante "Visualizza"
        const viewButton = document.createElement('button');
        viewButton.textContent = 'Visualizza';
        viewButton.style.cssText = `
          margin-top: 10px;
          width: 100%;
          padding: 8px 16px;
          background-color: #e69a4f;
          color: #333;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        `;
        
        viewButton.onmouseover = () => {
          viewButton.style.backgroundColor = '#d88a3f';
        };
        viewButton.onmouseout = () => {
          viewButton.style.backgroundColor = '#e69a4f';
        };
        
        viewButton.onclick = () => {
          console.log('Click su Visualizza per apiario:', apiary);
          onViewApiary(apiary);
        };

        popupContent.appendChild(viewButton);
        marker.bindPopup(popupContent);
        apiaryMarkersRef.current.push(marker);
        
        console.log('Marker aggiunto all\'array, totale:', apiaryMarkersRef.current.length);
      } catch (error) {
        console.error('ERRORE nella creazione del marker:', error);
      }
    });

    console.log('=== FINE UPDATE MARKERS ===');
    console.log('Totale marker creati:', apiaryMarkersRef.current.length);
  };

  const initMap = () => {
    console.log('=== INIT MAP ===');
    
    if (mapInstanceRef.current) {
      console.log('Mappa già inizializzata');
      return;
    }
    
    if (!mapRef.current) {
      console.error('mapRef.current non disponibile!');
      return;
    }

    console.log('Creazione mappa...');

    try {
      // Inizializza la mappa
      const map = window.L.map(mapRef.current).setView([41.9028, 12.4964], 6);
      console.log('Mappa creata:', map);

      // Aggiungi tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      console.log('Tile layer aggiunto');

      // Gestisci click sulla mappa
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        console.log('Click sulla mappa:', lat, lng);
        setSelectedPosition({ lat, lng });

        // Rimuovi marker precedente se esiste
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Aggiungi nuovo marker per la selezione
        markerRef.current = window.L.marker([lat, lng]).addTo(map);
      });

      mapInstanceRef.current = map;
      console.log('Mappa salvata in ref');

      // Aggiungi marker esistenti se ci sono apiari
      if (apiaries && apiaries.length > 0) {
        console.log('Ci sono apiari da visualizzare, chiamata updateApiaryMarkers');
        setTimeout(() => updateApiaryMarkers(), 500);
      }
    } catch (error) {
      console.error('ERRORE durante inizializzazione mappa:', error);
    }

    console.log('=== FINE INIT MAP ===');
  };

  const handleAddApiaryClick = () => {
    if (selectedPosition) {
      onAddApiary(selectedPosition);
    } else {
      alert('Per favore, seleziona prima un punto sulla mappa');
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Mappa */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ height: '100vh', width: '100%' }}
      />

      {/* Indicatore di caricamento */}
      {loadingApiaries && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-[1000]">
          <p className="text-gray-800 font-medium">Caricamento apiari in corso...</p>
        </div>
      )}

      {/* Info numero apiari caricati */}
      {!loadingApiaries && apiaries && apiaries.length > 0 && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[1000]">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{apiaries.length}</span> {apiaries.length === 1 ? 'apiario' : 'apiari'} caricati
          </p>
        </div>
      )}

      {/* Debug info */}
      <div className="absolute top-4 right-4 bg-yellow-100 px-4 py-2 rounded-lg shadow-md z-[1000] text-xs">
        <p>Apiari: {apiaries ? apiaries.length : 0}</p>
        <p>Marker: {apiaryMarkersRef.current.length}</p>
        <p>Loading: {loadingApiaries ? 'SI' : 'NO'}</p>
      </div>

      {/* Bottone "Aggiungi apiario" */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#fef8e8] py-6 flex justify-center z-[1000]">
        <button
          onClick={handleAddApiaryClick}
          className="px-12 py-3 text-lg font-medium text-gray-800 bg-[#e69a4f] rounded-full cursor-pointer transition-all hover:bg-[#d88a3f] hover:-translate-y-0.5 active:translate-y-0"
        >
          Aggiungi apiario
        </button>
      </div>
    </div>
  );
};

export default MapScreen;