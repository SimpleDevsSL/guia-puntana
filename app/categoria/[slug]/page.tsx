import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCachedCategories } from '@/app/lib/data';
import FeedResults from '@/components/feed/FeedResults';
import FeedSkeleton from '@/components/feed/FeedSkeleton';
import HeroSection from '@/components/feed/HeroSection';
import { Header } from '@/components/feed/Header';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 1. GENERATE STATIC PARAMS: Usamos el slug de la DB
export async function generateStaticParams() {
  const categories = await getCachedCategories();
  // Ahora usamos el slug real de la base de datos
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// 2. METADATA: Buscamos por slug
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCachedCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Categoría no encontrada | Guía Puntana' };
  }

  return {
    title: `${category.nombre} en San Luis | Guía Puntana`,
    description: `Encuentra los mejores ${category.nombre} en San Luis.`,
    openGraph: {
      title: `${category.nombre} en San Luis - Profesionales y Servicios | Guía Puntana`,
      url: `https://guia-puntana.vercel.app/categoria/${category.slug}`,
      // ... resto de OG tags
    },
  };
}

// 3. PÁGINA PRINCIPAL
export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const categories = await getCachedCategories();
  // Búsqueda exacta por slug (mucho más seguro que decodeURIComponent)
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const getStringParam = (param: string | string[] | undefined) => {
    if (Array.isArray(param)) return param[0];
    return param;
  };

  // [!code ++] Extraemos el serviceId de los parámetros
  const serviceId = getStringParam(resolvedSearchParams.service) || null;

  const feedParams = {
    q: getStringParam(resolvedSearchParams.q),
    l: getStringParam(resolvedSearchParams.l),
    cat: currentCategory.nombre, // FeedResults sigue necesitando el nombre o ID para filtrar
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-gray-950">
      <Header />
      <main className="grow pt-16">
        <HeroSection initialQuery="" initialLocation={feedParams.l || ''} />

        {/* Pasamos el slug activo a CategoryList para que sepa cuál resaltar */}

        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<FeedSkeleton />}>
            <FeedResults
              searchParams={feedParams}
              activeCategoryName={currentCategory.nombre}
              categoryId={currentCategory.id}
              serviceId={serviceId} // [!code ++] Pasamos la propiedad faltante
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
