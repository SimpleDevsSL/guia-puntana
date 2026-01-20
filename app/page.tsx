import Link from 'next/link';
import { Header } from '@/components/feed/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  const baseUrl = 'https://guia-puntana.vercel.app';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Guía Puntana',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      // CORRECCIÓN: El target debe coincidir con tu dominio actual
      target: `${baseUrl}/feed?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    description:
      'Directorio de servicios y oficios en la provincia de San Luis, Argentina.',
    areaServed: {
      '@type': 'State',
      name: 'San Luis',
    },
  };

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-20 dark:opacity-10">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-200 opacity-50 blur-[100px] filter dark:bg-orange-900"></div>
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-100 opacity-50 blur-[100px] filter dark:bg-blue-900"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="mb-6 inline-block rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              🌐 La comunidad de servicios y emprendimientos de San Luis
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-7xl">
              Conectá con el <br />
              <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                talento local
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Desde plomeros en Juana Koslay hasta diseñadores en Merlo. La
              herramienta definitiva para encontrar, contratar y trabajar.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/feed"
                className="w-full transform rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-500/25 sm:w-auto"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20 transition-colors dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Todo lo que necesitás en un solo lugar
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">
                  Búsqueda localizada
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Filtrá por localidad o barrio. Encontrá servicios cerca de tu
                  ubicación.
                </p>
              </div>

              <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">
                  Perfiles Detallados
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Lee descripciones y consultá horarios de atención antes de
                  contactar.
                </p>
              </div>

              <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 transition-transform group-hover:scale-110 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">
                  Calificaciones Reales
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Sistema de reputación basado en la comunidad de vecinos.
                </p>
              </div>

              {/* Card Call To Action */}
              <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 p-8 dark:border-gray-700 dark:bg-gray-800 sm:p-12 md:col-span-2 md:flex-row lg:col-span-3">
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-500 opacity-20 blur-[80px] filter"></div>
                <div className="relative z-10 max-w-xl text-center md:text-left">
                  <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                    ¿Listo para empezar?
                  </h3>
                  <p className="mb-0 text-gray-300">
                    Sumate a la plataforma que está modernizando los servicios
                    en San Luis. Es gratis y fácil.
                  </p>
                </div>
                <div className="relative z-10 mt-8 md:mt-0">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-gray-900 shadow-lg transition-colors hover:bg-orange-50"
                  >
                    Crear mi cuenta
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
