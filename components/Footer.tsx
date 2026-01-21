import React from 'react';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white py-8 transition-colors dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/simpledevs_sl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-pink-600 dark:hover:text-pink-400"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="mailto:simpledevs.sl@gmail.com"
            className="text-gray-400 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
            aria-label="Email"
          >
            <Mail size={24} />
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <p className="text-sm text-gray-400">
            SimpleDevs. Guía Puntana. Hecho con ❤️ en San Luis.
          </p>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <div className="flex gap-4 text-sm text-gray-400">
            <a
              href="/about"
              className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
            >
              Términos y Condiciones
            </a>
            <a
              href="/license"
              className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
