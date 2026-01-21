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
  categoryId?: string | null;
}

const ITEMS_PER_PAGE = 12;

export default async function FeedResults({
  searchParams,
  activeCategoryName,
  categoryId,
}: FeedResultsProps) {
  const supabase = await createClient();

  const categoriaFiltro = categoryId || null;

  // Carga inicial: Solo los primeros ITEMS_PER_PAGE
  const { data: servicesData, error } = await supabase.rpc('buscar_servicios', {
    query_text: searchParams.q || '',
    categoria_filtro: categoriaFiltro,
    loc_filtro: searchParams.l || null,
    limit_val: ITEMS_PER_PAGE, // Límite inicial
    offset_val: 0, // Desde el principio
  }).select(`
      id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
      categoria:categorias(id, nombre),
      proveedor:perfiles(id, nombre_completo, foto_url, insignias)
    `);

  if (error) {
    console.error('Error buscando servicios:', error);
  }
  const services = (servicesData as unknown as ServiceWithProfile[]) || [];

  return (
    <ClientFeedLogic
      initialServices={services}
      activeCategoryName={activeCategoryName}
      searchQuery={searchParams.q || ''}
      searchLocation={searchParams.l || ''}
      categoryId={categoriaFiltro}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}
