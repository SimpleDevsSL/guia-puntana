import React from "react";
import { ServiceWithProfile } from "../../app/lib/definitions";
import { MapPin, BadgeCheck, MessageSquare } from "lucide-react";

interface Props {
  service: ServiceWithProfile;
  onConnect: (service: ServiceWithProfile) => void;
}

const ProfessionalCard: React.FC<Props> = ({ service, onConnect }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  service.proveedor.foto_url ||
                  "https://via.placeholder.com/150"
                }
                alt={service.proveedor.nombre_completo}
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              />
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

      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50">
        <button
          onClick={() => onConnect(service)}
          className="w-full bg-gray-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare size={18} />
          Contactar
        </button>
      </div>
    </div>
  );
};

export default ProfessionalCard;
