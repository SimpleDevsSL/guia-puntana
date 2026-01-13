'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { serviceSchema } from '@/components/profile/form-schema';
import { ServiceWithProfile, Category } from '@/app/lib/definitions'; // Importar tipos

interface ServiceFormProps {
  serviceToEdit?: ServiceWithProfile | null; // Cambiar any por tipo real
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({
  serviceToEdit,
  onSuccess,
  onCancel,
}: ServiceFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Cambiar any[] por Category[]
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    categoria_id: serviceToEdit?.categoria?.id || '',
    nombre: serviceToEdit?.nombre || '',
    descripcion: serviceToEdit?.descripcion || '',
    telefono: serviceToEdit?.telefono || '',
    direccion: serviceToEdit?.direccion || '',
    localidad: serviceToEdit?.localidad || 'San Luis',
    barrio: serviceToEdit?.barrio || '',
  });

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

  // Mantener el formulario sincronizado cuando se abre en modo edición
  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        categoria_id: serviceToEdit.categoria?.id || '',
        nombre: serviceToEdit.nombre || '',
        descripcion: serviceToEdit.descripcion || '',
        telefono: serviceToEdit.telefono || '',
        direccion: serviceToEdit.direccion || '',
        localidad: serviceToEdit.localidad || 'San Luis',
        barrio: serviceToEdit.barrio || '',
      });
    } else {
      setFormData({
        categoria_id: '',
        nombre: '',
        descripcion: '',
        telefono: '',
        direccion: '',
        localidad: 'San Luis',
        barrio: '',
      });
    }
  }, [serviceToEdit]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = serviceSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach(
        (i) => (newErrors[i.path[0].toString()] = i.message)
      );
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesión no encontrada');

      if (serviceToEdit) {
        // MODO EDICIÓN
        const { error } = await supabase
          .from('servicios')
          .update({
            categoria_id: formData.categoria_id,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            telefono: formData.telefono,
            direccion: formData.direccion,
            localidad: formData.localidad,
            barrio: formData.barrio,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          })
          .eq('id', serviceToEdit.id);
        if (error) throw error;
      } else {
        // MODO CREACIÓN
        const { data: profile } = await supabase
          .from('perfiles')
          .select('id')
          .eq('usuario_id', user.id)
          .single();

        const { error } = await supabase.from('servicios').insert({
          proveedor_id: profile?.id,
          categoria_id: formData.categoria_id,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          telefono: formData.telefono,
          direccion: formData.direccion,
          localidad: formData.localidad,
          barrio: formData.barrio,
          created_by: user.id,
        });
        if (error) throw error;
      }

      onSuccess();
    } catch (err: unknown) {
      console.error('Error saving service:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      alert(`Hubo un error al guardar el servicio: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all';
  const labelClass =
    'block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:p-8"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {serviceToEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          Cancelar
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="font-bold">
            Por favor corrige los siguientes errores:
          </div>
          <ul className="mt-2 list-disc pl-5">
            {Object.entries(errors).map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select
            className={`${inputClass} ${errors.categoria_id ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.categoria_id}
            onChange={(e) =>
              setFormData({ ...formData, categoria_id: e.target.value })
            }
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.categoria_id}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input
            type="text"
            className={`${inputClass} ${errors.nombre ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          {errors.nombre && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.nombre}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>WhatsApp *</label>
          <input
            type="text"
            className={`${inputClass} ${errors.telefono ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
          />
          {errors.telefono && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.telefono}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Dirección *</label>
          <input
            type="text"
            className={`${inputClass} ${errors.direccion ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
          />
          {errors.direccion && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.direccion}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Localidad *</label>
          <input
            type="text"
            className={`${inputClass} ${errors.localidad ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.localidad}
            onChange={(e) =>
              setFormData({ ...formData, localidad: e.target.value })
            }
          />
          {errors.localidad && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.localidad}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Barrio</label>
          <input
            type="text"
            className={`${inputClass} ${errors.barrio ? 'border-red-500 ring-1 ring-red-200' : ''}`}
            value={formData.barrio}
            onChange={(e) =>
              setFormData({ ...formData, barrio: e.target.value })
            }
          />
          {errors.barrio && (
            <p className="mt-1 text-xs font-bold text-red-500">
              {errors.barrio}
            </p>
          )}
        </div>{' '}
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Descripción *</label>
        <textarea
          rows={3}
          className={`${inputClass} ${errors.descripcion ? 'border-red-500 ring-1 ring-red-200' : ''}`}
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs font-bold text-red-500">
            {errors.descripcion}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-36 rounded-xl bg-gray-100 py-4 font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-orange-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-orange-700 disabled:opacity-50"
        >
          {loading
            ? 'Guardando...'
            : serviceToEdit
              ? 'Actualizar Servicio'
              : 'Publicar Servicio'}
        </button>
      </div>
    </form>
  );
}
