import React from 'react';
import { ServiceWithProfile } from '../../app/lib/definitions';
import { MapPin, BadgeCheck, MessageSquare, Eye } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface Props {
  service: ServiceWithProfile;
  // Eliminamos onConnect ya que la card maneja la acción directamente
  onViewDetail: (service: ServiceWithProfile) => void;
}

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfessionalCard: React.FC<Props> = ({ service, onViewDetail }) => {
  const trackEvent = async (eventType: string) => {
    try {
      const supabase = createClient();
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        metadata: {
          service_id: service.id,
          provider_name: service.proveedor.nombre_completo,
          provider_id: (service.proveedor as any).id,
        },
      });
    } catch (error) {
      console.error(`Error tracking ${eventType}:`, error);
    }
  };

  const handleViewDetail = () => {
    trackEvent('view_detail_click');
    onViewDetail(service);
  };

  const handleWhatsApp = () => {
    trackEvent('contact_click');

    if (service.telefono) {
      // 1. Limpiamos el número (dejamos solo dígitos)
      const cleanPhone = service.telefono.replace(/\D/g, '');

      // 2. Mensaje predefinido
      const text = `Hola ${service.proveedor.nombre_completo}, vi tu servicio "${service.nombre}" en Guía Puntana y me gustaría hacerte una consulta.`;

      // 3. Construimos la URL (asumiendo característica argentina 549 si no la tiene, ajusta según tu necesidad)
      // Si tus números ya vienen con 549, quita el '549' del string
      const url = `https://wa.me/549${cleanPhone}?text=${encodeURIComponent(text)}`;

      window.open(url, '_blank');
    } else {
      alert('Este profesional no tiene un número de teléfono registrado.');
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-grow flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {service.proveedor.foto_url ? (
                <img
                  src={service.proveedor.foto_url}
                  alt={service.proveedor.nombre_completo}
                  className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-800"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-lg font-bold text-orange-600 shadow-sm dark:border-gray-800 dark:bg-orange-900/30 dark:text-orange-400">
                  {getInitials(service.proveedor.nombre_completo)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white">
                {service.proveedor.nombre_completo}
              </h3>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-orange-600">
                {service.nombre}
              </p>
            </div>
          </div>
        </div>

        <p className="mb-5 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {service.descripcion}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {service.proveedor.insignias?.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <BadgeCheck size={12} className="mr-1 text-orange-500" />
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {service.localidad}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-50/50 p-4 dark:bg-gray-800/50">
        <button
          onClick={handleViewDetail}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-orange-500"
        >
          <Eye size={18} />
          Detalles
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-medium text-white transition-colors hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <MessageSquare size={18} />
          Contactar
        </button>
      </div>
    </article>
  );
};
export default ProfessionalCard;
