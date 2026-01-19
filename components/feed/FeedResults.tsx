import { createClient } from '@/utils/supabase/server';
import ClientFeedLogic from '@/app/feed/ClientFeedLogic';
import { ServiceWithProfile } from '@/app/lib/definitions';

interface FeedResultsProps {
  searchParams: {
    q?: string;
    l?: string;
    cat?: string;
  };
  activeCategoryName: string;
}

export default async function FeedResults({
  searchParams,
  activeCategoryName,
}: FeedResultsProps) {
  const supabase = await createClient();

  // Esta es la consulta que puede tardar un poco
  const { data: servicesData, error } = await supabase.rpc('buscar_servicios', {
    query_text: searchParams.q || '',
    categoria_filtro: searchParams.cat || null,
    loc_filtro: searchParams.l || null,
  }).select(`
      id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
      categoria:categorias(id, nombre),
      proveedor:perfiles(id, nombre_completo, foto_url, insignias)
    `);

  if (error) {
    console.error('Error buscando servicios:', error);
    // Podrías retornar un componente de error visual aquí si quisieras
  }

  const services = (servicesData as unknown as ServiceWithProfile[]) || [];

  // Retornamos la lógica cliente que ya tenías, pero ahora con datos cargados
  return (
    <ClientFeedLogic
      services={services}
      activeCategoryName={activeCategoryName}
      searchQuery={searchParams.q || ''}
      searchLocation={searchParams.l || ''}
    />
  );
}
