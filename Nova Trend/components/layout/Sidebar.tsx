
import React from 'react';
import { Filter, X } from 'lucide-react';
import { BRANDS, RAM_OPTIONS, USE_CASES, CPU_BRANDS } from '../../services/mockData';
import { FilterState } from '../../types';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onClose }) => {
  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const handleBrandToggle = (brand: string) => {
    onFilterChange({ ...filters, brand: toggleItem(filters.brand, brand) });
  };

  const handleRamToggle = (ram: string) => {
    onFilterChange({ ...filters, memory: toggleItem(filters.memory, ram) });
  };

  const handleCpuBrandToggle = (cpu: string) => {
    onFilterChange({ ...filters, cpu_brand: toggleItem(filters.cpu_brand, cpu) });
  };

  return (
    <aside className="w-full lg:w-72 space-y-8 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" /> Filters
        </h3>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">Manufacturer</h4>
        <div className="space-y-3">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-zinc-800 rounded bg-zinc-900 checked:bg-orange-600 checked:border-orange-600 transition-all"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">Processor Brand</h4>
        <div className="flex flex-wrap gap-2">
          {CPU_BRANDS.map((cpu) => (
            <button
              key={cpu}
              onClick={() => handleCpuBrandToggle(cpu)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filters.cpu_brand.includes(cpu)
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                }`}
            >
              {cpu}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">RAM Capacity</h4>
        <div className="flex flex-wrap gap-2">
          {RAM_OPTIONS.map((ram) => (
            <button
              key={ram}
              onClick={() => handleRamToggle(ram)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filters.memory.includes(ram)
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">Max Budget</h4>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
          className="w-full accent-orange-600 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-zinc-500">
          <span>$0</span>
          <span className="text-orange-500 font-black">${filters.priceRange[1]}</span>
        </div>
      </div>

      <button
        onClick={() => onFilterChange({
          activeCategory: filters.activeCategory,
          brand: [],
          priceRange: [0, 5000],
          memory: [],
          cpu_brand: [],
          display_size: [],
          storage: [],
          panel_type: [],
          audio_type: [],
          noise_cancelling: null,
          compatibility: [],
          condition: [],
          connectivity: [],
          camera_resolution: [],
          sensor_size: [],
          ecosystem: [],
          battery_life: []
        })}
        className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all"
      >
        Clear Selection
      </button>
    </aside>
  );
};

export default Sidebar;
