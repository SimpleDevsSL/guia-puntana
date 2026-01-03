import React from 'react';
import { Professional } from '../../app/lib/definitions';
import { Star, ShieldCheck, MapPin, BadgeCheck } from 'lucide-react';

interface Props {
  professional: Professional;
  onConnect: (prof: Professional) => void;
}

const ProfessionalCard: React.FC<Props> = ({ professional, onConnect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={professional.imageUrl} 
                alt={professional.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
              />
              {professional.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white" title="Verificado">
                  <ShieldCheck size={12} fill="currentColor" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-orange transition-colors">
                {professional.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">{professional.specialization}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-gray-800">{professional.rating.toFixed(1)}</span>
             </div>
             <span className="text-xs text-gray-400 mt-1">{professional.reviewCount} reseñas</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
          {professional.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {professional.badges.slice(0, 3).map((badge: string, idx: number) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
               {badge === 'Matriculado' && <BadgeCheck size={12} className="mr-1 text-brand-orange" />}
               {badge}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 mt-auto border-t border-dashed border-gray-200">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400"/>
            <span className="text-gray-600">{professional.distanceKm.toFixed(1)} km</span>
          </div>
          <div className="font-bold text-gray-900 text-lg">
            ${professional.hourlyRate}<span className="text-xs font-normal text-gray-400">/h</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50/50">
        <button 
          onClick={() => onConnect(professional)}
          className="w-full bg-brand-dark hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Contactar
        </button>
      </div>
    </div>
  );
};

export default ProfessionalCard;