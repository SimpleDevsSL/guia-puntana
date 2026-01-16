import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from '@/components/feed/Header';
import HeroSection from '@/components/feed/HeroSection';
import ClientFeedLogic from '@/app/feed/ClientFeedLogic';
import { ServiceWithProfile, Category } from '@/app/lib/definitions';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    l?: string;
    cat?: string;
  }>;
}

// Función auxiliar para obtener iniciales
const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('perfiles')
    .select('nombre_completo')
    .eq('id', id)
    .single();

  return {
    title: `${profile?.nombre_completo || 'Proveedor'} | Guía Puntana`,
    description: `Descubre los servicios ofrecidos por ${profile?.nombre_completo || 'este profesional'} en San Luis.`,
  };
}

export default async function ProviderPage({
  params,
  searchParams,
}: PageProps) {
  const { id: providerId } = await params;
  const urlParams = await searchParams;
  const supabase = await createClient();

  // 1. Obtener datos del Perfil del Proveedor
  const { data: profile, error: profileError } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, foto_url, insignias, rol')
    .eq('id', providerId)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  // 2. Obtener categorías
  const { data: categoriesData } = await supabase
    .from('categorias')
    .select('id, nombre')
    .eq('es_activa', true);
  const categories = (categoriesData as Category[]) || [];

  // 3. Construir query de Servicios
  let query = supabase
    .from('servicios')
    .select(
      `
      id, nombre, descripcion, localidad, barrio, direccion, telefono, redes,
      categoria:categorias(id, nombre),
      proveedor:perfiles(id, nombre_completo, foto_url, insignias)
    `
    )
    .eq('proveedor_id', providerId)
    .eq('es_activo', true)
    .eq('estado', true);

  if (urlParams.q) {
    query = query.or(
      `nombre.ilike.%${urlParams.q}%,descripcion.ilike.%${urlParams.q}%`
    );
  }
  if (urlParams.l) {
    query = query.ilike('localidad', `%${urlParams.l}%`);
  }
  if (urlParams.cat) {
    query = query.eq('categoria_id', urlParams.cat);
  }

  const { data: servicesData } = await query;
  const services = (servicesData as unknown as ServiceWithProfile[]) || [];

  const contactPhone = services.find((s) => s.telefono)?.telefono || null;
  const activeCatName =
    categories.find((c) => c.id === urlParams.cat)?.nombre ||
    'Servicios del Proveedor';

  // --- LÓGICA DEL MENSAJE DE WHATSAPP ---
  const whatsappMessage = `Hola ${profile.nombre_completo}, vi tu perfil en Guía Puntana y quisiera hacerte una consulta.`;
  const whatsappLink = contactPhone
    ? `https://wa.me/${contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    : null;
  // -------------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans dark:bg-gray-950">
      <Header />

      <main className="grow pt-16">
        {/* --- Cabecera del Proveedor --- */}
        <section className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800">
                {profile.foto_url ? (
                  <Image
                    src={profile.foto_url}
                    alt={profile.nombre_completo}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-orange-100 text-4xl font-extrabold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    {getInitials(profile.nombre_completo)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.nombre_completo}
                  </h1>
                  {profile.insignias && profile.insignias.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Verificado
                    </span>
                  )}
                </div>

                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                  Proveedor de servicios en Guía Puntana
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  {whatsappLink ? (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white shadow-sm transition hover:bg-green-700"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Contactar por WhatsApp
                    </a>
                  ) : (
                    <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm italic text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      Contacto disponible en los detalles del servicio
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Sección de Buscador y Resultados --- */}
        <div className="bg-slate-50 dark:bg-gray-950">
          <HeroSection
            initialQuery={urlParams.q || ''}
            initialLocation={urlParams.l || ''}
            basePath={`/proveedor/${providerId}`}
          />

          <ClientFeedLogic
            services={services}
            activeCategoryName={activeCatName}
            searchQuery={urlParams.q || ''}
          />
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana.
        </p>
      </footer>
    </div>
  );
}
