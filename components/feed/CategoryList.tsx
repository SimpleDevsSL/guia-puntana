'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Category } from '../../app/lib/definitions';
import {
  Sparkles,
  Zap,
  Leaf,
  Hammer,
  Wrench,
  Monitor,
  GraduationCap,
  Truck,
  Paintbrush,
  LayoutGrid,
  Droplets,
  Utensils,
  HeartPulse,
  Bandage,
  Activity,
  PawPrint,
  Calculator,
  Car,
  Scissors,
  Home,
  Megaphone,
  Dumbbell,
  Milk,
  Briefcase,
  Users,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
  basePath?: string;
}

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
  'Personal Trainer': Dumbbell,
  'Suplementos Deportivos': Milk,
  Otro: Sparkles,
};

const GROUP_DEFINITIONS = {
  OFICIOS: [
    'Plomería y Gas',
    'Electricidad',
    'Albañilería y Pintura',
    'Herrería y Metalurgia',
    'Mecánica Automotor',
    'Jardinería y Paisajismo',
    'Mantenimiento de Piletas',
    'Fletes y Mudanzas',
    'Servicio Técnico',
  ],
  SERVICIOS: [
    'Salud',
    'Enfermería y Cuidadores',
    'Kinesiología y Masajes',
    'Estética y Moda',
    'Apoyo Escolar',
    'Contaduría y Finanzas',
    'Inmobiliaria y Propiedades',
    'Marketing Digital',
    'Personal Trainer',
  ],
  OTROS: [
    'Viandas y Comida Casera',
    'Mascotas',
    'Suplementos Deportivos',
    'Otro',
  ],
};

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
  basePath = '/feed',
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const groupedCategories = useMemo(() => {
    const groups = {
      OFICIOS: [] as Category[],
      SERVICIOS: [] as Category[],
      OTROS: [] as Category[],
    };

    categories.forEach((cat) => {
      if (GROUP_DEFINITIONS.OFICIOS.includes(cat.nombre)) {
        groups.OFICIOS.push(cat);
      } else if (GROUP_DEFINITIONS.SERVICIOS.includes(cat.nombre)) {
        groups.SERVICIOS.push(cat);
      } else {
        groups.OTROS.push(cat);
      }
    });

    // Ordenamiento Personalizado
    const sortList = (list: Category[], definition: string[]) => {
      list.sort((a, b) => {
        const indexA = definition.indexOf(a.nombre);
        const indexB = definition.indexOf(b.nombre);

        // Si ambos están en la lista definida, usar ese orden
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;

        // Si uno está y el otro no, el que está tiene prioridad
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Si ninguno está en la lista usar alfabético
        return a.nombre.localeCompare(b.nombre);
      });
    };

    // Aplicar el orden a cada grupo
    sortList(groups.OFICIOS, GROUP_DEFINITIONS.OFICIOS);
    sortList(groups.SERVICIOS, GROUP_DEFINITIONS.SERVICIOS);
    sortList(groups.OTROS, GROUP_DEFINITIONS.OTROS);

    return groups;
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const DropdownButton = ({
    label,
    groupKey,
    Icon,
    items,
  }: {
    label: string;
    groupKey: string;
    Icon: React.ElementType;
    items: Category[];
  }) => {
    const isOpen = openDropdown === groupKey;
    const isGroupActive = items.some((item) => item.id === activeCategoryId);

    if (items.length === 0) return null;

    return (
      <div className="static min-w-[140px] flex-1 sm:relative">
        <button
          onClick={() => toggleDropdown(groupKey)}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl border-2 px-4 py-4 text-base font-bold shadow-sm transition-all hover:shadow-lg active:scale-95 sm:text-lg ${
            isGroupActive || isOpen
              ? 'border-orange-600 bg-orange-600 text-white shadow-orange-200 ring-2 ring-orange-200 ring-offset-1 dark:ring-orange-900 dark:ring-offset-gray-900'
              : 'border-gray-100 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          <Icon size={24} className="shrink-0" />
          <span className="truncate">{label}</span>
          <ChevronDown
            size={20}
            className={`shrink-0 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute left-0 z-50 mt-2 w-full origin-top duration-100 sm:left-0 sm:w-72">
            <div className="max-h-80 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900 dark:ring-white/10">
              {items.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.nombre] || Sparkles;
                const isSelected = activeCategoryId === cat.id;

                return (
                  <Link
                    key={cat.id}
                    href={`${basePath}?cat=${cat.id}`}
                    onClick={() => setOpenDropdown(null)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className={
                        isSelected ? 'text-orange-600' : 'text-gray-400'
                      }
                    />
                    {cat.nombre}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-5xl px-4" ref={containerRef}>
      <div className="relative flex flex-wrap gap-3 sm:gap-4">
        <Link
          href={basePath}
          onClick={() => setOpenDropdown(null)}
          className={`flex min-w-[140px] flex-1 items-center justify-center gap-3 rounded-2xl border-2 px-4 py-4 text-base font-bold shadow-sm transition-all hover:shadow-lg active:scale-95 sm:text-lg ${
            !activeCategoryId
              ? 'border-orange-600 bg-orange-600 text-white shadow-orange-200 ring-2 ring-orange-200 ring-offset-1 dark:ring-orange-900 dark:ring-offset-gray-900'
              : 'border-gray-100 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          <LayoutGrid size={24} className="shrink-0" />
          <span>Todos</span>
        </Link>

        <DropdownButton
          label="Oficios"
          groupKey="OFICIOS"
          Icon={Briefcase}
          items={groupedCategories.OFICIOS}
        />
        <DropdownButton
          label="Servicios"
          groupKey="SERVICIOS"
          Icon={Users}
          items={groupedCategories.SERVICIOS}
        />
        <DropdownButton
          label="Otros"
          groupKey="OTROS"
          Icon={MoreHorizontal}
          items={groupedCategories.OTROS}
        />
      </div>
    </div>
  );
};

export default CategoryList;
