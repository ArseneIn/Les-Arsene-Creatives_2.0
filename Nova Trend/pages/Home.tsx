
import React, { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../services/mockData';
import FilterSidebar from '../components/features/FilterSidebar';
import ProductGrid from '../components/features/ProductGrid';
import CategorySwitcher from '../components/features/CategorySwitcher';
import ComparisonBar from '../components/features/ComparisonBar';
import ComparisonEngine from '../components/features/ComparisonEngine';
import NovaHeroCarousel from '../components/features/NovaHeroCarousel';
import { FilterState } from '../types';
import { useCart } from '../components/context/CartContext';
import { useShop } from '../components/context/ShopContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleCompare, clearCompare, comparingProducts, setQuickViewProduct } = useShop();

  const [activeCategory, setActiveCategory] = useState('Laptops');
  const [sortBy, setSortBy] = useState('Performance');
  const [filters, setFilters] = useState<FilterState>({
    activeCategory: 'Laptops',
    brand: [], priceRange: [0, 6000], memory: [], cpu_brand: [],
    display_size: [], audio_type: [], noise_cancelling: null,
    compatibility: [], condition: [], storage: [], panel_type: [],
    battery_life: [], camera_resolution: [], connectivity: [],
    sensor_size: [], ecosystem: []
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setFilters(prev => ({
      ...prev,
      activeCategory: cat,
      brand: [],
      memory: [], cpu_brand: [], audio_type: [], noise_cancelling: null,
      compatibility: [], storage: [], battery_life: [], camera_resolution: [],
      display_size: [], panel_type: [], connectivity: [], sensor_size: [], ecosystem: []
    }));
  };

  const categoryBrands = useMemo(() => {
    const brands = PRODUCTS
      .filter(p => p.category === activeCategory)
      .map(p => p.brand);
    return Array.from(new Set(brands)).sort();
  }, [activeCategory]);

  const processedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== activeCategory && activeCategory !== 'Registry') return false;
      if (filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
      if (p.price > filters.priceRange[1]) return false;
      if (filters.condition.length > 0 && !filters.condition.includes(p.condition)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'Performance') return b.rating - a.rating;
      if (sortBy === 'Value Matrix') return a.price - b.price;
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [filters, activeCategory, sortBy]);

  const comparingIds = useMemo(() => comparingProducts.map(p => p.id), [comparingProducts]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-registry');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-fresh-void transition-colors duration-300 pb-32">

      {/* High-Performance Media Carousel */}
      <NovaHeroCarousel
        onAccessCatalog={scrollToCatalog}
        onLaunchMatrix={() => navigate('/comparison-tool')} // Updated to use navigate
      />

      {/* Horizontal Registry Navigation Node */}
      <div id="catalog-registry">
        <CategorySwitcher activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>

      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Registry Control Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-40 fresh-border rounded-[40px] overflow-hidden bg-slate-900/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-nova-orange/30">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                availableBrands={categoryBrands}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Dashboard Pulse Main Content */}
          <div className="flex-1 space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-3">
                  Fleet <span className="text-nova-orange">Inventory</span>
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-nova-orange rounded-full animate-pulse" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest brand-font">
                    {activeCategory} Sector // Kigali Hub Synchronized
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-nova-orange" /> Refine Matrix
              </button>
            </div>

            <ProductGrid
              products={processedProducts}
              onAddToCart={addToCart}
              onQuickView={setQuickViewProduct}
              onCompareToggle={toggleCompare}
              onNavigate={(page, params) => navigate(page === 'detail' ? `/ product / ${params.id} ` : ` / ${page} `)} // Adapted for grid
              comparingIds={comparingIds}
            />
          </div>
        </div>
      </section>

      <ComparisonBar
        products={comparingProducts}
        onRemove={(id) => {
          const productToRemove = comparingProducts.find(p => p.id === id);
          if (productToRemove) toggleCompare(productToRemove);
        }}
        onClear={clearCompare}
        onCompare={() => setIsMatrixModalOpen(true)}
      />

      {showMobileFilters && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900 animate-in slide-in-from-left duration-300 shadow-2xl">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              availableBrands={categoryBrands}
              onClose={() => setShowMobileFilters(false)}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      )}

      {isMatrixModalOpen && (
        <ComparisonEngine
          products={comparingProducts}
          onRemove={toggleCompare}
          onClose={() => setIsMatrixModalOpen(false)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Home;