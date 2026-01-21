import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import InstallPrompt from '@/components/pwa/InstallPrompt';

const inter = Inter({ subsets: ['latin'] });

// URL base segura (usa variable de entorno o fallback a producción)
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://guia-puntana.vercel.app';

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
    statusBarStyle: 'default',
    title: 'Guía Puntana',
  },
  formatDetection: {
    telephone: false,
  },

  verification: {
    google: 'sE7JCuCEWydZKmldgZq6IYfndWKi-00hVJB5_RnoQGw',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
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
