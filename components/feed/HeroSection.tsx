import React from 'react';
import { Search, MapPin, Trees } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background gradients similar to image bloom but subtle */}
      <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[600px] h-[600px] bg-orange-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        
          

        {/* Search Bar - Integrated but distinct */}
        <div id="search-container" className="w-full max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
          <div className="bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col sm:flex-row gap-2">
            <div className="flex-grow relative flex items-center">
              <div className="pl-4 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-3 pr-3 py-3 border-none rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent text-lg"
                placeholder="¿Qué servicio estás buscando?"
              />
            </div>
            <div className="h-px sm:h-8 sm:w-px bg-gray-200 mx-2 self-center hidden sm:block"></div>
            <div className="flex items-center px-3 text-gray-500 gap-2">
                 <MapPin size={18} className="text-brand-orange" />
                 <span className="whitespace-nowrap text-sm font-medium">San Luis</span>
            </div>
            <button 
              onClick={onSearch}
              className="bg-brand-dark hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 sm:w-auto w-full"
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