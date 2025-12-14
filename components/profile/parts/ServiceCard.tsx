import { ServiceFormData, Category } from "../form-schema";

interface Props {
  index: number;
  data: ServiceFormData;
  categories: Category[];
  errors: Record<string, string>;
  onChange: (
    index: number,
    field: keyof ServiceFormData,
    value: string
  ) => void;
  onRemove: (tempId: number) => void;
}

export const ServiceCard = ({
  index,
  data,
  categories,
  errors,
  onChange,
  onRemove,
}: Props) => {
  const getError = (field: keyof ServiceFormData) =>
    errors[`${index}.${field}`];

  // Estilos centralizados - High Contrast & Orange Theme
  const labelClass =
    "block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide";
  const inputClass = `w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm`;
  const errorClass = "text-red-600 text-xs mt-1 font-bold";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative group hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        type="button"
        onClick={() => onRemove(data.tempId)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
        title="Eliminar servicio"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="mb-6 flex items-center gap-2">
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
          SERVICIO #{index + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Categoría */}
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select
            value={data.categoria_id}
            onChange={(e) => onChange(index, "categoria_id", e.target.value)}
            className={inputClass}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {getError("categoria_id") && (
            <p className={errorClass}>{getError("categoria_id")}</p>
          )}
        </div>

        {/* Nombre */}
        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => onChange(index, "nombre", e.target.value)}
            className={inputClass}
            placeholder="Ej. Plomería Express 24hs"
          />
          {getError("nombre") && (
            <p className={errorClass}>{getError("nombre")}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className={labelClass}>Descripción Detallada *</label>
          <textarea
            value={data.descripcion}
            onChange={(e) => onChange(index, "descripcion", e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Describe tus servicios, experiencia y horarios de atención..."
          />
          {getError("descripcion") && (
            <p className={errorClass}>{getError("descripcion")}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className={labelClass}>Teléfono / WhatsApp</label>
          <input
            type="text"
            value={data.telefono || ""}
            onChange={(e) => onChange(index, "telefono", e.target.value)}
            className={inputClass}
            placeholder="+54 266 4..."
          />
        </div>

        {/* Dirección */}
        <div>
          <label className={labelClass}>Dirección *</label>
          <input
            type="text"
            value={data.direccion}
            onChange={(e) => onChange(index, "direccion", e.target.value)}
            className={inputClass}
            placeholder="Ej. Av. Illia 123"
          />
          {getError("direccion") && (
            <p className={errorClass}>{getError("direccion")}</p>
          )}
        </div>

        {/* Localidad */}
        <div>
          <label className={labelClass}>Localidad *</label>
          <input
            type="text"
            value={data.localidad}
            onChange={(e) => onChange(index, "localidad", e.target.value)}
            className={inputClass}
            placeholder="Ej. San Luis Capital"
          />
          {getError("localidad") && (
            <p className={errorClass}>{getError("localidad")}</p>
          )}
        </div>

        {/* Barrio */}
        <div>
          <label className={labelClass}>Barrio (Opcional)</label>
          <input
            type="text"
            value={data.barrio || ""}
            onChange={(e) => onChange(index, "barrio", e.target.value)}
            className={inputClass}
            placeholder="Ej. Barrio Jardín"
          />
        </div>
      </div>
    </div>
  );
};
