import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {/* Aquí renderizamos el componente AuthForm aislado.
        La lógica de redirección ya está dentro del componente.
      */}
      <AuthForm />
    </main>
  )
}