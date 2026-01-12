"use client";

import { ServiceForm } from "@/components/services/ServiceForm";
import { Header } from "@/components/feed/Header";

export default function NuevoServicioPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <div className="pt-24 pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Publicar Nuevo Servicio</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Completa los detalles para que los vecinos de San Luis puedan encontrarte.</p>
          </div>
          <ServiceForm />
        </div>
      </div>
    </main>
  );
}