"use client";

import { useAuthForm } from "./useAuthForm";
import { GoogleButton } from "./parts/GoogleButton";

export default function AuthForm() {
  const {
    isLogin,
    loading,
    formData,
    validationErrors,
    generalError,
    successMessage,
    toggleMode,
    handleInputChange,
    handleGoogleLogin,
    handleSubmit,
  } = useAuthForm();

  // Estilos de inputs (Tema Naranja & Alto Contraste)
  const getInputClass = (hasError: boolean) => `
    w-full rounded-lg border px-4 py-2 text-gray-900 placeholder:text-gray-400 
    focus:outline-none focus:ring-2 transition-all shadow-sm 
    ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
    }
  `;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {isLogin
            ? "Bienvenido a Guía Puntana"
            : "Únete a la comunidad de San Luis"}
        </p>
      </div>

      {/* Social Login */}
      <div className="mb-6">
        <GoogleButton onClick={handleGoogleLogin} loading={loading} />
      </div>

      {/* Separador */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O con tu correo</span>
        </div>
      </div>

      {/* Formulario Credenciales */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            className="block text-sm font-bold text-gray-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={getInputClass(!!validationErrors.email)}
            placeholder="ejemplo@correo.com"
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-sm font-bold text-gray-700 mb-1"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={getInputClass(!!validationErrors.password)}
            placeholder="••••••••"
            disabled={loading}
          />
          {validationErrors.password && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Mensajes de Estado */}
        {generalError && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {generalError}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm font-medium">
            {successMessage}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none mt-2"
        >
          {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse"}
        </button>
      </form>

      {/* Toggle Login/Registro */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "¿Primera vez aquí?" : "¿Ya tienes cuenta?"}
          <button
            onClick={toggleMode}
            className="ml-2 font-bold text-orange-600 hover:text-orange-800 underline decoration-2 decoration-orange-200 hover:decoration-orange-600 transition-all"
            type="button"
          >
            {isLogin ? "Crear cuenta" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
