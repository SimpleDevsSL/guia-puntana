import { MetadataRoute } from 'next';

import { getCachedCategories, getAllProvidersForSitemap } from './lib/data';

export const revalidate = 86400;

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://guia-puntana.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener datos en paralelo para que sea más rápido
  const [categories, providers] = await Promise.all([
    getCachedCategories(),
    getAllProvidersForSitemap(),
  ]);

  // URLs de Categorías (Prioridad Alta - 0.8)
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // URLs de Proveedores (Prioridad Media/Alta - 0.7)
  const providerUrls: MetadataRoute.Sitemap = providers.map((provider) => ({
    url: `${BASE_URL}/proveedor/${provider.id}`,
    // Si tienes fecha de actualización, úsala; si no, la fecha actual
    lastModified: provider.updated_at
      ? new Date(provider.updated_at)
      : new Date(),
    changeFrequency: 'weekly', // Los perfiles no cambian a diario usualmente
    priority: 0.7,
  }));

  // Rutas estáticas clave
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


  return [...staticRoutes, ...categoryUrls, ...providerUrls];
}
