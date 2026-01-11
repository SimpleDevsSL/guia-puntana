import React from "react";
import { Category } from "../../app/lib/definitions";
import { Sparkles } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategoryId,
  setActiveCategoryId,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-1">
        <div className="overflow-x-auto no-scrollbar flex space-x-6 pb-4">
          {/* Opción para ver todas las categorías */}
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`
              flex items-center gap-2 pb-2 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2
              ${
                !activeCategoryId
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white hover:border-gray-300"
              }
            `}
          >
            <span
              className={`p-1.5 rounded-lg ${
                !activeCategoryId
                  ? "bg-orange-50 dark:bg-orange-900/20"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <Sparkles size={18} />
            </span>
            Todos
          </button>

          {/* Mapeo de categorías desde la base de datos */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`
                flex items-center gap-2 pb-2 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2
                ${
                  activeCategoryId === cat.id
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-400 hover:border-gray-300"
                }
              `}
            >
              <span
                className={`p-1.5 rounded-lg ${
                  activeCategoryId === cat.id
                    ? "bg-orange-50 dark:bg-orange-900/20"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <Sparkles size={18} />
              </span>
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
