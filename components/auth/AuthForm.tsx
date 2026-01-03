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

  // Estilos de inputs (Adaptados para Modo Oscuro)
  const getInputClass = (hasError: boolean) => `
    w-full rounded-lg border px-4 py-2 
    text-gray-900 dark:text-white 
    bg-white dark:bg-gray-950 
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 transition-all shadow-sm 
    ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
        : "border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900/30"
    }
  `;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors">
          {isLogin
            ? "Bienvenido a Guía Puntana"
            : "Únete a la comunidad de San Luis"}
        </p>
      </div>

      {/* Social Login */}
      <div className="mb-6">
        {/* Asegúrate de que tu GoogleButton soporte dark mode o sea neutro */}
        <GoogleButton onClick={handleGoogleLogin} loading={loading} />
      </div>

      {/* Separador */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700 transition-colors"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          {/* El span debe tener el mismo color de fondo que el contenedor padre para tapar la línea */}
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors">
            O con tu correo
          </span>
        </div>
      </div>

      {/* Formulario Credenciales */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors"
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
            <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-bold">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors"
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
            <p className="text-red-600 dark:text-red-400 text-xs mt-1 font-bold">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Mensajes de Estado (Alerts) */}
        {generalError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm font-medium transition-colors">
            {generalError}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-800 dark:text-green-300 text-sm font-medium transition-colors">
            {successMessage}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none mt-2"
        >
          {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse"}
        </button>
      </form>

      {/* Toggle Login/Registro */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
          {isLogin ? "¿Primera vez aquí?" : "¿Ya tienes cuenta?"}
          <button
            onClick={toggleMode}
            className="ml-2 font-bold text-orange-600 hover:text-orange-800 dark:text-orange-500 dark:hover:text-orange-400 underline decoration-2 decoration-orange-200 dark:decoration-orange-900 hover:decoration-orange-600 transition-all"
            type="button"
          >
            {isLogin ? "Crear cuenta" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}