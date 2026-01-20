import { useState } from "react";

function LoginScreen() {
  const [apiKey, setApiKey] = useState("");

  return (
    // CONTENITORE PRINCIPALE: Sfondo Crema (#FEF9E7 è molto simile all'immagine)
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FEF9E7] text-slate-800 font-serif">
      
      {/* AREA CENTRALE (Desktop View) */}
      <div className="w-full max-w-2xl px-8 py-12 flex flex-col items-center text-center">
        
        {/* TITOLO */}
        <h1 className="text-4xl md:text-5xl mb-10 text-[#2d2d2d] tracking-wide">
          Inserisci la tua API key!
        </h1>

        {/* INPUT FIELD */}
        <div className="w-full max-w-lg mb-8 group">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder=""
            className="w-full rounded-full border border-slate-400 bg-white px-8 py-4 text-xl outline-none transition-all duration-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 hover:shadow-md"
          />
        </div>

        {/* BOTTONE ACCEDI */}
        <button className="group relative mb-8 overflow-hidden rounded-full border border-slate-700 bg-[#F4A950] px-16 py-3 text-2xl text-slate-900 transition-transform active:scale-95 hover:brightness-105 hover:shadow-lg">
          <span className="relative z-10">Accedi</span>
          
          {/* Effetto luce sottile sul bottone (opzionale, per renderlo meno piatto) */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        </button>

        {/* FOOTER LINK */}
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

export default LoginScreen;