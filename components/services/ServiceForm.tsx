"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { serviceSchema } from "@/components/profile/form-schema";

export function ServiceForm() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    categoria_id: "",
    nombre: "",
    descripcion: "",
    telefono: "",
    direccion: "",
    localidad: "San Luis",
    barrio: "",
  });

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from("categorias").select("id, nombre").eq("es_activa", true);
      if (data) setCategories(data);
    };
    fetchCats();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validar con Zod
    const validation = serviceSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach(i => (newErrors[i.path[0].toString()] = i.message));
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no encontrada");

      const { data: profile } = await supabase
        .from("perfiles")
        .select("id")
        .eq("usuario_id", user.id)
        .single();

      const { error: insertError } = await supabase.from("servicios").insert({
        proveedor_id: profile?.id,
        categoria_id: formData.categoria_id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        telefono: formData.telefono || null,
        direccion: formData.direccion,
        localidad: formData.localidad,
        barrio: formData.barrio || null,
        created_by: user.id,
      });

      if (insertError) throw insertError;
      router.push("/feed");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all";
  const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select 
            className={inputClass}
            value={formData.categoria_id}
            onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {errors.categoria_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.categoria_id}</p>}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input 
            type="text" 
            className={inputClass} 
            placeholder="Ej: Plomería y Gasista Matriculado"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1 font-bold">{errors.nombre}</p>}
        </div>

       <div>
  <label className={labelClass}>WhatsApp de contacto *</label>
  <input 
    type="text" 
    className={inputClass} 
    placeholder="+54 266 4000000"
    value={formData.telefono}
    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
  />
  {errors.telefono && (
    <p className="text-red-500 text-xs mt-1 font-bold">{errors.telefono}</p>
  )}
</div>

        <div>
          <label className={labelClass}>Dirección *</label>
          <input 
            type="text" 
            className={inputClass} 
            placeholder="Calle y N°"
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
          />
          {errors.direccion && <p className="text-red-500 text-xs mt-1 font-bold">{errors.direccion}</p>}
        </div>
        {/* ------------------------- */}

        <div>
          <label className={labelClass}>Localidad *</label>
          <input 
            type="text" 
            className={inputClass} 
            value={formData.localidad}
            onChange={(e) => setFormData({...formData, localidad: e.target.value})}
          />
        </div>

        <div>
          <label className={labelClass}>Barrio (Opcional)</label>
          <input 
            type="text" 
            className={inputClass} 
            placeholder="Ej: Barrio Los Venados"
            value={formData.barrio}
            onChange={(e) => setFormData({...formData, barrio: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Descripción detallada *</label>
        <textarea 
          rows={3} 
          className={inputClass} 
          placeholder="Cuéntanos sobre tu trabajo, horarios y experiencia..."
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />
        {errors.descripcion && <p className="text-red-500 text-xs mt-1 font-bold">{errors.descripcion}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar Servicio Ahora"}
      </button>
    </form>
  );
}