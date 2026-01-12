import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import { ServiceWithProfile } from '../../app/lib/definitions';

interface ResultsGridProps {
  loading: boolean;
  services: ServiceWithProfile[];
  activeCategoryName: string;
  searchQuery: string;
  onConnect: (service: ServiceWithProfile) => void;
  onViewDetail: (service: ServiceWithProfile) => void;
  onRetry: () => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  loading,
  services,
  activeCategoryName,
  searchQuery,
  onConnect,
  onViewDetail,
  onRetry,
}) => {
  return (
    <div className="mx-auto min-h-[500px] max-w-7xl bg-slate-50/50 px-4 py-12 dark:bg-gray-950/50 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeCategoryName}
          </h2>
          {searchQuery && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Resultados para: "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-3 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ProfessionalCard
              key={service.id}
              service={service}
              onConnect={onConnect}
              onViewDetail={onViewDetail}
            />
          ))}
          {services.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
                No se encontraron resultados.
              </p>
              <button
                onClick={onRetry}
                className="font-bold text-orange-600 hover:underline"
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
