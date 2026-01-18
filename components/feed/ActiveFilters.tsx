'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  activeCategoryName: string | null;
  searchQuery: string;
  searchLocation: string;
}

export default function ActiveFilters({
  activeCategoryName,
  searchQuery,
  searchLocation,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper para remover un filtro específico
  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/feed?${params.toString()}`);
  };

  const hasFilters =
    (activeCategoryName && activeCategoryName !== 'Todos') ||
    searchQuery ||
    searchLocation;

  if (!hasFilters) return null;

  return (
    <div className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center gap-2 px-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Filtros activos:
      </span>

      {/* Category Chip */}
      {activeCategoryName && activeCategoryName !== 'Todos' && (
        <button
          onClick={() => removeFilter('cat')}
          className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 transition hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300"
        >
          <span>Categoría: {activeCategoryName}</span>
          <X size={14} />
        </button>
      )}

      {/* Search Query Chip */}
      {searchQuery && (
        <button
          onClick={() => removeFilter('q')}
          className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300"
        >
          <span>Búsqueda: {searchQuery}</span>
          <X size={14} />
        </button>
      )}

      {/* Location Chip */}
      {searchLocation && (
        <button
          onClick={() => removeFilter('l')}
          className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
        >
          <span>Ubicación: {searchLocation}</span>
          <X size={14} />
        </button>
      )}

      {(searchQuery ||
        searchLocation ||
        (activeCategoryName && activeCategoryName !== 'Todos')) && (
        <button
          onClick={() => router.push('/feed')}
          className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          Limpiar todos
        </button>
      )}
    </div>
  );
}
