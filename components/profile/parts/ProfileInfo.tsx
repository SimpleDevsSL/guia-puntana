import { ProfileFormData } from "../form-schema";

interface Props {
  data: ProfileFormData;
  errors: Record<string, string>;
  onChange: (field: keyof ProfileFormData, value: string) => void;
}

export const ProfileInfo = ({ data, errors, onChange }: Props) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
      Información Personal
    </h3>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Nombre Completo
      </label>
      <input
        type="text"
        value={data.nombre_completo}
        onChange={(e) => onChange("nombre_completo", e.target.value)}
        placeholder="Ej. Juan Pérez"
        className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 transition-all ${
          errors.nombre_completo
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
        }`}
      />
      {errors.nombre_completo && (
        <p className="text-red-500 text-xs mt-1 font-medium">
          {errors.nombre_completo}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Rol en la plataforma
      </label>
      <div className="relative">
        <select
          value={data.rol}
          onChange={(e) =>
            onChange("rol", e.target.value as "user" | "proveedor")
          }
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none cursor-pointer transition-all"
        >
          <option value="user">Usuario normal (Busco servicios)</option>
          <option value="proveedor">
            Proveedor de Servicio (Ofrezco servicios)
          </option>
        </select>

        {/* Flecha personalizada */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  </section>
);
