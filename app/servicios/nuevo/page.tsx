'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/feed/Header';
import { ServiceForm } from '@/components/services/ServiceForm';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ServiceWithProfile } from '@/app/lib/definitions';

export default function GestionServiciosPage() {
  const supabase = createClient();
  const [services, setServices] = useState<ServiceWithProfile[]>([]);
  const [editingService, setEditingService] =
    useState<ServiceWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchUserServices = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Obtener el ID de perfil
      const { data: profile } = await supabase
        .from('perfiles')
        .select('id')
        .eq('usuario_id', user.id)
        .single();

      if (profile) {
        // 2. Obtener servicios vinculados a ese perfil
        const { data: servicesData } = await supabase
          .from('servicios')
          .select(
            `
            *,
            categoria:categorias (
              id, 
              nombre
            )
          `
          )
          .eq('proveedor_id', profile.id)
          .eq('es_activo', true)
          .order('created_at', { ascending: false });

        setServices(servicesData || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserServices();
  }, [fetchUserServices]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) return;

    try {
      // Borrado lógico (recomendado según tu esquema sql que tiene es_activo)
      const { error } = await supabase
        .from('servicios')
        .update({ es_activo: false })
        .eq('id', id);

      if (error) throw error;
      fetchUserServices();
    } catch {
      alert('Error al eliminar el servicio');
    }
  };

  const handleEdit = (service: ServiceWithProfile) => {
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
    <main className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <Header />

      <div className="mx-auto max-w-4xl px-4 pb-12 pt-24">
        <Link
          href="/feed"
          className="mb-6 inline-flex items-center gap-2 font-medium text-gray-500 transition-colors hover:text-orange-600"
        >
          <ArrowLeft size={20} /> Volver al Feed
        </Link>
        {!showForm ? (
          <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:bg-orange-700 active:scale-95"
              >
                <span className="text-xl">+</span> Publicar Nuevo
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600"></div>
              </div>
            ) : services.length > 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 md:flex-row"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:bg-orange-900/30">
                          {service.categoria?.nombre}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {service.nombre}
                      </h3>
                      <p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                        {service.descripcion}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:flex-none"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 md:flex-none"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-gray-500">
                  Aún no tienes servicios publicados.
                </p>
                <button
                  onClick={handleAddNew}
                  className="mt-2 font-bold text-orange-600 underline"
                >
                  Empieza aquí
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl">
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
