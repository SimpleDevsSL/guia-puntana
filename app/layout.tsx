import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider" 
import "./globals.css";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guía Puntana",
  description: "Tu guía de San Luis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className={`
          ${inter.className} 
          antialiased
          bg-white text-slate-900 
          dark:bg-slate-950 dark:text-slate-100 
          transition-colors duration-300 ease-in-out
        `}
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