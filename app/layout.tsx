import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guía Puntana',
  description: 'Tu guía de San Luis',
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
        className={`${inter.className} bg-white text-slate-900 antialiased transition-colors duration-300 ease-in-out dark:bg-slate-950 dark:text-slate-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
