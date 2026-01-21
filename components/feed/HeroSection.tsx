'use client';
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocalidadAutocomplete } from '@/components/ui/LocalidadAutocomplete';
import { SearchAutocomplete } from './SearchAutocomplete';
import { AutocompleteResult } from '@/app/lib/definitions';

import { CATEGORIES } from './CategoryList';

interface HeroSectionProps {
  initialQuery: string;
  initialLocation: string;
  basePath?: string; // Prop para definir la ruta base
}

const HeroSection: React.FC<HeroSectionProps> = ({
  initialQuery,
  initialLocation,
  basePath = '/feed', // Por defecto va al feed
}) => {
  const [q, setQ] = useState(initialQuery);
  const [l, setL] = useState(initialLocation);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query = q.trim();

    // Lógica para detectar si es categoría
    let categoryMatch = null;
    if (query) {
        // Buscamos exact match o case insensitive
        categoryMatch = CATEGORIES.find(cat => cat.toLowerCase() === query.toLowerCase());
    }

    if (categoryMatch) {
       // Si coincide con categoría, seteamos 'cat' y borramos 'q'
       // (Para que funcione como los botones antiguos de filtros)
       params.set('cat', categoryMatch);
       params.delete('q');
    } else {
       // Si no es categoría, búsqueda normal
        if (query) params.set('q', query);
        else params.delete('q');
        
        // Si teníamos 'cat' seteado de antes, podría interferir. 
        // Si el usuario escribe algo nuevo, asumimos que quiere buscar eso.
        // Pero si quiere buscar "Plomero" dentro de la categoría "Oficios"?
        // El requerimiento dice: "Si coincide con alguna opcion de esta categoria, entonces debes armar la consulta... tal cual como se hacia antes con los botones".
        // Antes los botones seteaban 'cat'.
        // Aquí asumimos que si el usuario escribe UNA CATEGORIA EXACTA, quiere navegar a esa categoría.
        // Si escribe algo arbitrario, es búsqueda de texto.
        // Limpiamos 'cat' si es búsqueda de texto para evitar confusión?
        // Si el usuario escribe "Juan", y venía de ver "Plomería", ¿quiere buscar Juan en Plomería o Juan en general?
        // Generalmente el input principal es "global" a menos que haya un selector de categoría explícito.
        // Al escribir en el main search, reseteamos categoría a menos que el input SEA la categoría.
        if (!categoryMatch) {
             params.delete('cat');
        }
    }

    if (l.trim()) params.set('l', l);
    else params.delete('l');

    // Usamos el basePath dinámico
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
      setIsFocused(false);
    }
  };

  const handleAutocompleteSelect = (result: AutocompleteResult) => {
    setQ(result.label);
    
    // Si es categoría, SOLO llenamos el input, no navegamos aún.
    if (result.tipo === 'categoria') {
       // Mantenemos el foco o lo cerramos? 
       // El usuario dijo: "se debe cargar la categoria en la barra para luego recien realizar la busqueda cuando se toque en el boton de Buscar"
       // Por lo tanto, actualizamos Q y listo. Quizás cerrar el autocomplete?
       setIsFocused(false); 
    } else {
        // En otros casos, navegamos automáticamente
        const params = new URLSearchParams();
        params.set('q', result.label);
        if (l.trim()) params.set('l', l);
        
        router.push(`${basePath}?${params.toString()}`);
        setIsFocused(false);
    }
  };
  
  // Handler para cuando se hace click en un item del autocomplete
  // Necesitamos que el onBlur del input no esconda el menu antes de que se procese el click
  // Una forma común es usar onMouseDown en el item (que dispara antes que blur).
  // Pero SearchAutocomplete maneja sus propios clicks.
  // Podemos controlar la visibilidad aquí.

  return (
    <div className="relative bg-white px-4 pb-16 pt-12 dark:bg-gray-950">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <div className="relative flex w-full max-w-3xl flex-col gap-2 rounded-2xl border bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:flex-row">
          <div className="flex flex-[2] items-center">
            <Search className="ml-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              // Delay blur to allow click to register if we rely on onClick. 
              // Better rely on onMouseDown or a wrapper.
              onBlur={() => {
                 // Small timeout to allow click events to propagate
                 setTimeout(() => setIsFocused(false), 200);
              }}
              className="w-full bg-transparent p-3 focus:outline-none dark:text-white"
              placeholder="¿Qué estás buscando?"
            />
          </div>
          <div className="flex flex-1 items-center">
            <MapPin className="ml-2 text-orange-600" size={20} />
            <div className="w-full">
              <LocalidadAutocomplete
                value={l}
                onChange={(value) => setL(value)}
                placeholder="Localidad"
                transparent={true}
                className="!rounded-none !border-0 !p-3 !shadow-none"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="rounded-xl bg-orange-600 px-8 py-3 font-bold text-white transition hover:bg-orange-700"
          >
            Buscar
          </button>
          
          {/* Autocomplete Dropdown */}
          {isFocused && (
            <div 
              className="absolute left-0 top-full z-50 w-full"
              onMouseDown={(e) => {
                // Prevent input blur when clicking inside the dropdown
                e.preventDefault();
              }}
            >
                <SearchAutocomplete 
                    query={q} 
                    onSelect={handleAutocompleteSelect} 
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
