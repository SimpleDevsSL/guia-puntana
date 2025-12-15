import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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

  // 1. Obtener usuario (esto refresca la sesión si es necesario)
  const { data: { user } } = await supabase.auth.getUser()

  // RUTAS PROTEGIDAS Y LÓGICA DE PERFIL
  
  // Si NO está logueado y quiere entrar a una ruta protegida (ej: /completar-perfil o dashboard)
  // Aquí definimos que el home '/' es público, pero '/completar-perfil' requiere auth.
  // Ajusta según tu necesidad. Si '/' debe ser privado, cambia la lógica.
  if (!user && request.nextUrl.pathname.startsWith('/completar-perfil')) {
     return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    // 2. Unica Búsqueda de Perfil para TODOS los métodos de login
    // Solo verificamos si NO estamos ya en la página de completar perfil para evitar bucles
    if (request.nextUrl.pathname !== '/completar-perfil') {
        const { data: profile } = await supabase
        .from('perfiles')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

        // Si NO tiene perfil, forzar redirección
        if (!profile) {
            return NextResponse.redirect(new URL('/completar-perfil', request.url))
        }
    }
    
    // Si YA tiene perfil y trata de entrar a /completar-perfil, mandarlo al home
    if (request.nextUrl.pathname === '/completar-perfil') {
        const { data: profile } = await supabase
        .from('perfiles')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

        if (profile) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
  }

  return supabaseResponse
}