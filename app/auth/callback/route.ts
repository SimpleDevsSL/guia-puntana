import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Por defecto ir al home, pero si la lógica de perfil dice otra cosa, la sobreescribimos
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // 1. Intercambiar código por sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 2. Obtener el usuario autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 3. Verificar existencia del perfil
        const { data: profile } = await supabase
          .from("perfiles")
          .select("id")
          .eq("usuario_id", user.id)
          .single();

        // 4. Lógica de redirección
        if (profile) {
          // Ya tiene perfil -> Home
          return NextResponse.redirect(`${origin}${next}`);
        } else {
          // No tiene perfil -> Completar perfil
          return NextResponse.redirect(`${origin}/completar-perfil`);
        }
      }
    }
  }

  // Si algo falla, volver al login con error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
