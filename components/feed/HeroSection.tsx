import React from "react";
import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationQuery: string; // Nuevo prop
  setLocationQuery: (query: string) => void; // Nuevo prop
  onSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearch,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 overflow-hidden transition-colors">
      {/* Fondos decorativos sutiles */}
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-orange-100/40 dark:bg-orange-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        <div
          id="search-container"
          className="w-full max-w-3xl mx-auto transform transition-all hover:scale-[1.01]"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-2">
            {/* Input de Servicio */}
            <div className="flex-[2] relative flex items-center">
              <div className="pl-4 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-3 pr-3 py-3 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent text-lg"
                placeholder="¿Qué servicio estás buscando?"
              />
            </div>

            <div className="h-px md:h-8 md:w-px bg-gray-200 dark:bg-gray-800 mx-2 self-center hidden md:block"></div>

            {/* Input de Localidad */}
            <div className="flex-1 relative flex items-center">
              <div className="pl-2 text-orange-600">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-2 pr-3 py-3 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent text-lg"
                placeholder="Localidad"
              />
            </div>

            {/* Botón de Acción */}
            <button
              onClick={onSearch}
              className="bg-gray-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 md:w-auto w-full shadow-lg shadow-orange-500/10"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
