import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Configuración inicial de la respuesta
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Configuración del cliente Supabase (Manejo robusto de cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Obtener usuario (esto refresca la sesión si es necesario)
  // IMPORTANTE: getUser valida el token de forma segura contra Supabase Auth
  const { data: { user } } = await supabase.auth.getUser()

  // ==========================================
  // LÓGICA DE PROTECCIÓN DE RUTAS Y PERFIL
  // ==========================================

  // --- CASO A: USUARIO NO LOGUEADO ---
  if (!user) {
    // Definimos las rutas que son PRIVADAS
    const protectedPaths = ['/feed', '/completar-perfil'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // Si intenta entrar a una ruta privada sin sesión, lo mandamos a la Landing Page (/)
    if (isProtected) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Si no es protegida (ej: /, /login), dejamos pasar
    return supabaseResponse;
  }

  // --- CASO B: USUARIO LOGUEADO ---
  if (user) {
    // 4. Verificamos si ya completó su perfil en la base de datos
    const { data: profile } = await supabase
      .from('perfiles')
      .select('id')
      .eq('usuario_id', user.id)
      .single()

    // ESCENARIO 1: TIENE SESIÓN PERO NO TIENE PERFIL
    // Debe completar el perfil obligatoriamente antes de usar la app.
    if (!profile) {
      // Si NO está en /completar-perfil, lo forzamos a ir allí
      if (!request.nextUrl.pathname.startsWith('/completar-perfil')) {
        return NextResponse.redirect(new URL('/completar-perfil', request.url))
      }
      // Si ya está en /completar-perfil, permitimos el acceso para que llene el formulario
      return supabaseResponse;
    }

    // ESCENARIO 2: YA TIENE PERFIL COMPLETO (Usuario activo normal)
    if (profile) {
      // No tiene sentido que vuelva a /completar-perfil
      if (request.nextUrl.pathname.startsWith('/completar-perfil')) {
        return NextResponse.redirect(new URL('/feed', request.url))
      }

      // No tiene sentido que vaya a /login si ya está autenticado
      if (request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/feed', request.url))
      }
      
      // Aquí el usuario puede navegar libremente al /feed u otras rutas protegidas
    }
  }

  return supabaseResponse
}