import React from "react";
import ProfessionalCard from "./ProfessionalCard";
import { ServiceWithProfile } from "../../app/lib/definitions";

interface ResultsGridProps {
  loading: boolean;
  services: ServiceWithProfile[];
  activeCategoryName: string;
  searchQuery: string;
  onConnect: (service: ServiceWithProfile) => void;
  onRetry: () => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  loading,
  services,
  activeCategoryName,
  searchQuery,
  onConnect,
  onRetry,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/50 dark:bg-gray-950/50 min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeCategoryName}
          </h2>
          {searchQuery && (
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Resultados para: "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 h-80 animate-pulse border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ProfessionalCard
              key={service.id}
              service={service}
              onConnect={onConnect}
            />
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No se encontraron resultados.
              </p>
              <button
                onClick={onRetry}
                className="text-orange-600 font-bold hover:underline"
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
