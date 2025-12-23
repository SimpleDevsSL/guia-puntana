import React from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Header: React.FC = () => (
<header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Integrado */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/logo_venado.png"
                alt="Logo Guía Puntana"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Guía Puntana
            </span>
          </div>

          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
          >
            Ingresar
          </Link>
        </div>
      </header>
);