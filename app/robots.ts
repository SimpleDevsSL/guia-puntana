import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://guia-puntana.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/perfil/',      // Área privada de usuario
        '/api/',         // Endpoints de API
        '/auth/',        // Rutas de autenticación
        '/admin/',       // Si tienes panel admin
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}