// components/feed/HeroSection.tsx
'use client';
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  initialQuery: string;
  initialLocation: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  initialQuery,
  initialLocation,
}) => {
  const [q, setQ] = useState(initialQuery);
  const [l, setL] = useState(initialLocation);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (l) params.set('l', l);
    router.push(`/feed?${params.toString()}`);
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
              className="w-full bg-transparent p-3 focus:outline-none dark:text-white"
              placeholder="¿Qué servicio estás buscando?"
            />
          </div>
          <div className="flex flex-1 items-center">
            <MapPin className="ml-2 text-orange-600" size={20} />
            <input
              type="text"
              value={l}
              onChange={(e) => setL(e.target.value)}
              className="w-full bg-transparent p-3 focus:outline-none dark:text-white"
              placeholder="Localidad"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-xl bg-orange-600 px-8 py-3 font-bold text-white"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
