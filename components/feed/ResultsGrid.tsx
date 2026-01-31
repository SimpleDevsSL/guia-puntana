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


interface EmptyStateProps {
  searchQuery: string;
  onRetry: () => void;
}


const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-16 text-center dark:border-gray-800 dark:bg-gray-900/50">
    <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
      <svg
        className="h-8 w-8 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {searchQuery
        ? `No encontramos "${searchQuery}"`
        : 'No hay profesionales en esta categoría aún'}
    </h3>

    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
      {searchQuery
        ? 'Intenta con términos más generales o busca por categoría.'
        : '¿Eres un experto en este rubro? Sé el primero en aparecer aquí.'}
    </p>

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onRetry}
        className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700"
      >
        Ver todos los profesionales
      </button>
    </div>
  </div>
);


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
              Resultados para: &quot;{searchQuery}&quot;
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
            // Usamos el componente pasándole las props
            <EmptyState searchQuery={searchQuery} onRetry={onRetry} />
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;
