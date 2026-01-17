import React, { useMemo } from 'react';
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
  HeartPulse, // Salud
  Bandage, // Enfermería
  Activity, // Kinesiología
  PawPrint, // Mascotas
  Calculator, // Contaduría
  Car, // Mecánica
  Scissors, // Estética y Moda
  Home, // Inmobiliaria y Propiedades
  Megaphone, // Marketing Digital
  Dumbbell, // Personal Trainer
  Milk, // Suplementos
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

  basePath?: string;
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
  'Enfermería y Cuidadores': Bandage,
  Salud: HeartPulse,
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
  'Marketing Digital': Megaphone,
  Otro: Sparkles,
  'Personal Trainer': Dumbbell,
  'Suplementos Deportivos': Milk,
};

// IDs de categorías que no tienen servicios aún (para mostrarlas al final, antes de "Otro")
const EMPTY_CATEGORY_IDS = [
  'b8b1c1b7-6b00-422a-a3d3-a9d5cc9f3fca', // Personal Trainer
  '8f45d607-f5de-410c-a2f8-574eab6000cd', // Enfermería y Cuidadores
  '4f99fdc7-4233-43d4-89bb-98512fb87880', // Albañilería y Pintura
  'ff62e1ad-1189-4156-b292-1157cfbfdc4e', // Fletes y Mudanzas
  '79edac41-041d-47c0-bedc-6346d3e7c42c', // Mascotas
  '894085ab-ac0d-4301-809d-be71fd597123', // Plomería y Gas
  'ab797734-fa6c-4689-9dee-6b4876786eff', // Suplementos Deportivos
  'c7da234b-6ca0-424b-8743-9ac210feec61', // Electricidad
  '8bfcb7be-0280-4518-bd3b-4297e6b8483a', // Mantenimiento de Piletas
  '1a7c4e33-5619-43bd-9579-a9d83b0c298a', // Apoyo Escolar
  '245c5b54-ed50-4793-b425-6b6872acc249', // Herrería y Metalurgia
  'f8c30264-e0b4-4ae0-aece-6b1e83101d32', // Contaduría y Finanzas
  '69d5e22f-7592-4809-9deb-ea8fc8571c7d', // Jardinería y Paisajismo
  'be396c90-de22-4efd-97dc-f596a709fc66', // Kinesiología y Masajes
];

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
 * categories={allCategories}
 * activeCategoryId={selectedCategoryId}
 * />
 */
const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
  basePath = '/feed', // Por defecto al feed
}) => {
  // Ordenamos las categorías
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      // 1. "Otro" siempre al final absoluto
      if (a.nombre === 'Otro') return 1;
      if (b.nombre === 'Otro') return -1;

      const aIsEmpty = EMPTY_CATEGORY_IDS.includes(a.id);
      const bIsEmpty = EMPTY_CATEGORY_IDS.includes(b.id);

      // 2. Las categorías vacías (de la lista) van después de las que tienen servicios
      if (aIsEmpty && !bIsEmpty) return 1;
      if (!aIsEmpty && bIsEmpty) return -1;

      // 3. Si ambas son del mismo grupo, orden alfabético
      return a.nombre.localeCompare(b.nombre);
    });
  }, [categories]);

  return (
    <div className="mx-auto mt-8 max-w-7xl px-4">
      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b pb-4 dark:border-gray-800">
        <Link
          href={basePath} // Usar basePath
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-2 text-sm font-medium transition-colors ${
            !activeCategoryId
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          <LayoutGrid size={22} /> Todos
        </Link>

        {sortedCategories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.nombre] || Sparkles;

          return (
            <Link
              key={cat.id}
              href={`${basePath}?cat=${cat.id}`} // Usar basePath
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
