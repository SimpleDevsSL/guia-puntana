'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // 1. Prevenir que el navegador muestre su prompt nativo (que suele ser ignorado)
      e.preventDefault();
      // 2. Guardar el evento para dispararlo después
      setDeferredPrompt(e);
      // 3. Mostrar nuestro botón personalizado
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 4. Mostrar el prompt nativo cuando el usuario hace click
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar');
    }

    // Limpiar
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900 md:bottom-8 md:left-auto md:right-8 md:w-96">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
          {/* Icono de descarga o logo */}
          <svg
            className="h-6 w-6 text-orange-600 dark:text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Instalar Guía Puntana
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Añade la app a tu inicio para acceder más rápido y usarla offline.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Ahora no
            </button>
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700"
            >
              Instalar App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
