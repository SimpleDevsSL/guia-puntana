import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // --- CASO A: USUARIO NO LOGUEADO (Visitante) ---
  if (!user) {
    // Definimos qué rutas son PRIVADAS (solo para miembros)
    // El /feed ya NO está aquí, por lo tanto es público.
    const privatePaths = ["/completar-perfil", "/perfil"];
    const isPrivate = privatePaths.some((p) => path.startsWith(p));

    if (isPrivate) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // --- CASO B: USUARIO LOGUEADO ---
  if (user) {
    const { data: profile } = await supabase
      .from("perfiles")
      .select("id")
      .eq("usuario_id", user.id)
      .single();

    // 1. Sesión iniciada pero SIN perfil creado
    if (!profile) {
      // Forzamos a completar perfil a menos que ya esté en esa ruta
      if (!path.startsWith("/completar-perfil")) {
        return NextResponse.redirect(new URL("/completar-perfil", request.url));
      }
      return supabaseResponse;
    }

    // 2. Sesión iniciada y CON perfil completo
    if (profile) {
      // No debe poder volver a completar perfil o login
      if (path.startsWith("/completar-perfil") || path.startsWith("/login")) {
        return NextResponse.redirect(new URL("/feed", request.url));
      }
      
      // Si intenta entrar a la landing (/), lo mandamos al feed para que vea el contenido
      if (path === "/") {
        return NextResponse.redirect(new URL("/feed", request.url));
      }
    }
  }

  return supabaseResponse;
}