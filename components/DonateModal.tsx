'use client';

import React, { useState } from 'react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const alias = 'juanplatasanchez';

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Hubo un error al copiar el texto: ', err);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <div
        className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-xl bg-white p-4 text-center shadow-xl duration-200 dark:bg-gray-900 md:rounded-2xl md:p-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 md:right-4 md:top-4"
        >
          <svg
            className="h-5 w-5 md:h-6 md:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 md:mb-4 md:h-16 md:w-16">
          <svg
            className="h-7 w-7 text-orange-600 dark:text-orange-400 md:h-8 md:w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
          ¡Ayudanos a crecer!
        </h3>

        <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 md:mb-6 md:space-y-3 md:text-base">
          <p>
            Guía Puntana es un proyecto{' '}
            <strong>100% gratuito y de código abierto</strong>, creado para
            potenciar el trabajo local en San Luis.
          </p>
          <p>
            Tu colaboración es fundamental para cubrir los costos de servidores,
            base de datos y dominio, permitiéndonos seguir mejorando la
            plataforma sin cobrar comisiones ni suscripciones.
          </p>
        </div>

        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:mb-6 md:rounded-xl md:p-4">
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">
            Alias para transferencias
          </p>
          <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-700">
            <code className="flex-1 truncate px-2 font-mono text-base font-bold text-gray-900 dark:text-white md:text-lg">
              {alias}
            </code>
            <button
              onClick={handleCopy}
              className={`ml-2 inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-all md:px-3 md:py-2 md:text-sm ${
                copied
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <svg
                    className="mr-1 h-3.5 w-3.5 md:mr-1.5 md:h-4 md:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copiado
                </>
              ) : (
                'Copiar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
