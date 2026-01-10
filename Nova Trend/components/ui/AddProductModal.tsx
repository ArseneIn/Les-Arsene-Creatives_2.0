import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  X, Plus, Image as ImageIcon, DollarSign, Save, Zap,
  Trash2, Monitor, Cpu, Database, Battery, Settings,
  PlusCircle, Layout, Eye, ChevronRight, Star, Smartphone,
  Speaker, Lightbulb, Weight, Calendar, Bike, FastForward,
  Navigation, Sparkles, Loader2, AlertCircle, Info
} from 'lucide-react';
import { RAM_OPTIONS, CPU_BRANDS, USE_CASES, CONDITIONS } from '../../services/mockData';
import { Product } from '../../types';
import { suggestTechnicalSpecs, generateNarrative, validateMarketPrice } from '../../services/aiService';

interface DynamicAttr {
  id: string;
  key: string;
  value: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product?: Product | null;
}

const APPLE_PROCESSORS = ['M1', 'M1 Pro', 'M1 Max', 'M1 Ultra', 'M2', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max'];
const INTEL_AMD_PROCESSORS = ['Core i5', 'Core i7', 'Core i9', 'Core Ultra 7', 'Core Ultra 9', 'Ryzen 7', 'Ryzen 9'];

const INITIAL_CATEGORIES = ['Laptops', 'Phones', 'E-Bikes', 'Audio', 'Photography', 'Smart Home', 'Accessories', 'Office', 'Gaming', 'Tablets', 'Wearables'];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('Laptops');
  const [images, setImages] = useState<string[]>(['']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const { addLog } = useNotification();

  // AI States
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isValidatingPrice, setIsValidatingPrice] = useState(false);
  const [priceValidation, setPriceValidation] = useState<{ flag: string; reason: string } | null>(null);
  const [aiModifiedFields, setAiModifiedFields] = useState<Set<string>>(new Set());

  // Dynamic Attributes for "Undefined" categories
  const [dynamicAttrs, setDynamicAttrs] = useState<DynamicAttr[]>([]);

  const [formData, setFormData] = useState<any>({
    id: '',
    name: '',
    brand: 'Apple',
    price: '',
    stock_quantity: '10',
    useCase: 'Personal',
    condition: 'New',
    description: '',
    specs: {
      memory: '16GB',
      cpu_brand: 'Apple',
      cpu_model: 'M3 Pro',
      storage: '512GB SSD',
      display: {
        size: '14"',
        panel: 'OLED',
        resolution: '3.5K',
        refresh_rate: '120Hz'
      },
      battery_life: '18 Hours',
      weight_lbs: '3.4',
      model_year: '2024',
      // E-Bike Presets
      motor_power: '750W',
      battery_capacity: '48V 15Ah',
      top_speed: '45 km/h',
      range: '80 km',
      bike_weight: '25 kg'
    }
  });

  useEffect(() => {
    if (product && isOpen) {
      setSelectedCategory(product.category || 'Laptops');
      setImages(product.images && product.images.length > 0 ? product.images : [product.image || '']);
      const technicalSpecs = product.technical_specs || product.specs || {};

      setFormData({
        ...product,
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '10',
        specs: { ...formData.specs, ...technicalSpecs }
      });

      // If it's a non-standard category, populate dynamic attrs
      if (!['Laptops', 'Phones', 'E-Bikes'].includes(product.category)) {
        const attrs = Object.entries(technicalSpecs).map(([k, v]) => ({
          id: Math.random().toString(36).substr(2, 9),
          key: k.replace(/_/g, ' ').toUpperCase(),
          value: String(v)
        }));
        setDynamicAttrs(attrs);
      }
    } else if (!product && isOpen) {
      setImages(['']);
      setDynamicAttrs([]);
      setAiModifiedFields(new Set());
      setPriceValidation(null);
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        specs: { ...prev.specs, [field]: value }
      }));
    } else if (name.startsWith('display.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        specs: {
          ...prev.specs,
          display: { ...prev.specs.display, [field]: value }
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleDynamicAttrChange = (id: string, field: 'key' | 'value', val: string) => {
    setDynamicAttrs(prev => prev.map(attr => attr.id === id ? { ...attr, [field]: val } : attr));
  };

  const addDynamicAttr = () => {
    setDynamicAttrs([...dynamicAttrs, { id: Math.random().toString(36).substr(2, 9), key: '', value: '' }]);
  };

  const removeDynamicAttr = (id: string) => {
    setDynamicAttrs(prev => prev.filter(attr => attr.id !== id));
  };

  const handleAiSuggestSpecs = async () => {
    if (!formData.name || !formData.brand) {
      alert("Asset Designation and Manufacturer required for AI sync.");
      return;
    }
    setIsSuggesting(true);
    const suggested = await suggestTechnicalSpecs(formData.name, formData.brand, selectedCategory);
    if (suggested) {
      const updatedAiFields = new Set(aiModifiedFields);

      if (['Laptops', 'Phones', 'E-Bikes'].includes(selectedCategory)) {
        const newSpecs = { ...formData.specs };
        Object.entries(suggested).forEach(([k, v]) => {
          if (k.startsWith('display_')) {
            const field = k.replace('display_', '');
            newSpecs.display[field] = v;
          } else {
            newSpecs[k] = v;
          }
          updatedAiFields.add(`specs.${k}`);
        });
        setFormData(prev => ({ ...prev, specs: newSpecs }));
      } else {
        const attrs = Object.entries(suggested).map(([k, v]) => ({
          id: Math.random().toString(36).substr(2, 9),
          key: k.replace(/_/g, ' ').toUpperCase(),
          value: String(v)
        }));
        setDynamicAttrs(attrs);
        updatedAiFields.add('dynamic');
      }
      setAiModifiedFields(updatedAiFields);
    }
    setIsSuggesting(false);
  };

  const handleAiGenerateNarrative = async () => {
    setIsGeneratingNarrative(true);
    const narrative = await generateNarrative(formData.name, formData.brand, formData.specs);
    if (narrative) {
      setFormData(prev => ({ ...prev, description: narrative }));
      setAiModifiedFields(prev => new Set(prev).add('description'));
    }
    setIsGeneratingNarrative(false);
  };

  const handlePriceValidation = async () => {
    if (!formData.price || isNaN(parseFloat(formData.price))) return;
    setIsValidatingPrice(true);
    const validation = await validateMarketPrice(formData.name, parseFloat(formData.price), formData.condition);
    setPriceValidation(validation);
    setIsValidatingPrice(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Package Payload
    let finalSpecs: any = {};

    if (selectedCategory === 'Laptops') {
      const { memory, cpu_brand, cpu_model, storage, display, battery_life, weight_lbs, model_year } = formData.specs;
      finalSpecs = { memory, cpu_brand, cpu_model, storage, display, battery_life, weight_lbs, model_year };
    } else if (selectedCategory === 'Phones') {
      const { os, camera, sim_type, battery_mah } = formData.specs;
      finalSpecs = { os, camera, sim_type, battery_mah };
    } else if (selectedCategory === 'E-Bikes') {
      const { motor_power, battery_capacity, top_speed, range, bike_weight } = formData.specs;
      finalSpecs = { motor_power, battery_capacity, top_speed, range, bike_weight };
    } else {
      // Dynamic Attributes Mapping
      dynamicAttrs.forEach(attr => {
        if (attr.key.trim()) {
          const snakeKey = attr.key.trim().toLowerCase().replace(/\s+/g, '_');
          finalSpecs[snakeKey] = attr.value;
        }
      });
    }

    onSave({
      ...formData,
      category: selectedCategory,
      image: images[0],
      images: images.filter(img => img.trim() !== ''),
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      technical_specs: finalSpecs
    });
    addLog('Inventory', `Asset ${product ? 'Updated' : 'Deployed'}: ${formData.name}`);
    onClose();
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...images];
    newImages[index] = val;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handleAddCategory = () => {
    if (newCatName && !categories.includes(newCatName)) {
      setCategories([...categories, newCatName]);
      setSelectedCategory(newCatName);
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-[#FF4F00] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700";
  const labelClasses = "text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase ml-1 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-[40px] max-w-[95vw] w-[1200px] h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 transition-colors">

        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10 transition-colors">
          <div>
            <h2 className="text-3xl font-black text-black dark:text-white uppercase italic leading-none">
              {product ? 'Modify Asset' : 'New Asset'} <span className="text-[#FF4F00]">{product ? 'Registry' : 'Deployment'}</span>
            </h2>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Titan Smart-Wizard v10.5 // AI Intelligence Layer Active</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500"><X /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: FORM SIDE */}
          <form onSubmit={handleSubmit} id="asset-form" className="flex-[1.4] overflow-y-auto p-10 space-y-12 border-r border-slate-100 dark:border-slate-800 no-scrollbar transition-colors">

            {/* 1. Primary Identity */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-nova-orange flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5" /> Core Identity Matrix
                </h3>
                <button
                  type="button"
                  onClick={handleAiSuggestSpecs}
                  disabled={isSuggesting}
                  className="bg-[#FF4F00]/10 hover:bg-[#FF4F00] hover:text-white text-[#FF4F00] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-[#FF4F00]/20 disabled:opacity-50"
                >
                  {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Auto-Spec
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Asset Designation</label>
                  <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. MacBook Pro 16 (M3 Max)" className={inputClasses} />
                </div>

                <div className="space-y-1">
                  <label className={labelClasses}>Manufacturer</label>
                  <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className={inputClasses} />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Vertical Category</label>
                    <button type="button" onClick={() => setIsAddingCategory(true)} className="text-[9px] font-black text-nova-orange uppercase hover:underline">+ Add New</button>
                  </div>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputClasses + " appearance-none"}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 2. Price & Inventory */}
            <section className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-nova-orange flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5" /> Market Value & Stock
              </h3>
              <div className="grid grid-cols-3 gap-6 relative">
                <div className="space-y-1">
                  <label className={labelClasses}>Deployment Price ($)</label>
                  <input
                    required type="number" name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handlePriceValidation}
                    placeholder="2999"
                    className={inputClasses}
                  />
                  {isValidatingPrice && <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded mt-1 overflow-hidden"><div className="h-full bg-[#FF4F00] animate-progress" style={{ width: '50%' }} /></div>}
                  {priceValidation && (
                    <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className={`w-3 h-3 shrink-0 mt-0.5 ${priceValidation.flag.toLowerCase().includes('premium') ? 'text-[#FF4F00]' : 'text-emerald-500'}`} />
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-900 dark:text-slate-100 leading-none mb-1">{priceValidation.flag}</p>
                        <p className="text-[8px] font-medium text-slate-500 dark:text-slate-400">{priceValidation.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Registry Stock</label>
                  <input required type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="10" className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Condition Class</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className={inputClasses}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 3. DYNAMIC TECHNICAL PARAMETERS */}
            <section className="space-y-8 p-8 bg-slate-50 dark:bg-slate-950/40 rounded-[32px] border border-slate-100 dark:border-slate-800 transition-colors relative">
              {isSuggesting && (
                <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FF4F00]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF4F00]">AI SPEC DISCOVERY...</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF4F00]" /> Technical Payload: {selectedCategory}
                </h3>
                {!['Laptops', 'Phones', 'E-Bikes'].includes(selectedCategory) && (
                  <button
                    type="button"
                    onClick={addDynamicAttr}
                    className="bg-[#FF4F00] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/10"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Technical Attribute
                  </button>
                )}
              </div>

              {selectedCategory === 'Laptops' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="space-y-1">
                    <label className={labelClasses}>
                      CPU Architecture {aiModifiedFields.has('specs.cpu_brand') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}
                    </label>
                    <select disabled={formData.brand === 'Apple'} name="specs.cpu_brand" value={formData.specs.cpu_brand} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors">
                      {CPU_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>
                      Processor Model {aiModifiedFields.has('specs.cpu_model') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}
                    </label>
                    <input name="specs.cpu_model" value={formData.specs.cpu_model} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>
                      Memory Matrix {aiModifiedFields.has('specs.memory') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}
                    </label>
                    <input name="specs.memory" value={formData.specs.memory} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>
                      Storage Node {aiModifiedFields.has('specs.storage') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}
                    </label>
                    <input name="specs.storage" value={formData.specs.storage} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors" />
                  </div>
                  <div className="col-span-2 grid grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="space-y-1">
                      <label className={labelClasses}>Panel Size</label>
                      <input name="display.size" value={formData.specs.display.size} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Panel Type</label>
                      <input name="display.panel" value={formData.specs.display.panel} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Resolution</label>
                      <input name="display.resolution" value={formData.specs.display.resolution} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Refresh</label>
                      <input name="display.refresh_rate" value={formData.specs.display.refresh_rate} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'Phones' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
                  <div className="space-y-1">
                    <label className={labelClasses}>Environment</label>
                    <select name="specs.os" value={formData.specs.os} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors">
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Optics {aiModifiedFields.has('specs.camera') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.camera" value={formData.specs.camera} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>SIM Config</label>
                    <select name="specs.sim_type" value={formData.specs.sim_type} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors">
                      <option value="Physical SIM">Physical SIM</option>
                      <option value="eSIM">eSIM</option>
                      <option value="Dual SIM (Hybrid)">Dual SIM (Hybrid)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Density (mAh) {aiModifiedFields.has('specs.battery_mah') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.battery_mah" value={formData.specs.battery_mah} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
              )}

              {selectedCategory === 'E-Bikes' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
                  <div className="space-y-1">
                    <label className={labelClasses}>Motor {aiModifiedFields.has('specs.motor_power') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.motor_power" value={formData.specs.motor_power} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Battery {aiModifiedFields.has('specs.battery_capacity') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.battery_capacity" value={formData.specs.battery_capacity} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Vector Speed {aiModifiedFields.has('specs.top_speed') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.top_speed" value={formData.specs.top_speed} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Range {aiModifiedFields.has('specs.range') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}</label>
                    <input name="specs.range" value={formData.specs.range} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors" />
                  </div>
                </div>
              )}

              {/* Dynamic Attribute Builder for Undefined Categories */}
              {!['Laptops', 'Phones', 'E-Bikes'].includes(selectedCategory) && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  {dynamicAttrs.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] transition-colors">
                      <Settings className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase italic">Dynamic Attribute Builder Activated for "{selectedCategory}".</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Add custom technical rows or use AI Auto-Spec.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dynamicAttrs.map((attr) => (
                        <div key={attr.id} className="flex gap-3 animate-in slide-in-from-left-1 duration-200 items-end">
                          <div className="flex-1 space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                              {aiModifiedFields.has('dynamic') && <Sparkles className="w-2 h-2 text-[#FF4F00]" />} Attribute Name
                            </label>
                            <input
                              value={attr.key}
                              onChange={(e) => handleDynamicAttrChange(attr.id, 'key', e.target.value)}
                              placeholder="e.g. LUMENS"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:border-[#FF4F00]"
                            />
                          </div>
                          <div className="flex-[2] space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Attribute Value</label>
                            <input
                              value={attr.value}
                              onChange={(e) => handleDynamicAttrChange(attr.id, 'value', e.target.value)}
                              placeholder="e.g. 1500 LM"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#FF4F00]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDynamicAttr(attr.id)}
                            className="p-3 text-slate-300 hover:text-red-500 transition-colors mb-0.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 4. Media Assets */}
            <section className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-nova-orange flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Media Registry
                </h3>
                <button type="button" onClick={addImageField} className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-colors">
                  <Plus className="w-3 h-3" /> Add Image URL
                </button>
              </div>
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div key={i} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-10 h-10 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-black text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors">{i + 1}</div>
                    <input value={img} onChange={(e) => handleImageChange(i, e.target.value)} placeholder="https://unsplash.com/..." className={inputClasses + " py-2.5"} />
                    {images.length > 1 && (
                      <button type="button" onClick={() => removeImageField(i)} className="p-2.5 text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Description */}
            <section className="space-y-2 relative">
              <div className="flex justify-between items-center mb-1 px-1">
                <label className={labelClasses}>
                  Asset Narrative {aiModifiedFields.has('description') && <Sparkles className="w-2.5 h-2.5 text-[#FF4F00]" />}
                </label>
                <button
                  type="button"
                  onClick={handleAiGenerateNarrative}
                  disabled={isGeneratingNarrative}
                  className="bg-[#FF4F00]/10 hover:bg-[#FF4F00] hover:text-white text-[#FF4F00] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-[#FF4F00]/20 disabled:opacity-50"
                >
                  {isGeneratingNarrative ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Pro Copy
                </button>
              </div>

              {isGeneratingNarrative ? (
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                </div>
              ) : (
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-[#FF4F00] transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="Explain the value proposition for the Rwandan consumer..." />
              )}
            </section>
          </form>

          {/* RIGHT: LIVE PREVIEW SIDE */}
          <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col p-10 overflow-y-auto no-scrollbar transition-colors">
            <div className="sticky top-0">
              <div className="flex items-center gap-2 mb-8">
                <Eye className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Shop Floor Render (Live)</h3>
              </div>

              {/* Render actual Product Card UI */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[40px] overflow-hidden shadow-2xl scale-[0.95] origin-top transition-colors">
                <div className="aspect-square bg-slate-50 dark:bg-slate-900 p-12 flex items-center justify-center relative transition-colors">
                  {images[0] ? (
                    <img src={images[0]} className="w-full h-full object-contain" alt="" />
                  ) : (
                    <Layout className="w-20 h-20 text-slate-200 dark:text-slate-800" />
                  )}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="bg-[#FF4F00] text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">DEPLOYMENT READY</div>
                    <div className="bg-white/90 dark:bg-black/60 backdrop-blur shadow-sm border border-slate-100 dark:border-white/10 text-black dark:text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest transition-colors">{formData.condition}</div>
                  </div>
                  <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/60 backdrop-blur shadow-sm px-2 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-100 dark:border-white/10 transition-colors">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-black text-slate-900 dark:text-white">4.9</span>
                  </div>
                </div>
                <div className="p-10 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-nova-orange uppercase tracking-widest mb-1">{formData.brand || 'MANUFACTURER'}</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none transition-colors">{formData.name || 'ASSET DESIGNATION'}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 dark:border-slate-700 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Primary Metric</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 transition-colors italic">
                        {selectedCategory === 'Laptops' ? formData.specs.cpu_model :
                          selectedCategory === 'Phones' ? formData.specs.os :
                            selectedCategory === 'E-Bikes' ? formData.specs.motor_power :
                              dynamicAttrs[0]?.value || 'VARIABLE'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Secondary Metric</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 transition-colors italic">
                        {selectedCategory === 'Laptops' ? formData.specs.memory :
                          selectedCategory === 'Phones' ? formData.specs.storage :
                            selectedCategory === 'E-Bikes' ? formData.specs.top_speed :
                              dynamicAttrs[1]?.value || 'SCALABLE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-3xl font-black text-black dark:text-white italic transition-colors">${parseFloat(formData.price || '0').toLocaleString()}</p>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center text-white transition-colors"><Zap className="w-4 h-4" /></div>
                      <div className="px-6 h-10 bg-nova-orange rounded-xl flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/10">Secure Item</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Protocol Visible */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex gap-4 transition-colors">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-blue-900 dark:text-blue-200 uppercase mb-1">Audit Protocol</p>
                  <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-relaxed font-medium uppercase">All specs entered will be stored as JSONB for advanced comparison engine indexing. Verified for Rwanda Tech Standard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-4 z-10 transition-colors">
          <button onClick={onClose} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-slate-200 dark:hover:bg-slate-700">Abort Session</button>
          <button type="submit" form="asset-form" className="flex-[2] py-5 bg-[#FF4F00] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20 active:scale-95 transition-all">
            <Save className="w-5 h-5 fill-white" /> {product ? 'Sync Registry Update' : 'Finalize Asset Deployment'}
          </button>
        </div>

        {/* Add Category Popup */}
        {isAddingCategory && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingCategory(false)} />
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-[32px] w-full max-w-sm shadow-2xl animate-in zoom-in-95 transition-colors">
              <h4 className="text-xl font-black text-black dark:text-white uppercase italic mb-6">Deploy New <span className="text-nova-orange">Vertical</span></h4>
              <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Category Name..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-bold text-slate-900 dark:text-white outline-none focus:border-nova-orange mb-6 transition-all" autoFocus />
              <div className="flex gap-3">
                <button onClick={() => setIsAddingCategory(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl font-black uppercase text-[10px]">Cancel</button>
                <button onClick={handleAddCategory} className="flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px]">Commit Vertical</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;