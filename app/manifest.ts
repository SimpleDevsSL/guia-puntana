// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Guía Puntana',
    short_name: 'Guía Puntana',
    description: 'Conectando servicios locales en San Luis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ea580c', // Un color naranja acorde a tu marca
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    // Opcional: Agrega screenshots para que la instalación se vea "Pro" en Android
    /* screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
      }
    ] 
    */
  };
}
