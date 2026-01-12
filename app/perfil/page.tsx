"use client";

import React from "react";
import { Header } from "@/components/feed/Header";
import { useProfileSettings } from "./useProfileSettings";
import { ArrowLeft, Trash2, Save, User, Mail, Camera, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const {
    loading, saving, profileData, setProfileData, userData,
    previewUrl, handleAvatarChange, handleSaveBasicInfo,
    currentPassword, setCurrentPassword,
    newEmail, setNewEmail, handleUpdateEmail,
    newPassword, setNewPassword, confirmPassword, setConfirmPassword, handleUpdatePassword,
    handleDeleteAccount,
  } = useProfileSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      
      <main className="max-w-4xl mx-auto pt-24 pb-12 px-4">
        <Link href="/feed" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6 font-medium">
          <ArrowLeft size={20} /> Volver al Feed
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-700"></div>
          
          <div className="px-8 pb-8">
            {/* Header Perfil */}
            <div className="relative -mt-16 mb-8 flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  {(previewUrl || profileData.foto_url) ? (
                    <img src={previewUrl || profileData.foto_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-100 dark:border-gray-700">
                  <Camera size={18} className="text-orange-600" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])} />
                </label>
              </div>
              <div className="mt-4 sm:mt-16 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.nombre_completo || "Usuario"}</h1>
                <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
              </div>
            </div>

            {/* Datos Básicos */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <User size={20} className="text-orange-600" /> Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={profileData.nombre_completo}
                    onChange={(e) => setProfileData({...profileData, nombre_completo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button onClick={handleSaveBasicInfo} disabled={saving} className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={20} /> {saving ? "Guardando..." : "Guardar Información Básica"}
              </button>
            </section>

            {/* Sección Seguridad */}
            <section className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800 space-y-8">
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Seguridad de la Cuenta</h2>
              </div>

              {/* Aviso Confirmación Doble */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl flex gap-3">
                <Info size={20} className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Aviso de Email:</strong> Se enviará un link de verificación a tu correo actual y otro al nuevo. Debes confirmar ambos para completar el cambio.
                </p>
              </div>

              {/* Input Contraseña Actual Obligatorio */}
              <div className="p-6 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-dashed border-orange-200 dark:border-orange-800">
                <label className="block text-sm font-bold text-orange-700 dark:text-orange-400 mb-2">Contraseña Actual para Validación</label>
                <input
                  type="password"
                  placeholder="Ingresa tu clave actual para cambios sensibles"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Actualizar Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nuevo Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                </div>
                <button onClick={handleUpdateEmail} disabled={!currentPassword || !newEmail || saving} className="px-6 py-3 bg-gray-900 dark:bg-gray-800 hover:bg-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                  Cambiar Email
                </button>
              </div>

              {/* Actualizar Contraseña */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nueva Contraseña</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmar Nueva Contraseña</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                </div>
                <button onClick={handleUpdatePassword} disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || saving} className="md:col-span-2 px-6 py-3 bg-gray-900 dark:bg-gray-800 hover:bg-orange-600 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                  Actualizar Contraseña
                </button>
              </div>

              {/* Eliminar Cuenta */}
              <div className="pt-8 border-t border-red-100 dark:border-red-900/30 flex justify-center">
                <button onClick={handleDeleteAccount} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
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