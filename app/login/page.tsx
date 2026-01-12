import AuthForm from '@/components/auth/AuthForm';

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 transition-colors dark:bg-gray-950">
      <AuthForm />
    </main>
  );
}
