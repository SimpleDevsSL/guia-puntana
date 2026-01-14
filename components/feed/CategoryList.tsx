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
  Calculator, // Contaduría
  Car, // Mecánica
  Scissors, // Estética y Moda
  Home, // Inmobiliaria y Propiedades
} from 'lucide-react';

/**
 * Props for the CategoryList component
 * @interface CategoryListProps
 */
interface CategoryListProps {
  /** Array of available service categories to display */
  categories: Category[];
  /** ID of currently active/selected category (null for "all") */
  activeCategoryId: string | null;
}

/**
 * Maps category names to their corresponding Lucide icons.
 * Uses a default Sparkles icon for any category without a specific mapping.
 * Maps must match database category names exactly.
 *
 * @constant
 * @type {Record<string, React.ElementType>}
 */
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
  'Contaduría y Finanzas': Calculator,
  'Mecánica Automotor': Car,
  'Estética y Moda': Scissors,
  'Inmobiliaria y Propiedades': Home,
};

/**
 * Horizontal scrollable category filter list component.
 *
 * Displays:
 * - "Todos" (All) option to show services from all categories
 * - Individual category buttons with icons and names
 * - Active category highlighting with orange underline
 *
 * Features:
 * - Horizontal scroll on smaller screens
 * - Icon-category mapping from constant
 * - Responsive design with Tailwind classes
 * - Dark mode support
 *
 * @component
 * @param {CategoryListProps} props - Component props
 * @returns {React.ReactElement} A scrollable category filter bar
 *
 * @example
 * <CategoryList
 *   categories={allCategories}
 *   activeCategoryId={selectedCategoryId}
 * />
 */
const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
}) => {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-4">
      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b pb-4 dark:border-gray-800">
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

        {/* Individual category links */}
        {categories.map((cat) => {
          // Retrieve icon from map, fallback to Sparkles if not found
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
