import React from 'react';
import {
  Gamepad2,
  Smartphone,
  Tablet,
  Watch,
  Speaker,
  Camera,
  Lightbulb,
  Cable,
  Router,
  Laptop,
  Cpu,
  Monitor,
  Briefcase,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../services/mockData';

interface CategoryConfig {
  id: string;
  label: string;
  icon: any;
}

// Map category names to icons; fall back to Cable if unknown
const ICON_MAP: Record<string, any> = {
  'Laptops': Laptop,
  'Gaming': Gamepad2,
  'Phones': Smartphone,
  'Tablets': Tablet,
  'Wearables': Watch,
  'Audio': Speaker,
  'Photography': Camera,
  'Smart Home': Lightbulb,
  'Accessories': Cable,
  'Office': Router,
  'E-Bikes': Cpu
};

const CATEGORIES_MAP: CategoryConfig[] = CATEGORIES.map(cat => ({ id: cat, label: cat === 'Laptops' ? 'Computer' : cat, icon: ICON_MAP[cat] || Cable }));

interface CategorySwitcherProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategorySwitcher: React.FC<CategorySwitcherProps> = ({ activeCategory, onCategoryChange }) => {
  // Duplicating twice ensures that even on ultra-wide screens, there's always enough content to loop without a flicker
  const duplicatedCategories = [...CATEGORIES_MAP, ...CATEGORIES_MAP];

  return (
    <nav className="w-full bg-slate-800/50 border-y border-slate-700/50 backdrop-blur-md sticky top-16 z-50 overflow-hidden marquee-container h-16">
      <div className="flex animate-marquee whitespace-nowrap marquee-content items-center h-full">
        {duplicatedCategories.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                relative flex items-center gap-3 px-12 h-full transition-all duration-300 group inline-flex shrink-0
                ${isActive ? 'text-nova-orange' : 'text-slate-400 hover:text-white'}
              `}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-nova-orange' : 'text-slate-500 group-hover:text-nova-orange'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap brand-font">
                {cat.label}
              </span>

              {/* Active / Hover Feedback Node */}
              <div className={`
                absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] transition-all duration-300
                ${isActive ? 'w-1/2 bg-nova-orange opacity-100' : 'w-0 bg-nova-orange opacity-0 group-hover:w-1/3 group-hover:opacity-50'}
              `} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategorySwitcher;