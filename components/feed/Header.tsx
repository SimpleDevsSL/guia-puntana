'use client';

import React, { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

/**
 * Header component for the main feed page.
 *
 * Displays:
 * - Application logo and branding
 * - Theme toggle button
 * - Conditional navigation based on authentication state
 * - User menu (profile, my services for providers, logout)
 * - Loading skeleton while authentication state is being determined
 *
 * Features:
 * - Responsive design (mobile and desktop)
 * - Dark mode support
 * - Real-time auth state subscription
 * - Role-based UI rendering (provider-specific actions)
 *
 * @component
 * @returns {React.ReactElement} A sticky header with navigation
 *
 * @example
 * <Header />
 */
export const Header: React.FC = () => {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  // User role from profile (user | proveedor)
  const [userRole, setUserRole] = useState<string | null>(null);
  // Loading state while fetching initial auth data
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  /**
   * Initializes user data and sets up auth state listener.
   * Fetches current user from Supabase and loads their profile role.
   */
  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          const { data: profile } = await supabase
            .from('perfiles')
            .select('rol')
            .eq('usuario_id', user.id)
            .single();
          setUserRole(profile?.rol || null);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  /**
   * Handles user logout by signing out from Supabase,
   * clearing local state, and redirecting to home page.
   *
   * @async
   * @throws {Error} If sign out fails (logged to console)
   */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.refresh();
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const buttonStyle =
    'bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-md rounded-full text-sm font-bold flex items-center justify-center gap-2 touch-manipulation min-h-[44px] min-w-[44px]';

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Logo and branding */}
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-2 sm:gap-3">
            <Logo className="h-8 w-8 text-gray-900 dark:text-white sm:h-10 sm:w-10" />
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
              Guía <span className="text-orange-600">Puntana</span>
            </span>
          </Link>
        </div>

        {/* Right side: Theme toggle and auth actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {/* Conditional rendering based on loading state */}
          {isLoading ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800 sm:w-32"></div>
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Provider-only action: Create new service */}
              {userRole === 'proveedor' && (
                <Link
                  href="/servicios/nuevo"
                  className={`${buttonStyle} p-2 sm:px-4 sm:py-2`}
                  title="Nuevo Servicio"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden md:inline">Mis Servicios</span>
                </Link>
              )}

              {/* Profile link */}
              <Link
                href="/perfil"
                className={`${buttonStyle} p-3 sm:px-5 sm:py-2`}
                title="Ver mi perfil"
                aria-label="Ver mi perfil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span className="hidden sm:inline">Ver mi perfil</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className={`${buttonStyle} p-2 font-bold sm:px-4 sm:py-2`}
                title="Cerrar Sesión"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link href="/login" className={`${buttonStyle} px-6 py-2`}>
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
