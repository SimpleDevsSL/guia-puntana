import React from 'react';
import { ServiceWithProfile } from '../../app/lib/definitions';
import { MapPin, BadgeCheck, MessageSquare, X, Phone } from 'lucide-react';

/**
 * Props for the ServiceDetailModal component
 * @interface Props
 */
interface Props {
  /** The service to display detailed information for */
  service: ServiceWithProfile;
  /** Callback function to execute when modal is closed */
  onClose: () => void;
  /** Callback function to execute when user initiates contact */
  onContact: (service: ServiceWithProfile) => void;
}

/**
 * Generates initials from a person's name for avatar fallback.
 *
 * @param {string} name - The full name to extract initials from
 * @returns {string} Uppercase initials (max 2 characters)
 *
 * @example
 * getInitials('Juan Pérez') // Returns 'JP'
 * getInitials('María') // Returns 'MA'
 */
const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Modal component displaying detailed service information.
 *
 * This component shows:
 * - Service provider profile (photo, name, badges/credentials)
 * - Service category
 * - Service description
 * - Location and contact information
 * - Action button to initiate contact via WhatsApp
 *
 * Features:
 * - Responsive design (mobile and desktop)
 * - Dark mode support
 * - Smooth animations
 * - Fallback avatar with initials if no photo available
 *
 * @component
 * @param {Props} props - Component props
 * @returns {React.ReactElement} A modal dialog with service details
 *
 * @example
 * <ServiceDetailModal
 *   service={serviceData}
 *   onClose={() => setService(null)}
 *   onContact={handleWhatsAppContact}
 * />
 */
const ServiceDetailModal: React.FC<Props> = ({
  service,
  onClose,
  onContact,
}) => {
  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Botón Cerrar / Volver */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:text-gray-900 dark:bg-gray-800 dark:hover:text-white"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Encabezado con Foto y Nombre */}
          <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
            {service.proveedor.foto_url ? (
              <img
                src={service.proveedor.foto_url}
                alt={service.proveedor.nombre_completo}
                className="h-32 w-32 rounded-2xl border-4 border-orange-50 object-cover shadow-lg dark:border-orange-900/30"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-orange-50 bg-orange-100 text-4xl font-extrabold text-orange-600 shadow-lg dark:border-orange-900/30 dark:bg-orange-900/30 dark:text-orange-400">
                {getInitials(service.proveedor.nombre_completo)}
              </div>
            )}
            <div className="text-center md:text-left">
              <span className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {service.categoria.nombre}
              </span>
              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                {service.proveedor.nombre_completo}
              </h2>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {service.proveedor?.insignias?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <BadgeCheck size={16} className="text-orange-500" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="mb-8 border-gray-100 dark:border-gray-800" />

          {/* Información del Servicio */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                Sobre el servicio:{' '}
                <span className="text-orange-600">{service.nombre}</span>
              </h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {service.descripcion}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-gray-800/50">
                <div className="rounded-lg bg-white p-2 text-orange-600 shadow-sm dark:bg-gray-800">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Ubicación
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {service.localidad}
                    {service.barrio ? `, ${service.barrio}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-gray-800/50">
                <div className="rounded-lg bg-white p-2 text-orange-600 shadow-sm dark:bg-gray-800">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Contacto Directo
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {service.telefono || 'No disponible'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acción Principal */}
          <div className="mt-10">
            <button
              onClick={() => onContact(service)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700"
            >
              <MessageSquare size={22} />
              Contactar por WhatsApp
            </button>
            <button
              onClick={onClose}
              className="mt-4 w-full font-medium text-gray-500 hover:underline dark:text-gray-400"
            >
              Volver a la búsqueda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
