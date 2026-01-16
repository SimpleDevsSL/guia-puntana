'use client';

import React, { useState } from 'react';
import { ServiceWithProfile } from '../lib/definitions';
import ResultsGrid from '@/components/feed/ResultsGrid';
import ServiceDetailModal from '@/components/feed/ServiceDetailModal';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * Props for the ClientFeedLogic component
 * @interface ClientFeedLogicProps
 */
interface ClientFeedLogicProps {
  /** Array of services to display in the feed */
  services: ServiceWithProfile[];
  /** Currently active service category name for filtering display */
  activeCategoryName: string;
  /** Current search query for filtering services */
  searchQuery: string;
}

/**
 * Client-side component for managing the service feed interaction logic.
 *
 * This component handles:
 * - Displaying services in a grid with real-time filtering
 * - Managing service detail modal state
 * - Recording contact click metrics to Supabase
 * - Opening WhatsApp conversations with pre-filled messages
 * - User experience feedback and error handling
 *
 * @component
 * @param {ClientFeedLogicProps} props - Component props
 * @returns {React.ReactElement} The feed UI with modal for service details
 *
 * @example
 * <ClientFeedLogic
 *   services={allServices}
 *   activeCategoryName="Plomería"
 *   searchQuery=""
 * />
 */
export default function ClientFeedLogic({
  services,
  activeCategoryName,
  searchQuery,
}: ClientFeedLogicProps) {
  const router = useRouter();
  const supabase = createClient();

  // State for showing/hiding service detail modal
  const [showDetailModal, setShowDetailModal] =
    useState<ServiceWithProfile | null>(null);

  const [loading] = useState(false);

  /**
   * Handles retry action by refreshing the feed page.
   * Used when an error occurs and user wants to retry.
   */
  const handleRetry = () => {
    router.push('/feed');
  };

  /**
   * Handles user contact action for a service.
   *
   * Process:
   * 1. Records a click metric to track user engagement
   * 2. Constructs a pre-filled WhatsApp message
   * 3. Opens WhatsApp with the message and contact number
   *
   * The message template includes the service provider's name and service type
   * to provide context for the conversation.
   *
   * @async
   * @param {ServiceWithProfile} service - The service to contact for
   * @throws {Error} If metrics recording fails (logged to console, doesn't block contact)
   */
  const handleContact = async (service: ServiceWithProfile) => {
    supabase
      .from('metricas_clics')
      .insert({
        servicio_id: service.id,
        proveedor_id: service.proveedor.id,
        tipo_contacto: 'whatsapp_directo',
      })
      .then(({ error }) => {
        if (error) console.warn('Error métrica:', error.message);
      });

    if (service.telefono) {
      const cleanPhone = service.telefono.replace(/\D/g, '');
      const text = `Hola ${service.proveedor.nombre_completo}, vi que ofreces el servicio de ${service.nombre} en Guía Puntana. Tengo una consulta...`;
      const encodedText = encodeURIComponent(text);

      // Es recomendable usar api.whatsapp.com en lugar de wa.me para mayor compatibilidad móvil
      const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

      window.open(url, '_blank');
    } else {
      alert('Este profesional no tiene un número de contacto configurado.');
    }
  };

  return (
    <>
      <ResultsGrid
        loading={loading}
        services={services}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        onConnect={handleContact}
        onViewDetail={setShowDetailModal}
        onRetry={handleRetry}
      />

      {showDetailModal && (
        <ServiceDetailModal
          service={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onContact={handleContact}
        />
      )}
    </>
  );
}
