'use client';

import React, { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { DonateModal } from '@/components/DonateModal';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut, Plus, Heart } from 'lucide-react';

/**
 * Header component for the main feed page.
 *
 * Displays:
 * - Application logo and branding
 * - Theme toggle button
 * - Conditional navigation based on authentication state
 * - User menu (profile, my services for providers, logout)
 * - Loading skeleton while authentication state is being determined
 * - Mobile hamburger menu for better navigation
 *
 * Features:
 * - Responsive design (mobile and desktop)
 * - Dark mode support
 * - Real-time auth state subscription
 * - Role-based UI rendering (provider-specific actions)
 * - Improved mobile navigation with hamburger menu
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
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
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

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {/* Donate Button - Desktop */}
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className={`${buttonStyle} gap-2 px-4 py-2`}
            title="Apoyar el proyecto"
          >
            <Heart className="h-4 w-4" />
            <span>Donar</span>
          </button>

          {/* Conditional rendering based on loading state */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Provider-only action: Create new service */}
              {userRole === 'proveedor' && (
                <Link
                  href="/servicios/nuevo"
                  className={`${buttonStyle} gap-2 px-4 py-2`}
                  title="Nuevo Servicio"
                >
                  <Plus className="h-5 w-5" />
                  <span>Mis Servicios</span>
                </Link>
              )}

              {/* Profile link */}
              <Link
                href="/perfil"
                className={`${buttonStyle} gap-2 px-4 py-2`}
                title="Ver mi perfil"
                aria-label="Ver mi perfil"
              >
                <UserIcon className="h-5 w-5" />
                <span>Perfil</span>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className={`${buttonStyle} gap-2 px-4 py-2`}
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className={`${buttonStyle} px-6 py-2`}>
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full p-2 text-gray-900 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            aria-label="Menú"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-4">
            {/* Donate Button - Mobile */}
            <button
              onClick={() => {
                setIsDonateModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className={`${buttonStyle} w-full gap-2 px-4 py-3`}
            >
              <Heart className="h-5 w-5" />
              <span>Donar</span>
            </button>

            {isLoading ? (
              <div className="h-12 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
            ) : user ? (
              <>
                {/* Provider-only action: Create new service */}
                {userRole === 'proveedor' && (
                  <Link
                    href="/servicios/nuevo"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${buttonStyle} w-full gap-2 px-4 py-3`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Mis Servicios</span>
                  </Link>
                )}

                {/* Profile link */}
                <Link
                  href="/perfil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${buttonStyle} w-full gap-2 px-4 py-3`}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Ver mi perfil</span>
                </Link>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className={`${buttonStyle} w-full gap-2 px-4 py-3`}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${buttonStyle} w-full px-6 py-3`}
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </header>
  );
};
