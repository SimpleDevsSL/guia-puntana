import ProfileForm from '@/components/profile/ProfileForm';

/**
 * Página Completar Perfil
 * Ruta: /completar-perfil
 * Muestra el formulario para crear el perfil inicial del usuario.
 */
export default function CompletarPerfilPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 transition-colors duration-300 dark:bg-slate-950">
      {/* Contenedor principal con padding para móviles */}
      <div className="flex w-full justify-center">
        <ProfileForm />
      </div>

      {/* Footer simple */}
      <footer className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Guía Puntana. Todos los derechos
        reservados.
      </footer>
    </main>
  );
}
