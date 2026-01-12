'use client';

import React, { useState } from 'react';
import { ServiceWithProfile } from '../lib/definitions'; //
import ResultsGrid from '@/components/feed/ResultsGrid'; //
import ServiceDetailModal from '@/components/feed/ServiceDetailModal';
import { useRouter } from 'next/navigation';

interface ClientFeedLogicProps {
  services: ServiceWithProfile[];
  activeCategoryName: string;
  searchQuery: string;
}

export default function ClientFeedLogic({
  services,
  activeCategoryName,
  searchQuery,
}: ClientFeedLogicProps) {
  const router = useRouter();

  // Estados para la interactividad de los modales
  const [showConnectModal, setShowConnectModal] =
    useState<ServiceWithProfile | null>(null);
  const [showDetailModal, setShowDetailModal] =
    useState<ServiceWithProfile | null>(null);

  // Al ser SSR, la carga inicial ya terminó cuando llega al cliente
  const [loading] = useState(false);

  const handleRetry = () => {
    // Resetear filtros navegando a la ruta base
    router.push('/feed');
  };

  return (
    <>
      <ResultsGrid
        loading={loading}
        services={services}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        onConnect={setShowConnectModal}
        onViewDetail={setShowDetailModal}
        onRetry={handleRetry}
      />

      {/* Modal de Detalle */}
      {showDetailModal && (
        <ServiceDetailModal
          service={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onContact={(s) => {
            setShowDetailModal(null);
            setShowConnectModal(s);
          }}
        />
      )}

      {/* Modal de Contacto (WhatsApp) */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Contactar a {showConnectModal.proveedor.nombre_completo}
            </h3>
            <div className="mb-6 rounded-xl border border-orange-100 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <b>Ubicación:</b> {showConnectModal.localidad}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <b>Servicio:</b> {showConnectModal.nombre}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectModal(null)}
                className="flex-1 rounded-xl border py-3 text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${showConnectModal.telefono}`,
                    '_blank'
                  )
                }
                className="flex-1 rounded-xl bg-orange-600 py-3 font-bold text-white"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
