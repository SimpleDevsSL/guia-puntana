'use client';

import { useProfileForm } from './useProfileForm';
import { ProfileInfo } from './parts/ProfileInfo';
import { ServicesList } from './parts/ServicesList';

export default function ProfileForm() {
  const {
    userId,
    loading,
    categories,
    profileData,
    servicesData,
    validationErrors,
    serviceErrors,
    generalError,
    previewUrl,
    handleProfileChange,
    handleAvatarChange,
    addService,
    removeService,
    handleServiceChange,
    handleSubmit,
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
          onFileChange={handleAvatarChange} // Pasamos el handler
          previewUrl={previewUrl} // Pasamos la URL de vista previa
        />

        {profileData.rol === 'proveedor' && (
          <ServicesList
            services={servicesData}
            categories={categories}
            errors={serviceErrors}
            onAdd={addService}
            onRemove={removeService}
            onChange={handleServiceChange}
          />
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
