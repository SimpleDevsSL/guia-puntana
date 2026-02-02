'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

/**
 * Offline fallback page for PWA.
 * Displayed when the user is offline and tries to access a page that isn't cached.
 *
 * @component
 * @returns {React.ReactElement} Offline page with retry option
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo className="h-20 w-20 text-orange-600" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sin conexión
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Parece que no tienes conexión a internet
          </p>
        </div>

        {/* Offline Icon */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-32 w-32 text-gray-400 dark:text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
            />
            <line
              x1="2"
              y1="2"
              x2="22"
              y2="22"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Verifica tu conexión a internet e intenta nuevamente. Algunas
            páginas pueden estar disponibles sin conexión si las visitaste
            anteriormente.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-700 hover:shadow-xl"
            >
              Reintentar
            </button>
            <Link
              href="/feed"
              className="rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-orange-600 hover:text-orange-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-orange-600 dark:hover:text-orange-600"
            >
              Ir al inicio
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            💡 Consejos
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Verifica que el Wi-Fi o datos móviles estén activados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>Intenta moverte a un lugar con mejor señal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">•</span>
              <span>
                Algunas páginas visitadas recientemente pueden funcionar sin
                conexión
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
