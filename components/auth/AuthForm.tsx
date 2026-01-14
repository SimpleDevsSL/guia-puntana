'use client';

import { useAuthForm } from './useAuthForm';
import { GoogleButton } from './parts/GoogleButton';

/**
 * Authentication form component supporting both login and signup modes.
 *
 * Features:
 * - Toggle between login and signup modes
 * - Email and password authentication
 * - OAuth login with Google
 * - Field-level validation error display
 * - General error and success message handling
 * - Dark mode support
 * - Responsive design
 *
 * @component
 * @returns {React.ReactElement} A styled authentication form
 *
 * @example
 * <AuthForm />
 */
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

  /**
   * Returns CSS classes for input elements based on validation state.
   * Applies error styling (red border/ring) if field has validation error.
   *
   * @param {boolean} hasError - Whether the input field has a validation error
   * @returns {string} CSS class string with conditional error styles
   */
  const getInputClass = (hasError: boolean) => `
    w-full rounded-lg border px-4 py-2 
    text-gray-900 dark:text-white 
    bg-white dark:bg-gray-950 
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 transition-all shadow-sm 
    ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30'
        : 'border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900/30'
    }
  `;

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 transition-colors dark:text-white">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="mt-2 text-sm text-gray-500 transition-colors dark:text-gray-400">
          {isLogin
            ? 'Bienvenido a Guía Puntana'
            : 'Únete a la comunidad de San Luis'}
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
          <div className="w-full border-t border-gray-200 transition-colors dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          {/* El span debe tener el mismo color de fondo que el contenedor padre para tapar la línea */}
          <span className="bg-white px-2 text-gray-500 transition-colors dark:bg-gray-900 dark:text-gray-400">
            O con tu correo
          </span>
        </div>
      </div>

      {/* Formulario Credenciales */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            className="mb-1 block text-sm font-bold text-gray-700 transition-colors dark:text-gray-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={getInputClass(!!validationErrors.email)}
            placeholder="ejemplo@correo.com"
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="mb-1 block text-sm font-bold text-gray-700 transition-colors dark:text-gray-300"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={getInputClass(!!validationErrors.password)}
            placeholder="••••••••"
            disabled={loading}
          />
          {validationErrors.password && (
            <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Mensajes de Estado (Alerts) */}
        {generalError && (
          <div className="border-l-4 border-red-500 bg-red-50 p-3 text-sm font-medium text-red-700 transition-colors dark:bg-red-900/20 dark:text-red-300">
            {generalError}
          </div>
        )}

        {successMessage && (
          <div className="border-l-4 border-green-500 bg-green-50 p-3 text-sm font-medium text-green-800 transition-colors dark:bg-green-900/20 dark:text-green-300">
            {successMessage}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-orange-600 px-4 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-orange-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none dark:bg-orange-700 dark:hover:bg-orange-600"
        >
          {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      {/* Toggle Login/Registro */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 transition-colors dark:text-gray-400">
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}
          <button
            onClick={toggleMode}
            className="ml-2 font-bold text-orange-600 underline decoration-orange-200 decoration-2 transition-all hover:text-orange-800 hover:decoration-orange-600 dark:text-orange-500 dark:decoration-orange-900 dark:hover:text-orange-400"
            type="button"
          >
            {isLogin ? 'Crear cuenta' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
