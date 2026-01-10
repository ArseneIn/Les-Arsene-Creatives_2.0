
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#FF8C00] dark:hover:text-[#FF8C00] transition-all group overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90"
      aria-label="Toggle visual theme"
    >
      <div className="relative z-10 flex items-center justify-center">
        {darkMode ? (
          <Sun className="w-4 h-4 animate-in zoom-in spin-in-90 duration-300" />
        ) : (
          <Moon className="w-4 h-4 animate-in zoom-in spin-in-90 duration-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8C00]/0 to-[#FF8C00]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default ThemeToggle;