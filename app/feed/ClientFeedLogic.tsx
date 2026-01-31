'use client';

import React, { useState, useMemo } from 'react';
import { ServiceWithProfile } from '../lib/definitions';
import ResultsGrid from '@/components/feed/ResultsGrid';
import ServiceDetailModal from '@/components/feed/ServiceDetailModal';
import ActiveFilters from '@/components/feed/ActiveFilters';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface ClientFeedLogicProps {
  initialServices: ServiceWithProfile[];
  activeCategoryName: string;
  searchQuery: string;
  searchLocation: string;
  categoryId: string | null;
  itemsPerPage: number;
}

export default function ClientFeedLogic({
  initialServices,
  activeCategoryName,
  searchQuery,
  searchLocation,
  categoryId,
  itemsPerPage,
}: ClientFeedLogicProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Estado para la lista acumulativa de servicios
  const [services, setServices] =
    useState<ServiceWithProfile[]>(initialServices);

  // Estado para paginación
  const [offset, setOffset] = useState(itemsPerPage);
  const [hasMore, setHasMore] = useState(
    initialServices.length >= itemsPerPage
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading] = useState(false);

  // Derivar el estado del modal desde searchParams (evita setState en useEffect)
  const showDetailModal = useMemo(() => {
    const serviceIdFromUrl = searchParams.get('service');

    if (serviceIdFromUrl) {
      return services.find((s) => s.id === serviceIdFromUrl) || null;
    }

    return null;
  }, [searchParams, services]);

  // Función auxiliar para actualizar la URL sin recargar
  const updateUrlParam = (serviceId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (serviceId) {
      params.set('service', serviceId);
    } else {
      params.delete('service');
    }

    // push con scroll: false evita que la página salte arriba
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleOpenModal = (service: ServiceWithProfile) => {
    updateUrlParam(service.id);
  };

  const handleCloseModal = () => {
    updateUrlParam(null);
  };

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

      if (moreServices.length < itemsPerPage) {
        setHasMore(false);
      }

      setServices((prev) => [...prev, ...moreServices]);
      setOffset((prev) => prev + itemsPerPage);
    }

    setLoadingMore(false);
  };

  const handleRetry = () => {
    router.refresh();
    router.push('/feed');
  };

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
        onViewDetail={handleOpenModal} // Usamos la nueva función
        onRetry={handleRetry}
      />

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
          onClose={handleCloseModal} // Usamos la nueva función
          onContact={handleContact}
        />
      )}
    </>
  );
}
