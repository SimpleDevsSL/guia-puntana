import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Crear el cliente de Supabase con la sesión del usuario
  const supabase = await createClient();

  // 2. Obtener el usuario autenticado desde la sesión (no del body)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { userId } = await request.json();

  // 3. VALIDACIÓN CRÍTICA: Comparar el ID del usuario con el que se quiere borrar
  if (user.id !== userId) {
    return NextResponse.json(
      { error: "Prohibido: No puedes borrar otras cuentas" },
      { status: 403 }
    );
  }

  // 4. Solo si es el dueño, usamos la Service Role Key para borrar de Auth
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Borrar datos del perfil (el RLS debería permitirlo si el usuario es el dueño)
  const { error: profileError } = await supabaseAdmin
    .from("perfiles")
    .delete()
    .eq("usuario_id", userId);

  if (profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 });

  // Borrar de la autenticación de Supabase
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ message: "Cuenta eliminada con éxito" });
}
