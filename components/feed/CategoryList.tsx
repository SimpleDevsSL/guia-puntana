import React from 'react';
import { Category } from '../../app/lib/definitions';
import { Flame, Droplets, Zap, Paintbrush, Hammer, Sparkles, Monitor, Truck } from 'lucide-react';

interface CategoryListProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ activeCategory, setActiveCategory }) => {
  
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case Category.GASISTA: return <Flame size={18} />;
      case Category.PLOMERIA: return <Droplets size={18} />;
      case Category.ELECTRICIDAD: return <Zap size={18} />;
      case Category.PINTURA: return <Paintbrush size={18} />;
      case Category.CARPINTERIA: return <Hammer size={18} />;
      case Category.LIMPIEZA: return <Sparkles size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="border-b border-gray-100 pb-1">
        <div className="overflow-x-auto no-scrollbar flex space-x-6 pb-4">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex items-center gap-2 pb-2 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2
                ${activeCategory === cat 
                  ? 'border-brand-orange text-brand-orange' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}
              `}
            >
              <span className={`p-1.5 rounded-lg ${activeCategory === cat ? 'bg-orange-50' : 'bg-gray-50'}`}>
                {getCategoryIcon(cat)}
              </span>
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;