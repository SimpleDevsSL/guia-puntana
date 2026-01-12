// app/api/delete-account/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Inicializa Supabase con la SERVICE_ROLE_KEY (solo en servidor)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )

  const { userId } = await request.json()

  // 1. Borrar de la tabla perfiles (esto activará el cascade si lo configuraste)
  const { error: profileError } = await supabaseAdmin
    .from('perfiles')
    .delete()
    .eq('usuario_id', userId)

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // 2. Borrar de Auth (Requiere privilegios de Admin)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

  return NextResponse.json({ message: 'Cuenta eliminada' })
}