import React from 'react';
import Image from 'next/image';
import { ServiceWithProfile } from '../../app/lib/definitions';
import { MapPin, BadgeCheck, MessageSquare } from 'lucide-react';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface Props {
  service: ServiceWithProfile;
  onConnect: (service: ServiceWithProfile) => void;
  onViewDetail: (service: ServiceWithProfile) => void;
}

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfessionalCard: React.FC<Props> = ({
  service,
  onConnect,
  onViewDetail,
}) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-grow flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Avatar clickeable -> Va al perfil */}
              <Link href={`/proveedor/${service.proveedor.id}`}>
                {service.proveedor.foto_url ? (
                  <img
                    src={service.proveedor.foto_url}
                    alt={service.proveedor.nombre_completo}
                    className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm transition-transform hover:scale-105 dark:border-gray-800"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-lg font-bold text-orange-600 shadow-sm transition-transform hover:scale-105 dark:border-gray-800 dark:bg-orange-900/30 dark:text-orange-400">
                    {getInitials(service.proveedor.nombre_completo)}
                  </div>
                )}
              </Link>
            </div>
            <div>
              {/* Nombre del Servicio -> Abre el modal de detalles */}
              <h3
                onClick={() => onViewDetail(service)}
                className="cursor-pointer text-lg font-bold leading-tight text-gray-900 transition-colors hover:text-orange-600 dark:text-white"
              >
                {service.nombre}
              </h3>

              {/* Nombre del Proveedor -> Va al perfil */}
              <p className="mt-0.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                Por{' '}
                <Link
                  href={`/proveedor/${service.proveedor.id}`}
                  className="hover:text-orange-600 hover:underline"
                >
                  {service.proveedor.nombre_completo}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Descripción también clickeable (opcional, mejora UX) */}
        <p
          onClick={() => onViewDetail(service)}
          className="mb-5 line-clamp-3 flex-grow cursor-pointer text-sm leading-relaxed text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
        >
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
          onClick={() => onViewDetail(service)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-orange-500"
        >
          <Eye size={18} />
          Detalles
        </button>
        <button
          onClick={() => onConnect(service)}
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
