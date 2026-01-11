"use client";

import { useProfileForm } from "./useProfileForm";
import { ProfileInfo } from "./parts/ProfileInfo";
import { ServicesList } from "./parts/ServicesList";

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
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 my-8 transition-colors duration-300">
      <div className="bg-orange-600 p-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          ¡Te damos la bienvenida!
        </h2>
        <p className="text-orange-100 mt-2 text-base">
          Completa tu perfil para comenzar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <ProfileInfo
          data={profileData}
          errors={validationErrors}
          onChange={handleProfileChange}
          onFileChange={handleAvatarChange} // Pasamos el handler
          previewUrl={previewUrl} // Pasamos la URL de vista previa
        />

        {profileData.rol === "proveedor" && (
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
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm rounded-r-md">
            <p className="font-bold">Error</p>
            <p>{generalError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !userId}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-md transition-all transform hover:-translate-y-0.5 ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-wait"
              : "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 hover:shadow-orange-500/25"
          }`}
        >
          {loading ? "Guardando..." : "Finalizar Perfil"}
        </button>
      </form>
    </div>
  );
}
