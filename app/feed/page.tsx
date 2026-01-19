import { createClient } from '@/utils/supabase/server';
import HeroSection from '@/components/feed/HeroSection';
import CategoryList from '@/components/feed/CategoryList';
import { Header } from '@/components/feed/Header';
import { Category } from '../lib/definitions';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FeedResults from '@/components/feed/FeedResults';
import FeedSkeleton from '@/components/feed/FeedSkeleton';

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

  // Determinar el nombre de la categoría para pasar al componente hijo
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

        {/* Streaming Boundary: El usuario ve todo lo de arriba mientras esto carga */}
        <Suspense fallback={<FeedSkeleton />}>
          <FeedResults
            searchParams={params}
            activeCategoryName={activeCatName}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
