'use client';

import React, { useState } from 'react';
import { ServiceWithProfile } from '../lib/definitions'; //
import ResultsGrid from '@/components/feed/ResultsGrid'; //
import ServiceDetailModal from '@/components/feed/ServiceDetailModal'; //
import { useRouter } from 'next/navigation'; //
import { createClient } from '@/utils/supabase/client'; //

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
  const router = useRouter(); //
  const supabase = createClient(); //

  const [showDetailModal, setShowDetailModal] =
    useState<ServiceWithProfile | null>(null); //

  const [loading] = useState(false); //

  const handleRetry = () => {
    router.push('/feed'); //
  };

  // Función Centralizada para Contacto, Métricas y Mensaje por Defecto
  const handleContact = async (service: ServiceWithProfile) => {
    // 1. Recolectar Métrica (Clic) - Requisito 5.2
    try {
      const { error } = await supabase.from('metricas_clics').insert({
        servicio_id: service.id, //
        proveedor_id: service.proveedor.id, //
        tipo_contacto: 'whatsapp_directo',
      });

      if (error) {
        console.warn('Error al registrar métrica:', error.message);
      }
    } catch (e) {
      console.error('Error en el sistema de métricas:', e);
    }

    // 2. Ejecutar Acción de Contacto con Mensaje Personalizado
    if (service.telefono) {
      // Limpiar el número de teléfono
      const cleanPhone = service.telefono.replace(/\D/g, '');

      // Construir el mensaje por defecto
      const text = `Hola ${service.proveedor.nombre_completo}, vi que ofreces el servicio de ${service.nombre} en Guía Puntana. Tengo una consulta...`;

      // Codificar el mensaje para que sea válido en una URL
      const encodedText = encodeURIComponent(text);

      // Crear la URL final con el parámetro text
      const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;

      window.open(url, '_blank'); //
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
