// components/feed/CategoryList.tsx
import React from 'react';
import Link from 'next/link';
import { Category } from '../../app/lib/definitions';
import { Sparkles } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
}) => {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-4">
      <div className="no-scrollbar flex space-x-6 overflow-x-auto border-b pb-4 dark:border-gray-800">
        <Link
          href="/feed"
          className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
            !activeCategoryId
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          <Sparkles size={18} /> Todos
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/feed?cat=${cat.id}`}
            className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
              activeCategoryId === cat.id
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <Sparkles size={18} /> {cat.nombre}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
