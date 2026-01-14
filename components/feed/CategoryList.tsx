import React from 'react';
import Link from 'next/link';
import { Category } from '../../app/lib/definitions';
import {
  Sparkles, // Por defecto
  Zap, // Electricidad
  Leaf, // Jardinería
  Hammer, // Herrería
  Wrench, // Plomería
  Monitor, // Servicio Técnico
  GraduationCap, // Apoyo Escolar
  Truck, // Fletes
  Paintbrush, // Albañilería y Pintura
  LayoutGrid, // Todos
  Droplets, // Piletas
  Utensils, // Comida
  ShoppingBag, // Productos Regionales
  HeartPulse, // Enfermería
  Activity, // Kinesiología
  PawPrint, // Mascotas
} from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
}

// Mapa de iconos vinculados al nombre exacto de la base de datos
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Plomería y Gas': Wrench,
  Electricidad: Zap,
  'Albañilería y Pintura': Paintbrush,
  'Jardinería y Paisajismo': Leaf,
  'Mantenimiento de Piletas': Droplets,
  'Viandas y Comida Casera': Utensils,
  'Productos Regionales': ShoppingBag,
  'Enfermería y Cuidadores': HeartPulse,
  'Kinesiología y Masajes': Activity,
  Mascotas: PawPrint,
  'Fletes y Mudanzas': Truck,
  'Servicio Técnico': Monitor,
  'Apoyo Escolar': GraduationCap,
  'Herrería y Metalurgia': Hammer,
};

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
}) => {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-4">
      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b pb-4 dark:border-gray-800">
        {/* Opción "Todos" con un icono de cuadrícula */}
        <Link
          href="/feed"
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${
            !activeCategoryId
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          <LayoutGrid size={22} /> Todos
        </Link>

        {categories.map((cat) => {
          // Buscamos el icono en el mapa, si no existe usamos Sparkles por defecto
          const IconComponent = CATEGORY_ICONS[cat.nombre] || Sparkles;

          return (
            <Link
              key={cat.id}
              href={`/feed?cat=${cat.id}`}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${
                activeCategoryId === cat.id
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <IconComponent size={22} /> {cat.nombre}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
