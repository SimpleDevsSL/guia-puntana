"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { serviceSchema } from "@/components/profile/form-schema";

interface ServiceFormProps {
  serviceToEdit?: any; // Datos del servicio si estamos editando
  onSuccess: () => void; // Callback para refrescar la lista
  onCancel: () => void;
}

export function ServiceForm({
  serviceToEdit,
  onSuccess,
  onCancel,
}: ServiceFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    categoria_id: serviceToEdit?.categoria_id || "",
    nombre: serviceToEdit?.nombre || "",
    descripcion: serviceToEdit?.descripcion || "",
    telefono: serviceToEdit?.telefono || "",
    direccion: serviceToEdit?.direccion || "",
    localidad: serviceToEdit?.localidad || "San Luis",
    barrio: serviceToEdit?.barrio || "",
  });

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("es_activa", true);
      if (data) setCategories(data);
    };
    fetchCats();
  }, [supabase]);

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
      if (!user) throw new Error("Sesión no encontrada");

      if (serviceToEdit) {
        // MODO EDICIÓN
        const { error } = await supabase
          .from("servicios")
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
          .eq("id", serviceToEdit.id);
        if (error) throw error;
      } else {
        // MODO CREACIÓN
        const { data: profile } = await supabase
          .from("perfiles")
          .select("id")
          .eq("usuario_id", user.id)
          .single();

        const { error } = await supabase.from("servicios").insert({
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
    } catch (err: any) {
      console.error("Error saving service:", err);
      alert("Hubo un error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all";
  const labelClass =
    "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {serviceToEdit ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select
            className={inputClass}
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
            <p className="text-red-500 text-xs mt-1 font-bold">
              {errors.categoria_id}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input
            type="text"
            className={inputClass}
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1 font-bold">
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>WhatsApp *</label>
          <input
            type="text"
            className={inputClass}
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass}>Dirección *</label>
          <input
            type="text"
            className={inputClass}
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Descripción *</label>
        <textarea
          rows={3}
          className={inputClass}
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-2 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : serviceToEdit
            ? "Actualizar Servicio"
            : "Publicar Servicio"}
        </button>
      </div>
    </form>
  );
}
