import Link from "next/link";
import { Header } from "@/components/feed/Header"; 

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      <Header /> 

      <main className="grow pt-16">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200 dark:bg-orange-900 rounded-full filter blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900 rounded-full filter blur-[100px] opacity-50 -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 rounded-full border border-orange-100 dark:border-orange-800">
              🌐 La comunidad de servicios de San Luis
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
              Conectá con el <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                talento local
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Desde plomeros en Juana Koslay hasta diseñadores en Merlo. La
              herramienta definitiva para encontrar, contratar y trabajar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 hover:shadow-orange-500/25 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Todo lo que necesitás en un solo lugar
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Una vez dentro, tendrás acceso a herramientas simples y
                potentes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1: Búsqueda Inteligente */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
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
                <h3 className="text-xl font-bold mb-3 dark:text-white">Búsqueda localizada</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Filtrá por localidad o barrio. Encontrá servicios cerca de tu
                  ubicación.
                </p>
              </div>

              {/* Feature 2: Perfiles Completos */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
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
                <h3 className="text-xl font-bold mb-3 dark:text-white">Perfiles Detallados</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Mirá trabajos anteriores, leé descripciones y consultá
                  horarios de atención antes de contactar.
                </p>
              </div>

              {/* Feature 3: Reseñas */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group">
                <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
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
                <h3 className="text-xl font-bold mb-3 dark:text-white">
                  Calificaciones Reales
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Sistema de reputación basado en la comunidad. Opiná sobre tu
                  experiencia y ayudá a otros vecinos.
                </p>
              </div>

              {/* Feature 4: WhatsApp Directo */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Contacto Directo</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Sin intermediarios. Contactá al profesional directamente a su
                  WhatsApp o teléfono con un solo clic.
                </p>
              </div>

              {/* Card Call To Action (Caja invitando al login) */}
              <div className="md:col-span-2 lg:col-span-2 bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-center items-start border border-gray-800 dark:border-gray-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full filter blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    ¿Listo para empezar?
                  </h3>
                  <p className="text-gray-300 mb-8 max-w-lg">
                    Sumate a la plataforma que está modernizando los servicios
                    en San Luis. Es gratis y fácil.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-orange-50 transition-colors"
                  >
                    Crear mi cuenta
                    <svg
                      className="w-4 h-4"
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

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="relative w-8 h-8 opacity-50 mb-4">
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SimpleDevs. Guía Puntana. Hecho
            con ❤️ en San Luis.
          </p>
        </div>
      </footer>
    </div>
  );
}