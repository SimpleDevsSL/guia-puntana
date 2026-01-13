import { ProfileFormData } from '../form-schema';
import Image from 'next/image';
import { ChangeEvent } from 'react';

interface Props {
  data: ProfileFormData;
  errors: Record<string, string>;
  onChange: (
    field: keyof ProfileFormData,
    value: ProfileFormData[keyof ProfileFormData]
  ) => void;
  onFileChange: (file: File) => void;
  previewUrl: string | null;
}
export const ProfileInfo = ({
  data,
  errors,
  onChange,
  onFileChange,
  previewUrl,
}: Props) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <section className="space-y-6">
      <h3 className="border-b border-gray-100 pb-3 text-xl font-bold text-gray-800 dark:border-gray-800 dark:text-white">
        Información Personal
      </h3>

      {/* Sección de Foto de Perfil */}
      <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-orange-500 bg-gray-100">
          {previewUrl || data.foto_url ? (
            <Image
              src={previewUrl || data.foto_url || '/placeholder-user.jpg'}
              alt="Foto de perfil"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            Foto de Perfil (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
          />
          <p className="mt-1 text-xs text-gray-500">
            Recomendado: 400x400px, JPG o PNG.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
          Nombre Completo
        </label>
        <input
          type="text"
          value={data.nombre_completo}
          onChange={(e) => onChange('nombre_completo', e.target.value)}
          placeholder="Ej. Juan Pérez"
          className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-gray-500 ${
            errors.nombre_completo
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30'
              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-100 dark:border-gray-700 dark:focus:ring-orange-900/30'
          }`}
        />
        {errors.nombre_completo && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {errors.nombre_completo}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
          Rol en la plataforma
        </label>
        <div className="relative">
          <select
            value={data.rol}
            onChange={(e) =>
              onChange('rol', e.target.value as 'user' | 'proveedor')
            }
            className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-gray-900 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-slate-950 dark:text-white dark:focus:ring-orange-900/30"
          >
            <option value="user">Usuario normal (Busco servicios)</option>
            <option value="proveedor">
              Proveedor de Servicio (Ofrezco servicios)
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
