"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Verificar sesión actual al cargar
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Escuchar cambios en la autenticación (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 dark:text-white" />

          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Guía Puntana
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            // Si hay usuario (sesión activa), mostramos "Ver mi perfil"
            <Link
              href="/completar-perfil"
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-orange-600 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
            >
              Ver mi perfil
            </Link>
          ) : (
            // Si NO hay usuario, mostramos "Ingresar"
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
