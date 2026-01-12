"use client";

import React, { useState, useEffect, useCallback } from "react";
import HeroSection from "../../components/feed/HeroSection";
import CategoryList from "../../components/feed/CategoryList";
import ResultsGrid from "../../components/feed/ResultsGrid";
import { Header } from "../../components/feed/Header";
import { ServiceWithProfile, Category } from "../lib/definitions";
import { createClient } from "@/utils/supabase/client";
import ServiceDetailModal from "@/components/feed/ServiceDetailModal";

const FeedPage: React.FC = () => {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [services, setServices] = useState<ServiceWithProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConnectModal, setShowConnectModal] =
    useState<ServiceWithProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<ServiceWithProfile | null>(null);

  // Obtener categorías desde DB
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

  // Consulta principal (Producción)
  const handleSearch = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("servicios")
      .select(
        `
        id, nombre, descripcion, localidad, barrio, telefono,
        categoria:categorias(id, nombre),
        proveedor:perfiles(id, nombre_completo, foto_url, insignias)
      `
      )
      .eq("es_activo", true);

    // Filtro por categoría
    if (activeCategoryId) {
      query = query.eq("categoria_id", activeCategoryId);
    }

    // Filtro por texto (Nombre o Descripción)
    if (searchQuery) {
      query = query.or(
        `nombre.ilike.%${searchQuery}%,descripcion.ilike.%${searchQuery}%`
      );
    }

    if (locationQuery) {
      query = query.ilike("localidad", `%${locationQuery}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setServices(data as unknown as ServiceWithProfile[]);
    }
    setLoading(false);
  }, [activeCategoryId, searchQuery, locationQuery, supabase]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans transition-colors">
      <Header />
      <main className="grow pt-16">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          onSearch={handleSearch}
        />
        <CategoryList
          categories={categories}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
        />
        <ResultsGrid
          loading={loading}
          services={services}
          activeCategoryName={
            categories.find((c) => c.id === activeCategoryId)?.nombre || "Todos"
          }
          searchQuery={searchQuery}
          onConnect={setShowConnectModal}
          onViewDetail={setShowDetailModal}
          onRetry={() => {
            setActiveCategoryId(null);
            setSearchQuery("");
          }}
        />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana. Hecho
            con ❤️ en San Luis.
          </p>
        </div>
      </footer>

      {/* Modal de Detalle */}
{showDetailModal && (
  <ServiceDetailModal
    service={showDetailModal}
    onClose={() => setShowDetailModal(null)}
    onContact={(s) => {
      setShowDetailModal(null);
      setShowConnectModal(s);
    }}
  />
)}

      {/* Modal de Contacto */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Contactar a {showConnectModal.proveedor.nombre_completo}
            </h3>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <b>Ubicación:</b> {showConnectModal.localidad}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <b>Servicio:</b> {showConnectModal.nombre}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectModal(null)}
                className="flex-1 py-3 border dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${showConnectModal.telefono}`,
                    "_blank"
                  )
                }
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
