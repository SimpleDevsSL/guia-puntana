'use client';

import { useProfileForm } from './useProfileForm';
import { ProfileInfo } from './parts/ProfileInfo';
import { ServiceFormInProfile } from './parts/ServiceFormInProfile';
import { Plus } from 'lucide-react';

/**
 * Profile completion form component for new users.
 *
 * This component manages the profile setup flow:
 * - User basic information (name, role, avatar)
 * - Form validation and error display
 * - Server submission with file uploads
 *
 * Uses the `useProfileForm` hook for all form logic and state management.
 *
 * @component
 * @returns {React.ReactElement} A styled profile form
 *
 * @example
 * <ProfileForm />
 */
export default function ProfileForm() {
  const {
    userId,
    loading,
    profileData,
    validationErrors,
    generalError,
    previewUrl,
    services,
    handleProfileChange,
    handleAvatarChange,
    handleSubmit,
    addService,
    removeService,
    updateService,
  } = useProfileForm();

  return (
    <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="bg-orange-600 p-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          ¡Te damos la bienvenida!
        </h2>
        <p className="mt-2 text-base text-orange-100">
          Completa tu perfil para comenzar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-8">
        <ProfileInfo
          data={profileData}
          errors={validationErrors}
          onChange={handleProfileChange}
          onFileChange={handleAvatarChange}
          previewUrl={previewUrl}
        />

        {profileData.rol === 'proveedor' && (
          <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              💡 Puedes cargar hasta 3 servicios aquí. También podrás agregar
              más en la sección de servicios después de crear tu cuenta.
            </p>

            <div className="space-y-4">
              {services.map((service, idx) => (
                <ServiceFormInProfile
                  key={service.tempId}
                  service={service}
                  onUpdate={(field, value) =>
                    updateService(service.tempId, field, value)
                  }
                  onRemove={() => removeService(service.tempId)}
                  errors={validationErrors}
                  index={idx}
                  totalServices={services.length}
                />
              ))}

              {services.length < 3 && (
                <button
                  type="button"
                  onClick={addService}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-100/50 py-3 font-semibold text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  <Plus size={20} /> Agregar Servicio ({services.length}/3)
                </button>
              )}
            </div>
          </div>
        )}

        {generalError && (
          <div className="rounded-r-md border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <p className="font-bold">Error</p>
            <p>{generalError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !userId}
          className={`w-full transform rounded-xl px-6 py-4 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 ${
            loading
              ? 'cursor-wait bg-gray-400 dark:bg-gray-600'
              : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 hover:shadow-orange-500/25'
          }`}
        >
          {loading ? 'Guardando...' : 'Finalizar Perfil'}
        </button>
      </form>
    </div>
  );
}
