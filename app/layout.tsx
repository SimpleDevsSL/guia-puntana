import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import InstallPrompt from '@/components/pwa/InstallPrompt';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://guiapuntana.vercel.app'),

  title: {
    default: 'Guía Puntana | Servicios en San Luis',
    template: '%s | Guía Puntana',
  },
  description:
    'Conectá con emprendedores y servicios locales de San Luis de forma directa y gratuita.',

  // 2. Palabras clave para San Luis
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
  ],

  // 3. Open Graph (Cómo se ve en Facebook/WhatsApp)
  openGraph: {
    title: 'Guía Puntana',
    description: 'La comunidad de servicios y emprendimientos de San Luis.',
    url: 'https://guiapuntana.com',
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

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Guía Puntana',
  },
  formatDetection: {
    telephone: false,
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
        {/* Enlace opcional para iconos de Apple */}
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
