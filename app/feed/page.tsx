import { createClient } from "@/utils/supabase/server"; //
import HeroSection from "@/components/feed/HeroSection"; //
import CategoryList from "@/components/feed/CategoryList"; //
import { Header } from "@/components/feed/Header";
import { ServiceWithProfile, Category } from "../lib/definitions"; //
import ClientFeedLogic from "./ClientFeedLogic";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    q?: string; // Búsqueda por texto
    l?: string; // Localidad
    cat?: string; // ID de Categoría
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryName = params.cat ? "Servicios" : "Profesionales"; // O busca el nombre real
  return {
    title: `${params.q || categoryName} en San Luis | Guía Puntana`,
    description: `Encuentra los mejores ${params.q || "profesionales"} en ${params.l || "San Luis"}.`,
  };
}

export default async function FeedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Obtener categorías para la lista superior (SSR)
  const { data: categoriesData } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("es_activa", true)
    .throwOnError(); // Añade manejo de errores simple

  const categories = (categoriesData as Category[]) || [];

  // 2. Construir la consulta de servicios con filtros de URL
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

  if (params.cat) query = query.eq("categoria_id", params.cat);
  if (params.q)
    query = query.or(
      `nombre.ilike.%${params.q}%,descripcion.ilike.%${params.q}%`
    );
  if (params.l) query = query.ilike("localidad", `%${params.l}%`);

  const { data: servicesData } = await query;
  const services = (servicesData as unknown as ServiceWithProfile[]) || [];

  // Determinar el nombre de la categoría activa para el título
  const activeCatName =
    categories.find((c) => c.id === params.cat)?.nombre || "Todos";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans">
      <Header />
      <main className="grow pt-16">
        <HeroSection
          initialQuery={params.q || ""}
          initialLocation={params.l || ""}
        />

        <CategoryList
          categories={categories}
          activeCategoryId={params.cat || null}
        />

        {/* Pasamos los datos del servidor al componente lógico del cliente */}
        <ClientFeedLogic
          services={services}
          activeCategoryName={activeCatName}
          searchQuery={params.q || ""}
        />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana. Hecho con
          ❤️ en San Luis.
        </p>
      </footer>
    </div>
  );
}
