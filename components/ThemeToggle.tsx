// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  // Eliminamos 'theme' ya que no se usa
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Usamos requestAnimationFrame o simplemente deshabilitamos la regla localmente
    // para este patrón de hidratación específico.
    const handleMount = () => setMounted(true);
    handleMount();
  }, []);

  if (!mounted) {
    return <div className="h-8 w-14" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full border border-gray-300 bg-transparent transition-all duration-300 focus:outline-none dark:border-gray-700"
      aria-label="Cambiar tema"
    >
      <span className="sr-only">Cambiar modo</span>
      <span
        className={`absolute left-1 top-1 flex h-6 w-6 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'} bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900`}
      >
        {isDark ? (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
