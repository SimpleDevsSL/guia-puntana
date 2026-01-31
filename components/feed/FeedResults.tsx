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
  serviceId: string | null; // Recibimos el ID
}

const ITEMS_PER_PAGE = 12;

export default async function FeedResults({
  searchParams,
  activeCategoryName,
  categoryId,
  serviceId, // [!code ++] IMPORTANTE: Destructurar esta prop
}: FeedResultsProps) {
  const supabase = await createClient();

  const categoriaFiltro = categoryId || null;

  // 1. Carga inicial estándar
  const { data: servicesData, error } = await supabase.rpc('buscar_servicios', {
    query_text: searchParams.q || '',
    categoria_filtro: categoriaFiltro,
    loc_filtro: searchParams.l || null,
    limit_val: ITEMS_PER_PAGE,
    offset_val: 0,
  }).select(`
      id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
      categoria:categorias(id, nombre),
      proveedor:perfiles(id, nombre_completo, foto_url, insignias)
    `);

  if (error) {
    console.error('Error buscando servicios:', error);
  }

  let services = (servicesData as unknown as ServiceWithProfile[]) || [];

  // 2. [CORRECCIÓN CLAVE] Lógica de "Deep Linking"
  // Si hay un serviceId en la URL, asegurarnos de que ese servicio esté en la lista.
  // Si no está (ej: está en la página 5), lo buscamos individualmente.
  if (serviceId && !services.find((s) => s.id === serviceId)) {
    const { data: specificService } = await supabase
      .from('servicios')
      .select(
        `
          id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
          categoria:categorias(id, nombre),
          proveedor:perfiles(id, nombre_completo, foto_url, insignias)
       `
      )
      .eq('id', serviceId)
      .single();

    if (specificService) {
      // Lo agregamos al principio de la lista para que ClientFeedLogic lo encuentre inmediatamente
      services = [
        specificService as unknown as ServiceWithProfile,
        ...services,
      ];
    }
  }

  // Agregamos 's' a la key para forzar re-render si cambia el servicio en la URL
  const filterKey = JSON.stringify({
    q: searchParams.q,
    l: searchParams.l,
    c: categoriaFiltro,
    s: serviceId,
  });

  return (
    <ClientFeedLogic
      key={filterKey}
      initialServices={services}
      activeCategoryName={activeCategoryName}
      searchQuery={searchParams.q || ''}
      searchLocation={searchParams.l || ''}
      categoryId={categoriaFiltro}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}
