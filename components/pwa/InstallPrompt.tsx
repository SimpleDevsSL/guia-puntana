'use client';

import { useState, useEffect, useMemo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type BrowserType =
  | 'chrome'
  | 'ios-safari'
  | 'firefox'
  | 'opera'
  | 'brave'
  | 'other';

function detectBrowser(): BrowserType {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'ios-safari';
  }
  if (ua.includes('firefox')) {
    return 'firefox';
  }
  if (ua.includes('brave')) {
    return 'brave';
  }
  if (ua.includes('opr/') || ua.includes('opera')) {
    return 'opera';
  }
  if (ua.includes('chrome') || ua.includes('edge')) {
    return 'chrome';
  }

  return 'other';
}

function isMobileDevice(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    ua
  );
}

function isAppInstalled(): boolean {
  // Para iOS
  if (
    navigator.userAgent.includes('iphone') ||
    navigator.userAgent.includes('ipad')
  ) {
    return (
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
    );
  }

  // Para Android y otros
  return window.matchMedia('(display-mode: standalone)').matches;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  const browserType = useMemo(() => detectBrowser(), []);

  useEffect(() => {
    // Solo mostrar en dispositivos móviles
    if (!isMobileDevice()) {
      return;
    }

    // Si la app ya está instalada, no mostrar el prompt
    if (isAppInstalled()) {
      return;
    }

    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      // 1. Prevenir que el navegador muestre su prompt nativo
      e.preventDefault();
      // 2. Guardar el evento para dispararlo después
      setDeferredPrompt(promptEvent);
      // 3. Mostrar nuestro botón personalizado
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Para navegadores que no soportan beforeinstallprompt, mostrar opción manual
    // después de 3 segundos
    const timer = setTimeout(() => {
      if (
        !deferredPrompt &&
        (browserType === 'ios-safari' ||
          browserType === 'firefox' ||
          browserType === 'opera' ||
          browserType === 'brave')
      ) {
        setIsVisible(true);
        setShowManualInstructions(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt, browserType]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // 4. Mostrar el prompt nativo para Chromium
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar');
      }

      // Limpiar
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const renderContent = () => {
    if (showManualInstructions) {
      if (browserType === 'ios-safari') {
        return {
          title: 'Instalar Guía Puntana',
          description:
            'Toca el botón Compartir y selecciona "Añadir a pantalla de inicio"',
          instructions: (
            <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Pasos:</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Toca el botón Compartir (rectángulo con flecha)</li>
                <li>
                  Desplázate hacia abajo y toca "Añadir a pantalla de inicio"
                </li>
                <li>Confirma el nombre y toca "Añadir"</li>
              </ol>
            </div>
          ),
        };
      }
      if (browserType === 'firefox') {
        return {
          title: 'Instalar Guía Puntana',
          description:
            'Abre el menú y selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"',
          instructions: (
            <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Pasos:</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Abre el menú (tres líneas)</li>
                <li>Busca "Agregar app a la pantalla principal"</li>
                <li>Toca en "Agregar"</li>
              </ol>
            </div>
          ),
        };
      }
      if (browserType === 'opera') {
        return {
          title: 'Instalar Guía Puntana',
          description:
            'Abre el menú (Los 3 puntitos) y selecciona "Añadir a.." Luego "Añadir a pantalla de inicio"',
          instructions: (
            <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Pasos:</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Abre el menú (Los 3 puntitos)</li>
                <li>Busca "Añadir a..."</li>
                <li>Selecciona "Pantalla de Inicio"</li>
              </ol>
            </div>
          ),
        };
      }
      if (browserType === 'brave') {
        return {
          title: 'Instalar Guía Puntana',
          description: 'Abre el menú y selecciona "Instalar sitio web"',
          instructions: (
            <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Pasos:</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Abre el menú (esquina superior derecha)</li>
                <li>Selecciona "Instalar sitio web"</li>
                <li>Confirma la instalación</li>
              </ol>
            </div>
          ),
        };
      }
    }

    return {
      title: 'Instalar Guía Puntana',
      description: 'Añade la app a tu inicio para acceder más rápido.',
      instructions: null,
    };
  };

  const content = renderContent();

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
            {content.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {content.description}
          </p>
          {content.instructions && content.instructions}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Ahora no
            </button>
            {!showManualInstructions && (
              <button
                onClick={handleInstallClick}
                className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700"
              >
                Instalar App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
