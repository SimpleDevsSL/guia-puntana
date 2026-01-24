import { createClient } from '@/utils/supabase/server';
import { ServiceWithProfile } from '@/app/lib/definitions';
import GestionServiciosClient from '@/components/services/GestionServiciosClient';
import { redirect } from 'next/navigation';

/**
 * Server Component: Fetches user services on the server before rendering
 * This eliminates the loading spinner and provides instant content display
 */
export default async function GestionServiciosPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('perfiles')
    .select('id')
    .eq('usuario_id', user.id)
    .single();

  let initialServices: ServiceWithProfile[] = [];

  // Fetch user services if profile exists
  if (profile) {
    const { data: servicesData } = await supabase
      .from('servicios')
      .select(
        `
        *,
        categoria:categorias (
          id, 
          nombre
        )
      `
      )
      .eq('proveedor_id', profile.id)
      .eq('es_activo', true)
      .order('created_at', { ascending: false });

    initialServices = servicesData || [];
  }

  // Pass server-fetched data to client component
  return <GestionServiciosClient initialServices={initialServices} />;
}
