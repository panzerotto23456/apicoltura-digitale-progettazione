import React, { useState, useEffect, useRef } from 'react';

const MapScreen = ({ onAddApiary, apiaries, onViewApiary }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const apiaryMarkersRef = useRef([]);

  useEffect(() => {
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
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Aggiorna i marker degli apiari quando cambiano
  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      updateApiaryMarkers();
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
    // Rimuovi tutti i marker precedenti degli apiari
    apiaryMarkersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    apiaryMarkersRef.current = [];

    // Aggiungi marker per ogni apiario
    apiaries.forEach(apiary => {
      const numHives = apiary.hives.length;
      const marker = window.L.marker(
        [apiary.coordinates.lat, apiary.coordinates.lng],
        { icon: createCustomIcon(numHives) }
      ).addTo(mapInstanceRef.current);

      // Crea popup con pulsante "Visualizza"
      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.innerHTML = `
        <div>
          <strong style="font-size: 16px;">${apiary.nome}</strong><br/>
          <span style="font-size: 14px;">Luogo: ${apiary.luogo}</span><br/>
          <span style="font-size: 14px;">Arnie: ${numHives}</span><br/>
          <span style="font-size: 12px; color: #666;">
            ${apiary.coordinates.lat.toFixed(4)}, ${apiary.coordinates.lng.toFixed(4)}
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
        onViewApiary(apiary);
      };

      popupContent.appendChild(viewButton);

      marker.bindPopup(popupContent);
      apiaryMarkersRef.current.push(marker);
    });
  };

  const initMap = () => {
    if (mapInstanceRef.current || !mapRef.current) return;

    // Inizializza la mappa
    const map = window.L.map(mapRef.current).setView([41.9028, 12.4964], 6);

    // Aggiungi tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Gestisci click sulla mappa
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedPosition({ lat, lng });

      // Rimuovi marker precedente se esiste
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Aggiungi nuovo marker per la selezione
      markerRef.current = window.L.marker([lat, lng]).addTo(map);
      
      console.log('Coordinate selezionate:', { lat, lng });
    });

    mapInstanceRef.current = map;

    // Aggiungi marker esistenti se ci sono apiari
    if (apiaries.length > 0) {
      updateApiaryMarkers();
    }
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