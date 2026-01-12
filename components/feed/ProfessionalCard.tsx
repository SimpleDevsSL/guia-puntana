import React from "react";
import { ServiceWithProfile } from "../../app/lib/definitions";
import { MapPin, BadgeCheck, MessageSquare } from "lucide-react";
import { Eye } from "lucide-react";

interface Props {
  service: ServiceWithProfile;
  onConnect: (service: ServiceWithProfile) => void;
  onViewDetail: (service: ServiceWithProfile) => void;
}

const getInitials = (name: string) => {
  if (!name) return "";
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
    <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      {" "}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {service.proveedor.foto_url ? (
                <img
                  src={service.proveedor.foto_url}
                  alt={service.proveedor.nombre_completo}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm text-orange-600 dark:text-orange-400 font-bold text-lg">
                  {getInitials(service.proveedor.nombre_completo)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-orange-600 transition-colors">
                {service.proveedor.nombre_completo}
              </h3>
              <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mt-0.5">
                {service.nombre}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
          {service.descripcion}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {service.proveedor.insignias?.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
            >
              <BadgeCheck size={12} className="mr-1 text-orange-500" />
              {badge}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 mt-auto border-t border-dashed border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {service.localidad}
            </span>
          </div>
        </div>
      </div>
      {/* Footer de la Card con dos botones */}
      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 flex gap-2">
        <button
          onClick={() => onViewDetail(service)}
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={18} />
          Detalles
        </button>
        <button
          onClick={() => onConnect(service)}
          className="flex-[1.5] bg-gray-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare size={18} />
          Contactar
        </button>
      </div>
    </article>
  );
};
export default ProfessionalCard;
