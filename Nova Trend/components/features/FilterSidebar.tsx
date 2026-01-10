import React, { useState } from 'react';
import {
  ChevronDown, Filter, RotateCcw, X,
  Laptop, Headphones, Smartphone, MousePointer2,
  Cpu, Battery, Camera, Database, Zap, Speaker,
  Lightbulb, Cable, Router, ShieldCheck, Waves, Target, Wifi,
  ArrowUpDown, Layers, Gamepad2, Tablet, Watch
} from 'lucide-react';
import { BRANDS, RAM_OPTIONS, USE_CASES, CPU_BRANDS, AUDIO_TYPES, CONDITIONS, CATEGORIES } from '../../services/mockData';
import { FilterState } from '../../types';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-1.5">
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-[#FF8C00] checked:border-[#FF8C00] transition-all"
        checked={checked}
        onChange={onChange}
      />
      <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
  </label>
);

interface AccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group mb-3"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 dark:text-slate-500 group-hover:text-[#FF8C00] transition-colors">{icon}</span>}
          <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 group-hover:text-[#FF8C00] transition-colors">{title}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-600 transition-transform ${isOpen ? 'rotate-180 text-[#FF8C00]' : ''}`} />
      </button>
      {isOpen && (
        <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  availableBrands: string[];
  sortBy?: string;
  onSortChange?: (val: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onClose, availableBrands, sortBy, onSortChange }) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const renderDynamicFilters = () => {
    switch (filters.activeCategory) {
      case 'Laptops':
      case 'Gaming':
        return (
          <>
            <AccordionSection title="Processor Core" icon={<Cpu className="w-3.5 h-3.5" />}>
              {CPU_BRANDS.map(cpu => (
                <CheckboxItem
                  key={cpu} label={cpu}
                  checked={filters.cpu_brand.includes(cpu)}
                  onChange={() => updateFilter('cpu_brand', toggleItem(filters.cpu_brand, cpu))}
                />
              ))}
            </AccordionSection>
            <AccordionSection title="Memory Matrix" icon={<Zap className="w-3.5 h-3.5" />}>
              {RAM_OPTIONS.map(ram => (
                <CheckboxItem
                  key={ram} label={ram}
                  checked={filters.memory.includes(ram)}
                  onChange={() => updateFilter('memory', toggleItem(filters.memory, ram))}
                />
              ))}
            </AccordionSection>
          </>
        );
      case 'Audio':
        return (
          <>
            <AccordionSection title="Acoustic Type" icon={<Speaker className="w-3.5 h-3.5" />}>
              {AUDIO_TYPES.map(type => (
                <CheckboxItem
                  key={type} label={type}
                  checked={filters.audio_type.includes(type)}
                  onChange={() => updateFilter('audio_type', toggleItem(filters.audio_type, type))}
                />
              ))}
            </AccordionSection>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-[#FF8C00]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Refine Matrix</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
        {/* Sorting Matrix */}
        <AccordionSection title="Sort Priority" icon={<ArrowUpDown className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-1 gap-1 pt-1">
            {['Performance', 'Value Matrix', 'Arrival Date'].map((option) => (
              <button
                key={option}
                onClick={() => onSortChange?.(option)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === option
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#FF8C00]'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Manufacturer">
          {availableBrands.map(brand => (
            <CheckboxItem
              key={brand} label={brand}
              checked={filters.brand.includes(brand)}
              onChange={() => updateFilter('brand', toggleItem(filters.brand, brand))}
            />
          ))}
        </AccordionSection>

        {renderDynamicFilters()}

        <AccordionSection title="Price Matrix">
          <div className="px-1 pt-2">
            <input
              type="range" min="0" max="6000" step="50"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
            />
            <div className="flex justify-between mt-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Limit</span>
              <span className="text-sm font-black text-[#FF8C00]">${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Asset Condition">
          {CONDITIONS.map(cond => (
            <CheckboxItem
              key={cond} label={cond}
              checked={filters.condition.includes(cond)}
              onChange={() => updateFilter('condition', toggleItem(filters.condition, cond))}
            />
          ))}
        </AccordionSection>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <button
          onClick={() => onFilterChange({
            activeCategory: filters.activeCategory,
            brand: [], priceRange: [0, 6000], memory: [], cpu_brand: [],
            audio_type: [], connectivity: [], camera_resolution: [],
            sensor_size: [], ecosystem: [], compatibility: [], condition: [],
            display_size: [], noise_cancelling: null, storage: [], panel_type: [],
            battery_life: []
          })}
          className="w-full py-4 bg-slate-900 dark:bg-slate-800 hover:bg-[#FF8C00] dark:hover:bg-[#FF8C00] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Matrix
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;