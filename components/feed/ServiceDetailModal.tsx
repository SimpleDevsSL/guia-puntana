import React, { useState, RefObject } from 'react';
import Image from 'next/image';
import { ServiceWithProfile } from '../../app/lib/definitions';
import {
  MapPin,
  BadgeCheck,
  MessageSquare,
  Phone,
  Globe,
  Share2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

//Formulario de reseñas
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsSection from '../reviews/ReviewsSection';
import ReportService from './ReportService';
import { useBodyScrollLock } from '@/utils/hooks/useBodyScrollLock';
import ServiceRating from '../reviews/ServiceRating';

interface Props {
  service: ServiceWithProfile;
  onClose: () => void;
  onContact: (service: ServiceWithProfile) => void;
  savedScrollPosition?: number | RefObject<number>;
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
  savedScrollPosition,
}) => {
  useBodyScrollLock(true, savedScrollPosition);

  const [copied, setCopied] = useState(false);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);

  const handleShare = async () => {
    const url = `${window.location.origin}/feed?service=${service.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Servicio de ${service.nombre} - Guía Puntana`,
          text: `Te recomiendo este servicio...`,
          url: url,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-white p-2 text-gray-400 shadow-lg transition-colors hover:bg-gray-100 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 md:right-4 md:top-4"
          aria-label="Cerrar modal"
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

        {/* ↓ Todo el contenido dentro de este único div scrollable ↓ */}
        <div className="custom-scrollbar w-full flex-1 overflow-y-auto overscroll-contain p-4 md:p-8">

          {/* Encabezado con Foto y Nombre */}
          <div className="mb-4 flex flex-col items-center gap-3 md:mb-8 md:flex-row md:items-start md:gap-6">
            <Link href={`/proveedor/${service.proveedor.id}`}>
              {service.proveedor.foto_url ? (
                <Image
                  src={service.proveedor.foto_url}
                  alt={service.proveedor.nombre_completo}
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-xl border-2 border-orange-50 object-cover shadow-lg transition-transform hover:scale-105 dark:border-orange-900/30 md:h-32 md:w-32 md:rounded-2xl md:border-4"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-orange-50 bg-orange-100 text-2xl font-extrabold text-orange-600 shadow-lg transition-transform hover:scale-105 dark:border-orange-900/30 dark:bg-orange-900/30 dark:text-orange-400 md:h-32 md:w-32 md:rounded-2xl md:border-4 md:text-4xl">
                  {getInitials(service.proveedor.nombre_completo)}
                </div>
              )}
            </Link>
            <div className="flex-1 text-center md:text-left">
              <span className="mb-1.5 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 md:mb-2 md:px-3 md:py-1">
                {service.categoria.nombre}
              </span>

              <h2 className="mb-1.5 text-xl font-extrabold text-gray-900 dark:text-white md:mb-2 md:text-3xl">
                <Link
                  href={`/proveedor/${service.proveedor.id}`}
                  className="transition-colors hover:text-orange-600 hover:underline dark:hover:text-orange-400"
                >
                  {service.proveedor.nombre_completo}
                </Link>
              </h2>

              <div className="flex flex-wrap justify-center gap-1.5 md:justify-start md:gap-2">
                {service.proveedor?.insignias?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 md:text-sm"
                  >
                    <BadgeCheck
                      size={14}
                      className="text-orange-500 md:h-4 md:w-4"
                    />
                    {badge}
                  </span>
                ))}

                {service.proveedor?.insignias && service.proveedor.insignias.length > 0 && (
                  <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                )}
                <ServiceRating
                  serviceId={service.id}
                  className="bg-transparent px-0 shadow-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <hr className="mb-4 border-gray-100 dark:border-gray-800 md:mb-8" />

          {/* Información del Servicio */}
          <div className="space-y-3 md:space-y-6">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="mb-2 flex flex-col gap-1 text-base font-bold text-gray-900 dark:text-white md:mb-3 md:flex-row md:items-center md:gap-2 md:text-lg">
                  <span>Sobre el servicio:</span>
                  <span className="text-orange-600">{service.nombre}</span>
                </h3>
                <ReportService service={service} />
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-lg">
                {service.descripcion}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 dark:bg-gray-800/50 md:gap-3 md:rounded-2xl md:p-4">
                <div className="rounded-lg bg-white p-1.5 text-orange-600 shadow-sm dark:bg-gray-800 md:p-2">
                  <MapPin size={18} className="md:h-5 md:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Ubicación
                  </p>
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white md:text-base">
                    {service.localidad}
                    {service.barrio ? `, ${service.barrio}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 dark:bg-gray-800/50 md:gap-3 md:rounded-2xl md:p-4">
                <div className="rounded-lg bg-white p-1.5 text-orange-600 shadow-sm dark:bg-gray-800 md:p-2">
                  <Phone size={18} className="md:h-5 md:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Contacto Directo
                  </p>
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white md:text-base">
                    {service.telefono || 'No disponible'}
                  </p>
                </div>
              </div>

              {service.redes &&
                Array.isArray(service.redes) &&
                service.redes.length > 0 && (
                  <div className="space-y-2 md:col-span-2 md:space-y-3">
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
                          className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 dark:bg-gray-800/50 md:gap-3 md:p-3"
                        >
                          <div className="rounded-lg bg-white p-1.5 text-orange-600 shadow-sm dark:bg-gray-800 md:p-2">
                            <Globe
                              size={16}
                              className="md:h-[18px] md:w-[18px]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            {isUrl ? (
                              <a
                                href={
                                  url.startsWith('www') ? `https://${url}` : url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate text-sm font-semibold text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 md:text-base"
                              >
                                Visitar Red
                              </a>
                            ) : (
                              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white md:text-base">
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
          <div className="mt-6 space-y-2.5 md:mt-10 md:space-y-3">
            <button
              onClick={() => onContact(service)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-base font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700 active:scale-[0.98] md:gap-3 md:rounded-2xl md:py-4 md:text-lg"
            >
              <MessageSquare size={20} className="md:h-[22px] md:w-[22px]" />
              Contactar por WhatsApp
            </button>
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] md:gap-3 md:rounded-2xl md:py-4 md:text-lg"
            >
              {copied ? (
                <Check size={20} className="md:h-[22px] md:w-[22px]" />
              ) : (
                <Share2 size={20} className="md:h-[22px] md:w-[22px]" />
              )}
              {copied ? 'Enlace Copiado' : 'Compartir Servicio'}
            </button>
          </div>

          {/* Formulario de reseña */}
          <div className="mt-10 border-t border-gray-100 pt-8 dark:border-gray-800">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Deja tu Reseña
            </h3>

            <div className="mt-8">
              <ReviewForm
                servicioId={service.id}
                onSuccess={() => {
                  alert('¡Reseña guardada con éxito!');
                  console.log('Reseña guardada');
                  setReviewsRefreshKey((prev) => prev + 1);
                }}
              />
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400 md:text-base"
            >
              Volver a la búsqueda
            </button>
          </div>

          <hr className="my-10 border-gray-100 dark:border-gray-800" />

          {/* ↓ ReviewsSection adentro del div scrollable, al final ↓ */}
          <ReviewsSection
            servicioId={service.id}
            refreshKey={reviewsRefreshKey}
          />

        </div>{/* ← cierra el div scrollable */}
      </div>{/* ← cierra el modal */}
    </div>
  );
};

export default ServiceDetailModal;