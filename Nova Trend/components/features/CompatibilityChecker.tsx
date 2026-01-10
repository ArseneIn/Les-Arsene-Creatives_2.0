import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Smartphone, Laptop, AlertCircle, ShieldCheck, Search, AlertTriangle } from 'lucide-react';
import { COMPATIBILITY_OPTIONS } from '../../services/mockData';

interface CompatibilityCheckerProps {
  compatibleModels: string[];
}

const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ compatibleModels = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const matchedModel = useMemo(() => {
    if (searchQuery.length < 2) return null;
    return compatibleModels.find(model =>
      model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, compatibleModels]);

  const hasSearch = searchQuery.length > 0;
  const isMatch = !!matchedModel;

  return (
    <div className="mt-8 pt-8 border-t border-zinc-100">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-[#FF8C00]" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
          Does this fit your device?
        </h4>
      </div>

      <div className="relative group">
        <div className={`
          absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors
          ${isMatch ? 'text-emerald-500' : hasSearch && !isMatch ? 'text-orange-500' : 'text-zinc-400'}
        `}>
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          placeholder="Type your model (e.g. iPhone 13)..."
          className={`
            w-full bg-white border-2 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none transition-all
            ${isMatch
              ? 'border-emerald-500 bg-emerald-50/20'
              : hasSearch && !isMatch
                ? 'border-orange-500 bg-orange-50/20'
                : 'border-zinc-100 group-hover:border-zinc-200 focus:border-[#FF8C00]'
            }
          `}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-3 min-h-[20px]">
        {isMatch ? (
          <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              ✅ Yes! Compatible with {matchedModel}
            </p>
          </div>
        ) : hasSearch && searchQuery.length >= 2 ? (
          <div className="flex items-center gap-2 text-orange-600 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              ⚠️ Not specifically listed. Ask Support!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CompatibilityChecker;
