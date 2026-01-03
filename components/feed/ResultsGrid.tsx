import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import { Professional } from '../../app/lib/definitions';
import { SlidersHorizontal } from 'lucide-react';

interface ResultsGridProps {
  loading: boolean;
  professionals: Professional[];
  activeCategory: string;
  searchQuery: string;
  onConnect: (prof: Professional) => void;
  onRetry: () => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ 
  loading, 
  professionals, 
  activeCategory, 
  searchQuery, 
  onConnect,
  onRetry
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/50 min-h-[500px]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            Expertos en {activeCategory}
          </h2>
          {searchQuery && (
            <p className="text-gray-500 mt-1 text-sm">
              Resultados para: "{searchQuery}"
            </p>
          )}
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
          <SlidersHorizontal size={16} />
          Filtros
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-80 animate-pulse border border-gray-100 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((prof) => (
            <ProfessionalCard 
              key={prof.id} 
              professional={prof} 
              onConnect={onConnect}
            />
          ))}
          {professionals.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-4">No se encontraron profesionales con esos criterios.</p>
              <button 
                onClick={onRetry}
                className="text-brand-orange font-bold hover:underline"
              >
                Ver todos los profesionales
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;