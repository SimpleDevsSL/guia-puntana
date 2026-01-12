// components/feed/HeroSection.tsx
"use client";
import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

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
    if (q) params.set("q", q);
    if (l) params.set("l", l);
    router.push(`/feed?${params.toString()}`);
  };

  return (
    <div className="relative pt-12 pb-16 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-lg border dark:border-gray-800 flex flex-col md:flex-row gap-2">
          <div className="flex-[2] flex items-center">
            <Search className="ml-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none dark:text-white"
              placeholder="¿Qué servicio estás buscando?"
            />
          </div>
          <div className="flex-1 flex items-center">
            <MapPin className="ml-2 text-orange-600" size={20} />
            <input
              type="text"
              value={l}
              onChange={(e) => setL(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none dark:text-white"
              placeholder="Localidad"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-orange-600 text-white font-bold py-3 px-8 rounded-xl"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
