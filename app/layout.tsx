import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import InstallPrompt from '@/components/pwa/InstallPrompt';

const inter = Inter({ subsets: ['latin'] });

// URL base segura (usa variable de entorno o fallback a producción)
const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guiapuntana.com.ar'
).replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Guía Puntana | Servicios en San Luis',
    template: '%s | Guía Puntana',
  },
  description:
    'Conectá con emprendedores y servicios locales de San Luis de forma directa y gratuita. Plomeros, electricistas y más.',

  // Metadatos de Autoridad
  applicationName: 'Guía Puntana',
  authors: [{ name: 'SimpleDevs' }],
  creator: 'SimpleDevs',

  keywords: [
    'San Luis',
    'Servicios',
    'Oficios',
    'Plomeros',
    'Electricistas',
    'Guía',
    'Puntana',
    'Juana Koslay',
    'Potrero de los Funes',
    'Profesionales',
  ],

  // Open Graph optimizado
  openGraph: {
    title: 'Guía Puntana',
    description: 'La comunidad de servicios y emprendimientos de San Luis.',
    url: BASE_URL,
    siteName: 'Guía Puntana',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Guía Puntana - Servicios en San Luis',
      },
    ],
  },

  // Directivas para Robots (Nuevo)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Guía Puntana',
    startupImage: [
      {
        url: '/apple-touch-icon.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },

  verification: {
    google: 'sE7JCuCEWydZKmldgZq6IYfndWKi-00hVJB5_RnoQGw',
  },

  icons: {
    // Dale prioridad al PNG para que Google lo tome para los resultados
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/faviconn.ico' }, // Fallback
    ],
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
    // Opcional: define explícitamente el de Google si quieres asegurar
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon-192x192.png',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-gray-900 antialiased transition-colors duration-300 ease-in-out dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <InstallPrompt />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
