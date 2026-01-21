'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AutocompleteResult } from '@/app/lib/definitions';
import { Loader2 } from 'lucide-react';

interface SearchAutocompleteProps {
  query: string;
  onSelect: (result: AutocompleteResult) => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  query,
  onSelect,
}) => {
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const supabase = createClient();

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('search_autocomplete')
          .select('*')
          .ilike('label', `%${debouncedQuery}%`)
          .limit(15); // Límite razonable

        if (error) throw error;
        setResults((data as AutocompleteResult[]) || []);
      } catch (err) {
        console.error('Error fetching autocomplete:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, supabase]);

  if (debouncedQuery.length < 2 && !loading) return null;
  if (!loading && results.length === 0 && debouncedQuery.length >= 2)
    return null;

  // Grouping results
  const categories = results.filter((r) => r.tipo === 'categoria');
  const services = results.filter((r) => r.tipo === 'servicio');
  const profiles = results.filter((r) => r.tipo === 'perfil');

  return (
    <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin text-orange-600" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 md:grid-cols-3 md:divide-x md:divide-y-0">
          {/* Categorías */}
          <div className="p-2">
            <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Categorías ({categories.length})
            </h3>
            {categories.length > 0 ? (
              <ul className="space-y-1">
                {categories.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item)}
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 dark:text-gray-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2 text-sm italic text-gray-400">
                Sin resultados
              </p>
            )}
          </div>

          {/* Servicios */}
          <div className="p-2">
            <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Servicios ({services.length})
            </h3>
            {services.length > 0 ? (
              <ul className="space-y-1">
                {services.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item)}
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 dark:text-gray-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                    >
                      {item.label}
                      {item.localidad && (
                        <span className="ml-2 text-xs text-gray-400">
                          - {item.localidad}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2 text-sm italic text-gray-400">
                Sin resultados
              </p>
            )}
          </div>

          {/* Perfiles */}
          <div className="p-2">
            <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Personas ({profiles.length})
            </h3>
            {profiles.length > 0 ? (
              <ul className="space-y-1">
                {profiles.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item)}
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 dark:text-gray-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2 text-sm italic text-gray-400">
                Sin resultados
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
