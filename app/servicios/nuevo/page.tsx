"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/feed/Header";
import { ServiceForm } from "@/components/services/ServiceForm";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GestionServiciosPage() {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchUserServices = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Obtener el ID de perfil
      const { data: profile } = await supabase
        .from("perfiles")
        .select("id")
        .eq("usuario_id", user.id)
        .single();

      if (profile) {
        // 2. Obtener servicios vinculados a ese perfil
        const { data: servicesData } = await supabase
          .from("servicios")
          .select(
            `
            *,
            categorias (nombre)
          `
          )
          .eq("proveedor_id", profile.id)
          .eq("es_activo", true)
          .order("created_at", { ascending: false });

        setServices(servicesData || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserServices();
  }, [fetchUserServices]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;

    try {
      // Borrado lógico (recomendado según tu esquema sql que tiene es_activo)
      const { error } = await supabase
        .from("servicios")
        .update({ es_activo: false })
        .eq("id", id);

      if (error) throw error;
      fetchUserServices();
    } catch (error) {
      alert("Error al eliminar el servicio");
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchUserServices();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Volver al Feed
        </Link>
        {!showForm ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Mis Servicios
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Administra tus publicaciones activas en la guía.
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span> Publicar Nuevo
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : services.length > 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded">
                          {service.categorias?.nombre}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {service.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {service.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-gray-500">
                  Aún no tienes servicios publicados.
                </p>
                <button
                  onClick={handleAddNew}
                  className="text-orange-600 font-bold mt-2 underline"
                >
                  Empieza aquí
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            <ServiceForm
              serviceToEdit={editingService}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </main>
  );
}
