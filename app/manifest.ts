// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Guía Puntana - Servicios en San Luis',
    short_name: 'Guía Puntana',
    description:
      'Conectá con emprendedores y servicios locales de San Luis de forma directa y gratuita.',
    start_url: '/feed',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#ea580c', // Color naranja acorde a la marca
    categories: ['business', 'lifestyle', 'utilities'],
    lang: 'es-AR',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    // Opcional: Agrega screenshots para que la instalación se vea "Pro" en Android
    /* screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
      }
    ] */
  };
}
