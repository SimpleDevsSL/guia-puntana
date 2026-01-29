import React from 'react';
import Image from 'next/image';
import { ServiceWithProfile } from '../../app/lib/definitions';
import {
  MapPin,
  BadgeCheck,
  MessageSquare,
  X,
  Phone,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import ReportService from './ReportService';
import { useBodyScrollLock } from '@/utils/hooks/useBodyScrollLock';

interface Props {
  service: ServiceWithProfile;
  onClose: () => void;
  onContact: (service: ServiceWithProfile) => void;
}

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ServiceDetailModal: React.FC<Props> = ({
  service,
  onClose,
  onContact,
}) => {
  // Bloquear el scroll del body cuando el modal está abierto
  useBodyScrollLock(true);

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 overscroll-contain" onClick={(e) => e.stopPropagation()}>


        <div className="p-8">
          {/* Encabezado con Foto y Nombre */}
          <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
            <Link href={`/proveedor/${service.proveedor.id}`}>
              {service.proveedor.foto_url ? (
                <Image
                  src={service.proveedor.foto_url}
                  alt={service.proveedor.nombre_completo}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-2xl border-4 border-orange-50 object-cover shadow-lg transition-transform hover:scale-105 dark:border-orange-900/30"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-orange-50 bg-orange-100 text-4xl font-extrabold text-orange-600 shadow-lg transition-transform hover:scale-105 dark:border-orange-900/30 dark:bg-orange-900/30 dark:text-orange-400">
                  {getInitials(service.proveedor.nombre_completo)}
                </div>
              )}
            </Link>
            <div className="text-center md:text-left">
              <span className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {service.categoria.nombre}
              </span>

              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                <Link
                  href={`/proveedor/${service.proveedor.id}`}
                  className="transition-colors hover:text-orange-600 hover:underline dark:hover:text-orange-400"
                >
                  {service.proveedor.nombre_completo}
                </Link>
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
              <div
                className="flex items-center justify-between"
              >
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  Sobre el servicio:{' '}
                  <span className="text-orange-600">{service.nombre}</span>
                </h3>
                <ReportService
                  service={service}
                />
              </div>
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

              {service.redes &&
                Array.isArray(service.redes) &&
                service.redes.length > 0 && (
                  <div className="space-y-3 md:col-span-2">
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Redes y Sitios Web
                    </p>
                    {service.redes.map((red, idx) => {
                      const url = red.url;
                      const isUrl =
                        url.startsWith('http://') ||
                        url.startsWith('https://') ||
                        url.startsWith('www');

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-gray-800/50"
                        >
                          <div className="rounded-lg bg-white p-2 text-orange-600 shadow-sm dark:bg-gray-800">
                            <Globe size={18} />
                          </div>
                          <div className="flex-1">
                            {isUrl ? (
                              <a
                                href={
                                  url.startsWith('www') ? `https://${url}` : url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                              >
                                Visitar Red
                              </a>
                            ) : (
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {url}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
