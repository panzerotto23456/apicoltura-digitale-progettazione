export default function HiveDetailScreen({ hive, onBack }) {
  return (
    <div className="min-h-screen w-full bg-[#FEF9E7] font-serif p-8">
      <div className="max-w-4xl mx-auto">
        <h1>{hive.name}</h1>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-white rounded-lg hover:shadow-md">
          ← Torna all'apiario
        </button>
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <p>🌡️ Temperatura: {hive.temperature}°C</p>
          <p>💧 Umidità: {hive.humidity}%</p>
          <p>⚖️ Peso: {hive.weight}kg</p>
        </div>
      </div>
    </div>
  );
}