// Archivo: src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Bienvenido a Guía Puntana
      </h1>
      
      <p className="text-gray-600">
        Encontra servicios locales o publica el tuyo.
      </p>

      {}
      <Link 
        href="/acceder" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ingresar / Registrarse
      </Link>
    </main>
  )
}