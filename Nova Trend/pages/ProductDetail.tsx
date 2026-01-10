
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, ShoppingBag, ShieldCheck, Truck,
  MapPin, CheckCircle2, Zap, ArrowRight, Share2,
  Monitor, Cpu, Database, Battery, Settings, Info,
  ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, REVIEWS } from '../services/mockData';
import { Review, Product } from '../types';
import CompatibilityChecker from '../components/features/CompatibilityChecker';
import FrequentlyBoughtTogether from '../components/features/FrequentlyBoughtTogether';
import ReviewsSection from '../components/features/ReviewsSection';
import { useCart } from '../components/context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find(p => p.id === id);

  const [selectedImg, setSelectedImg] = useState(0);
  const [localReviews, setLocalReviews] = useState<Review[]>(REVIEWS);

  const productReviews = useMemo(() => {
    return localReviews.filter(r => r.productId === id);
  }, [localReviews, id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="text-orange-600 hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  const images = product.images || [product.image];
  const specs = product.technical_specs;

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(' ');
    }
    return String(value);
  };

  const summaryDetails = Object.entries(specs)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      label: key.replace(/_/g, ' ').toUpperCase(),
      value: formatValue(value)
    }));

  const handleAddBundle = (products: Product[]) => {
    products.forEach(p => addToCart(p));
  };

  const handleAddReview = (newReview: Partial<Review>) => {
    const fullReview: Review = {
      ...newReview as any,
      id: `r-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      isApproved: false
    };
    setLocalReviews(prev => [fullReview, ...prev]);
  };

  const TechTable = ({ data }: { data: { label: string; value: string }[] }) => (
    <div className="w-full border-t border-slate-200">
      {data.map((row, idx) => (
        <div key={idx} className="flex border-b border-slate-200 min-h-[44px] hover:bg-slate-50 transition-colors">
          <div className="w-[35%] sm:w-[250px] bg-slate-100 p-3 text-[10px] font-black text-slate-900 border-r border-slate-200 flex items-center uppercase tracking-widest">
            {row.label}
          </div>
          <div className="flex-1 bg-white p-3 text-xs font-semibold text-slate-700 flex items-center">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-32 selection:bg-orange-600 selection:text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-black font-black uppercase text-[10px] tracking-widest transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Inventory
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video rounded-[40px] overflow-hidden bg-slate-50 border border-slate-200 shadow-2xl">
              <img src={images[selectedImg]} className="w-full h-full object-cover" alt={product.name} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 flex items-center gap-6">
              <MapPin className="text-[#FF8C00] w-8 h-8" />
              <div className="flex-1">
                <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-1">Local Advantage</h4>
                <p className="text-slate-600 text-sm font-semibold">Verified In-Stock in Kigali. Zero Import Surprises.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Titan Approved</div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="fill-orange-500 w-4 h-4" />
                  <span className="text-[10px] font-black text-slate-600 uppercase ml-2">{product.rating} Community Matrix</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic leading-none mb-6">{product.name}</h1>
              <p className="text-slate-600 font-medium leading-relaxed text-lg">{product.description}</p>
            </div>

            <div className="bg-slate-50 rounded-[40px] p-10 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-end gap-6 mb-6">
                <div className="text-5xl font-black text-slate-900 italic tracking-tighter">${product.price.toLocaleString()}</div>
              </div>

              <button onClick={() => addToCart(product)} className="w-full bg-[#FF8C00] hover:bg-orange-500 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-orange-900/10">
                <ShoppingBag className="w-5 h-5" /> Secure Deployment
              </button>

              {product.category === 'Accessories' && specs.compatible_models && (
                <CompatibilityChecker compatibleModels={specs.compatible_models} />
              )}
            </div>
          </div>
        </div>

        {product.related_ids && product.related_ids.length > 0 && (
          <FrequentlyBoughtTogether
            currentProduct={product}
            relatedIds={product.related_ids}
            onAddBundleToCart={handleAddBundle}
          />
        )}

        <div className="mt-20">
          <div className="bg-slate-950 text-white px-8 py-6 rounded-t-2xl flex items-center gap-3">
            <Info className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-black uppercase tracking-tight italic">Technical Specification Registry</h2>
          </div>
          <div className="border-x border-b border-slate-200 rounded-b-2xl overflow-hidden">
            <TechTable data={summaryDetails} />
          </div>
        </div>

        <ReviewsSection
          product={product}
          reviews={productReviews}
          onAddReview={handleAddReview}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
