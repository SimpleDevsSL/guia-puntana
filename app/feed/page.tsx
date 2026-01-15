import { createClient } from '@/utils/supabase/server';
import HeroSection from '@/components/feed/HeroSection';
import CategoryList from '@/components/feed/CategoryList';
import { Header } from '@/components/feed/Header';
import { ServiceWithProfile, Category } from '../lib/definitions';
import ClientFeedLogic from './ClientFeedLogic';
import { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{
    q?: string; // Búsqueda por texto
    l?: string; // Localidad
    cat?: string; // ID de Categoría
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryName = params.cat ? 'Servicios' : 'Profesionales'; // O busca el nombre real
  return {
    title: `${params.q || categoryName} en San Luis | Guía Puntana`,
    description: `Encuentra los mejores ${params.q || 'profesionales'} en ${params.l || 'San Luis'}.`,
  };
}

export default async function FeedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Obtener categorías para la lista superior (SSR)
  const { data: categoriesData } = await supabase
    .from('categorias')
    .select('id, nombre')
    .eq('es_activa', true)
    .throwOnError();

  const categories = (categoriesData as Category[]) || [];

  const { data: servicesData, error } = await supabase.rpc('buscar_servicios', {
    query_text: params.q || '',
    categoria_filtro: params.cat || null,
    loc_filtro: params.l || null,
  }).select(`
      id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
      categoria:categorias(id, nombre),
      proveedor:perfiles(id, nombre_completo, foto_url, insignias)
    `); // Hacemos el select aquí para traer las relaciones

  if (error) console.error('Error buscando servicios:', error);

  const services = (servicesData as unknown as ServiceWithProfile[]) || [];

  // Determinar el nombre de la categoría activa para el título
  const activeCatName =
    categories.find((c) => c.id === params.cat)?.nombre || 'Todos';

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-gray-950">
      <Header />
      <main className="grow pt-16">
        <HeroSection
          initialQuery={params.q || ''}
          initialLocation={params.l || ''}
        />

        <CategoryList
          categories={categories}
          activeCategoryId={params.cat || null}
        />

        {/* Pasamos los datos del servidor al componente lógico del cliente */}
        <ClientFeedLogic
          services={services}
          activeCategoryName={activeCatName}
          searchQuery={params.q || ''}
        />
      </main>

      <footer className="border-t border-gray-100 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana. Hecho con
          ❤️ en San Luis.
        </p>
      </footer>
    </div>
  );
}
