import React from 'react';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white py-8 transition-colors dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana. Hecho con
          ❤️ en San Luis.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/simpledevs_sl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-pink-600 dark:hover:text-pink-400"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="mailto:simpledevs.sl@gmail.com"
            className="text-gray-400 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
