'use client';

import React, { useState } from 'react';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
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
        <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-gray-900 animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <svg className="h-8 w-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    ¡Ayudanos a crecer!
                </h3>

                <div className="mb-6 text-gray-600 dark:text-gray-300 space-y-3">
                    <p>
                        Guía Puntana es un proyecto <strong>100% gratuito y de código abierto</strong>, creado para potenciar el trabajo local en San Luis.
                    </p>
                    <p>
                        Tu colaboración es fundamental para cubrir los costos de servidores, base de datos y dominio, permitiéndonos seguir mejorando la plataforma sin cobrar comisiones ni suscripciones.
                    </p>
                </div>

                <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Alias para transferencias</p>
                    <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-700">
                        <code className="flex-1 truncate px-2 font-mono text-lg font-bold text-gray-900 dark:text-white">
                            {alias}
                        </code>
                        <button
                            onClick={handleCopy}
                            className={`ml-2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all
                ${copied
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
