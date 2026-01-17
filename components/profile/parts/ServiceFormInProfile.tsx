'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/app/lib/definitions';
import { LocalidadAutocomplete } from '@/components/ui/LocalidadAutocomplete';
import { Trash2 } from 'lucide-react';

interface ServiceFormInProfileProps {
  service: {
    tempId: number;
    categoria_id: string;
    nombre: string;
    descripcion: string;
    telefono: string;
    direccion: string;
    localidad: string;
    barrio: string;
    redes: Array<{ url: string }>;
  };
  onUpdate: (field: string, value: unknown) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
  index: number;
  totalServices: number;
}

export function ServiceFormInProfile({
  service,
  onUpdate,
  onRemove,
  errors = {},
  index,
  totalServices,
}: ServiceFormInProfileProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase
        .from('categorias')
        .select('id, nombre')
        .eq('es_activa', true);
      if (data) setCategories(data);
    };
    fetchCats();
  }, [supabase]);

  const getErrorKey = (field: string) => `service_${service.tempId}_${field}`;
  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm';
  const labelClass =
    'block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider';

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">
          Servicio {index + 1} de {totalServices}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select
            className={`${inputClass} ${errors[getErrorKey('categoria_id')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.categoria_id}
            onChange={(e) => onUpdate('categoria_id', e.target.value)}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors[getErrorKey('categoria_id')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('categoria_id')]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input
            type="text"
            className={`${inputClass} ${errors[getErrorKey('nombre')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.nombre}
            onChange={(e) => onUpdate('nombre', e.target.value)}
          />
          {errors[getErrorKey('nombre')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('nombre')]}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>WhatsApp *</label>
          <input
            type="text"
            className={`${inputClass} ${errors[getErrorKey('telefono')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.telefono}
            onChange={(e) => onUpdate('telefono', e.target.value)}
          />
          {errors[getErrorKey('telefono')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('telefono')]}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Dirección *</label>
          <input
            type="text"
            className={`${inputClass} ${errors[getErrorKey('direccion')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.direccion}
            onChange={(e) => onUpdate('direccion', e.target.value)}
          />
          {errors[getErrorKey('direccion')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('direccion')]}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Localidad *</label>
          <LocalidadAutocomplete
            value={service.localidad}
            onChange={(value) => onUpdate('localidad', value)}
            error={errors[getErrorKey('localidad')]}
          />
          {errors[getErrorKey('localidad')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('localidad')]}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Barrio</label>
          <input
            type="text"
            className={`${inputClass} ${errors[getErrorKey('barrio')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.barrio}
            onChange={(e) => onUpdate('barrio', e.target.value)}
          />
          {errors[getErrorKey('barrio')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('barrio')]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Redes o Sitio Web (Opcional)</label>
          <div className="space-y-2">
            {service.redes.map((red, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: @miusuario o https://instagram.com/..."
                  className={`${inputClass} ${errors[`service_${service.tempId}_redes.${idx}.url`] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
                  value={red.url}
                  onChange={(e) => {
                    const newRedes = [...service.redes];
                    newRedes[idx].url = e.target.value;
                    onUpdate('redes', newRedes);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newRedes = service.redes.filter((_, i) => i !== idx);
                    onUpdate('redes', newRedes);
                  }}
                  className="rounded-lg bg-red-50 px-3 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            {service.redes.length < 3 && (
              <button
                type="button"
                onClick={() => {
                  onUpdate('redes', [...service.redes, { url: '' }]);
                }}
                className="w-full rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 py-2 text-sm font-semibold text-orange-600 transition-all hover:border-orange-400 hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-900/10 dark:text-orange-400"
              >
                + Agregar Red
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Descripción *</label>
          <textarea
            rows={2}
            className={`${inputClass} ${errors[getErrorKey('descripcion')] ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={service.descripcion}
            onChange={(e) => onUpdate('descripcion', e.target.value)}
          />
          {errors[getErrorKey('descripcion')] && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors[getErrorKey('descripcion')]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
