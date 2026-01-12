"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("perfiles")
          .select("rol")
          .eq("usuario_id", user.id)
          .single();
        setUserRole(profile?.rol || null);
      }
    };
    getUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === "SIGNED_OUT") {
        setUser(null);
        setUserRole(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.refresh();
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Lado Izquierdo: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/feed" className="flex items-center gap-2 sm:gap-3">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 dark:text-white" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Guía <span className="text-orange-600">Puntana</span>
            </span>
          </Link>
        </div>

        {/* Lado Derecho: Acciones */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-1 sm:gap-3">
              
              {/* Botón Nuevo Servicio (Solo si es proveedor) */}
              {userRole === 'proveedor' && (
                <Link
                  href="/servicios/nuevo"
                  className="bg-orange-600 hover:bg-orange-700 text-white p-2 sm:px-4 sm:py-2 rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2"
                  title="Nuevo Servicio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Nuevo Servicio</span>
                </Link>
              )}

              {/* Botón Ver Perfil */}
              <Link
                href="/perfil"
                className="p-2 sm:px-5 sm:py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-orange-600 rounded-full hover:bg-orange-500 transition-colors shadow-lg flex items-center gap-2"
                title="Ver mi perfil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span className="hidden sm:inline">Ver mi perfil</span>
              </Link>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="p-2 sm:px-3 sm:py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                </span>
              </button>

            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-orange-600 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};