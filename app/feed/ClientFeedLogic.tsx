'use client';

import React, { useState } from 'react';
import { ServiceWithProfile } from '../lib/definitions';
import ResultsGrid from '@/components/feed/ResultsGrid';
import ServiceDetailModal from '@/components/feed/ServiceDetailModal';
import ActiveFilters from '@/components/feed/ActiveFilters';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * Props for the ClientFeedLogic component
 * @interface ClientFeedLogicProps
 */
interface ClientFeedLogicProps {
  initialServices: ServiceWithProfile[]; // Renombrado de services
  activeCategoryName: string;
  searchQuery: string;
  searchLocation: string;
  categoryId: string | null;
  itemsPerPage: number;
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
  initialServices,
  activeCategoryName,
  searchQuery,
  searchLocation,
  categoryId,
  itemsPerPage,
}: ClientFeedLogicProps) {
  const router = useRouter();
  const supabase = createClient();

  // Estado para la lista acumulativa de servicios
  const [services, setServices] =
    useState<ServiceWithProfile[]>(initialServices);

  // Estado para paginación
  const [offset, setOffset] = useState(itemsPerPage);
  const [hasMore, setHasMore] = useState(
    initialServices.length === itemsPerPage
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const [showDetailModal, setShowDetailModal] =
    useState<ServiceWithProfile | null>(null);

  const [loading] = useState(false);

  // Función para cargar la siguiente página
  const loadMoreServices = async () => {
    setLoadingMore(true);

    const { data: newServices, error } = await supabase.rpc(
      'buscar_servicios',
      {
        query_text: searchQuery,
        categoria_filtro: categoryId,
        loc_filtro: searchLocation || null,
        limit_val: itemsPerPage,
        offset_val: offset,
      }
    ).select(`
        id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
        categoria:categorias(id, nombre),
        proveedor:perfiles(id, nombre_completo, foto_url, insignias)
      `);

    if (error) {
      console.error('Error cargando más servicios:', error);
    } else {
      const moreServices =
        (newServices as unknown as ServiceWithProfile[]) || [];

      // Si trajo menos del límite, es que ya no hay más
      if (moreServices.length < itemsPerPage) {
        setHasMore(false);
      }

      // Añadimos los nuevos al final de la lista existente
      setServices((prev) => [...prev, ...moreServices]);
      setOffset((prev) => prev + itemsPerPage);
    }

    setLoadingMore(false);
  };

  /**
   * Handles retry action by refreshing the feed page.
   * Used when an error occurs and user wants to retry.
   */
  const handleRetry = () => {
    router.refresh();
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
      <ActiveFilters
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        searchLocation={searchLocation}
      />
      <ResultsGrid
        loading={loading}
        services={services}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        onConnect={handleContact}
        onViewDetail={setShowDetailModal}
        onRetry={handleRetry}
      />

      {/* Botón de Cargar Más / Infinite Scroll Trigger */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMoreServices}
            disabled={loadingMore}
            className="rounded-full bg-stone-950 px-6 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más servicios'}
          </button>
        </div>
      )}

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
