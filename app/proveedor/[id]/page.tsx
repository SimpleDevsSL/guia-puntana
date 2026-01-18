import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from '@/components/feed/Header';
import HeroSection from '@/components/feed/HeroSection';
import ClientFeedLogic from '@/app/feed/ClientFeedLogic';
import ProviderContactButton from '@/components/proveedor/ProviderContactButton';
import { Footer } from '@/components/Footer';
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
                  {contactPhone ? (
                    <ProviderContactButton
                      profileName={profile.nombre_completo}
                      phoneNumber={contactPhone}
                      providerId={profile.id}
                    />
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
            searchLocation={urlParams.l || ''}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
