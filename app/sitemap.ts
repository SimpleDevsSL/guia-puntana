import { MetadataRoute } from 'next';
import { getCachedCategories } from './lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://guia-puntana.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Obtener categorías dinámicas
  const categories = await getCachedCategories();

  // 2. Generar URLs para cada categoría (Prioridad Alta)
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Rutas estáticas clave
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios/nuevo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...categoryUrls];
}