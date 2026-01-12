import React from "react";
import { ServiceWithProfile } from "../../app/lib/definitions";
import { MapPin, BadgeCheck, MessageSquare, X, Phone, Star } from "lucide-react";

interface Props {
  service: ServiceWithProfile;
  onClose: () => void;
  onContact: (service: ServiceWithProfile) => void;
}

const ServiceDetailModal: React.FC<Props> = ({ service, onClose, onContact }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-gray-800 relative">
        
        {/* Botón Cerrar / Volver */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Encabezado con Foto y Nombre */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
            <img
              src={service.proveedor.foto_url || "https://via.placeholder.com/150"}
              alt={service.proveedor.nombre_completo }
              className="w-32 h-32 rounded-2xl object-cover border-4 border-orange-50 dark:border-orange-900/30 shadow-lg"
            />
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                {service.categoria.nombre}
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {service.proveedor.nombre_completo}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {service.proveedor?.insignias?.map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <BadgeCheck size={16} className="text-orange-500" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800 mb-8" />

          {/* Información del Servicio */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                Sobre el servicio: <span className="text-orange-600">{service.nombre}</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {service.descripcion}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-orange-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Ubicación</p>
                  <p className="text-gray-900 dark:text-white font-medium">{service.localidad}{service.barrio ? `, ${service.barrio}` : ''}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/50 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-orange-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Contacto Directo</p>
                  <p className="text-gray-900 dark:text-white font-medium">{service.telefono || "No disponible"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acción Principal */}
          <div className="mt-10">
            <button
              onClick={() => onContact(service)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-3 text-lg"
            >
              <MessageSquare size={22} />
              Contactar por WhatsApp
            </button>
            <button 
              onClick={onClose}
              className="w-full mt-4 text-gray-500 dark:text-gray-400 font-medium hover:underline"
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