'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/feed/Header';
import VerificationUpload from '@/components/profile/VerificationUpload';
import { useProfileSettings } from './useProfileSettings';
import {
  ArrowLeft,
  Trash2,
  Save,
  User,
  Camera,
  ShieldCheck,
  Info,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const {
    loading,
    saving,
    profileData,
    setProfileData,
    userData,
    previewUrl,
    handleAvatarChange,
    handleSaveBasicInfo,
    currentPassword,
    setCurrentPassword,
    newEmail,
    setNewEmail,
    handleUpdateEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleUpdatePassword,
    handleDeleteAccount,
    role,
    handleBecomeProvider,
  } = useProfileSettings();

  // Detectar si el usuario es de Google
  const isGoogleUser =
    userData?.app_metadata?.provider === 'google' ||
    userData?.app_metadata?.providers?.includes('google');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pb-12 pt-24">
        <Link
          href="/feed"
          className="mb-6 inline-flex items-center gap-2 font-medium text-gray-500 transition-colors hover:text-orange-600"
        >
          <ArrowLeft size={20} /> Volver al Feed
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-700"></div>

          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-8 flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
              <div className="group relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gray-200 shadow-lg dark:border-gray-900 dark:bg-gray-800">
                  {previewUrl || profileData.foto_url ? (
                    <Image
                      src={previewUrl || profileData.foto_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      fill
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-xl border border-gray-100 bg-white p-2 shadow-md hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-orange-900/20">
                  <Camera size={18} className="text-orange-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleAvatarChange(e.target.files[0])
                    }
                  />
                </label>
              </div>
              <div className="mt-4 text-center sm:mt-16 sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.nombre_completo || 'Usuario'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {userData?.email}
                </p>
                {isGoogleUser && (
                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Cuenta de Google
                  </span>
                )}
              </div>
            </div>

            {/* Datos Básicos */}
            <section className="space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <User size={20} className="text-orange-600" /> Información
                Personal
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={profileData.nombre_completo}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        nombre_completo: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveBasicInfo}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-orange-700"
              >
                <Save size={20} />{' '}
                {saving ? 'Guardando...' : 'Guardar Información Básica'}
              </button>
            </section>

            {/* Verificación de Identidad - Solo para Proveedores */}
            {role === 'provider' && userData?.id && (
              <VerificationUpload
                userId={userData.id}
                insignias={profileData.insignias}
              />
            )}

            {role === 'user' && (
              <section className="mb-8 mt-8 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-6 dark:border-orange-900/50 dark:from-orange-900/10 dark:to-gray-900">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-orange-700 dark:text-orange-400">
                      <Briefcase size={20} />
                      ¿Quieres ofrecer tus servicios?
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Conviértete en proveedor para publicar anuncios y llegar a
                      más clientes en la Guía Puntana.
                    </p>
                  </div>
                  <button
                    onClick={handleBecomeProvider}
                    disabled={saving}
                    className="shrink-0 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-700 hover:shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Procesando...' : 'Convertirme en Proveedor'}
                  </button>
                </div>
              </section>
            )}

            {/* Sección Seguridad: Siempre renderizamos el contenedor para mantener el borde superior */}
            <section className="mt-12 space-y-8 border-t border-gray-100 pt-12 dark:border-gray-800">
              {/* Bloque de gestión de contraseñas/email: Oculto para Google */}
              {!isGoogleUser && (
                <>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={24} className="text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Seguridad de la Cuenta
                    </h2>
                  </div>

                  {/* Aviso Confirmación Doble */}
                  <div className="flex gap-3 rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
                    <Info size={20} className="shrink-0 text-blue-600" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Aviso de Email:</strong> Se enviará un link de
                      verificación a tu correo actual y otro al nuevo. Debes
                      confirmar ambos para completar el cambio.
                    </p>
                  </div>

                  {/* Input Contraseña Actual Obligatorio */}
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-6 dark:border-orange-800 dark:bg-orange-900/10">
                    <label className="mb-2 block text-sm font-bold text-orange-700 dark:text-orange-400">
                      Contraseña Actual para Validación
                    </label>
                    <input
                      type="password"
                      placeholder="Ingresa tu clave actual para cambios sensibles"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </div>

                  {/* Actualizar Email */}
                  <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Nuevo Email
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <button
                      onClick={handleUpdateEmail}
                      disabled={!currentPassword || !newEmail || saving}
                      className="rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 dark:bg-gray-800"
                    >
                      Cambiar Email
                    </button>
                  </div>

                  {/* Actualizar Contraseña */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={
                        !currentPassword ||
                        !newPassword ||
                        newPassword !== confirmPassword ||
                        saving
                      }
                      className="rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 dark:bg-gray-800 md:col-span-2"
                    >
                      Actualizar Contraseña
                    </button>
                  </div>
                </>
              )}

              <div
                className={`flex justify-center pt-8 ${!isGoogleUser
                    ? 'border-t border-red-100 dark:border-red-900/30'
                    : ''
                  }`}
              >
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <Trash2 size={20} /> Eliminar mi cuenta permanentemente
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
