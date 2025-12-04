import ProfileForm from "@/components/profile/ProfileForm"

/**
 * Página Completar Perfil
 * Ruta: /completar-perfil
 * Muestra el formulario para crear el perfil inicial del usuario.
 */
export default function CompletarPerfilPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Contenedor principal con padding para móviles */}
      <div className="w-full flex justify-center">
        <ProfileForm />
      </div>
      
      {/* Footer simple */}
      <footer className="mt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Guía Puntana. Todos los derechos reservados.
      </footer>
    </main>
  )
}