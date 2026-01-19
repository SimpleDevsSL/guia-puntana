import { createClient } from '@/utils/supabase/server';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://guia-puntana.vercel.app';

  // 1. Obtener perfiles y categorías en paralelo para mejorar performance
  const [profilesResult, categoriesResult] = await Promise.all([
    supabase.from('perfiles').select('id, updated_at'),
    supabase
      .from('categorias')
      .select('nombre, updated_at')
      .eq('es_activa', true), // Solo categorías activas
  ]);

  const profiles = profilesResult.data || [];
  const categories = categoriesResult.data || [];

  // 2. Generar URLs para cada Perfil de Proveedor
  const providerUrls = profiles.map((p) => ({
    url: `${baseUrl}/proveedor/${p.id}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Generar URLs para cada Categoría
  // Apuntan al feed filtrado por el nombre de la categoría (query param 'cat')
  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/feed?cat=${encodeURIComponent(c.nombre)}`,
    lastModified: new Date(c.updated_at || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 4. Retornar el sitemap completo
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...providerUrls,
  ];
}
