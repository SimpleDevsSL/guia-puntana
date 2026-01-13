import { ServiceFormData, Category } from '../form-schema';
import { ServiceCard } from './ServiceCard';

interface Props {
  services: ServiceFormData[];
  categories: Category[];
  errors: Record<string, string>;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (idx: number, f: keyof ServiceFormData, v: string) => void;
}

export const ServicesList = ({
  services,
  categories,
  errors,
  onAdd,
  onRemove,
  onChange,
}: Props) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        Mis Servicios
      </h3>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/40"
      >
        <span className="text-lg leading-none">+</span> Agregar Servicio
      </button>
    </div>

    {services.length === 0 && (
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-center dark:border-gray-800 dark:bg-slate-900">
        <p className="font-medium text-gray-500 dark:text-gray-400">
          No has agregado ningún servicio todavía.
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Haz clic en &quot;Agregar Servicio&quot; para comenzar.
        </p>
      </div>
    )}

    <div className="space-y-6">
      {services.map((service, index) => (
        <ServiceCard
          key={service.tempId}
          index={index}
          data={service}
          categories={categories}
          errors={errors}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  </section>
);
