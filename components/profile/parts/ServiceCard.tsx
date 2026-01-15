import { ServiceFormData, Category } from '../form-schema';

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

  const labelClass =
    'block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide';

  const inputClass = `w-full rounded-md border border-gray-300 dark:border-gray-700 
    bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-white 
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 
    outline-none transition-all shadow-sm`;

  const errorClass = 'text-red-600 dark:text-red-400 text-xs mt-1 font-bold';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => onRemove(data.tempId)}
        className="absolute right-4 top-4 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        title="Eliminar servicio"
      >
        <svg
          className="h-5 w-5"
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
        <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
          SERVICIO #{index + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Categoría */}
        <div className="md:col-span-2">
          <label className={labelClass}>Categoría *</label>
          <select
            value={data.categoria_id}
            onChange={(e) => onChange(index, 'categoria_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {getError('categoria_id') && (
            <p className={errorClass}>{getError('categoria_id')}</p>
          )}
        </div>

        {/* Nombre */}
        <div className="md:col-span-2">
          <label className={labelClass}>Título del Servicio *</label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => onChange(index, 'nombre', e.target.value)}
            className={inputClass}
            placeholder="Ej. Plomería Express 24hs"
          />
          {getError('nombre') && (
            <p className={errorClass}>{getError('nombre')}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className={labelClass}>Descripción Detallada *</label>
          <textarea
            value={data.descripcion}
            onChange={(e) => onChange(index, 'descripcion', e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Describe tus servicios, experiencia y horarios de atención..."
          />
          {getError('descripcion') && (
            <p className={errorClass}>{getError('descripcion')}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Teléfono / WhatsApp *</label>
          <input
            type="text"
            value={data.telefono || ''}
            onChange={(e) => onChange(index, 'telefono', e.target.value)}
            className={inputClass}
            placeholder="+54 266 4..."
          />
          {getError('telefono') && (
            <p className={errorClass}>{getError('telefono')}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className={labelClass}>Dirección *</label>
          <input
            type="text"
            value={data.direccion}
            onChange={(e) => onChange(index, 'direccion', e.target.value)}
            className={inputClass}
            placeholder="Ej. Av. Illia 123"
          />
          {getError('direccion') && (
            <p className={errorClass}>{getError('direccion')}</p>
          )}
        </div>

        {/* Localidad */}
        <div>
          <label className={labelClass}>Localidad *</label>
          <input
            type="text"
            value={data.localidad}
            onChange={(e) => onChange(index, 'localidad', e.target.value)}
            className={inputClass}
            placeholder="Ej. San Luis Capital"
          />
          {getError('localidad') && (
            <p className={errorClass}>{getError('localidad')}</p>
          )}
        </div>

        {/* Barrio */}
        <div>
          <label className={labelClass}>Barrio (Opcional)</label>
          <input
            type="text"
            value={data.barrio || ''}
            onChange={(e) => onChange(index, 'barrio', e.target.value)}
            className={inputClass}
            placeholder="Ej. Barrio Jardín"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Redes o Sitio Web (Opcional)</label>
          <input
            type="text"
            value={data.redes || ''}
            onChange={(e) => onChange(index, 'redes', e.target.value)}
            className={inputClass}
            placeholder="Ej: @miusuario o https://instagram.com/..."
          />
          {/* Mostramos error si existe (validado por el schema que modificamos antes) */}
          {getError('redes') && (
            <p className={errorClass}>{getError('redes')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
