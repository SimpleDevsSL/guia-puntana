'use client';
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocalidadAutocomplete } from '@/components/ui/LocalidadAutocomplete';

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

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (q.trim()) params.set('q', q);
    else params.delete('q');

    if (l.trim()) params.set('l', l);
    else params.delete('l');

    // Usamos el basePath dinámico
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-white px-4 pb-16 pt-12 dark:bg-gray-950">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <div className="flex w-full max-w-3xl flex-col gap-2 rounded-2xl border bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:flex-row">
          <div className="flex flex-[2] items-center">
            <Search className="ml-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent p-3 focus:outline-none dark:text-white"
              placeholder="¿Qué servicio estás buscando?"
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
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
