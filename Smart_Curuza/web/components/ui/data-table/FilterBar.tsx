import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
}

interface FilterBarProps {
    onSearch: (query: string) => void;
    filterGroups: FilterGroup[];
    activeFilters: Record<string, string>;
    onFilterChange: (groupId: string, value: string) => void;
    onClearFilter: (groupId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    onSearch,
    filterGroups,
    activeFilters,
    onFilterChange,
    onClearFilter,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-4 mb-6">
            {/* Search and Toggle */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Filter by name, ID, or tag..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    {showFilters ? 'Less Filters' : 'More Filters'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
                <div className="bg-platinum-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filterGroups.map((group) => (
                        <div key={group.id} className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {group.label}
                            </label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                value={activeFilters[group.id] || ''}
                                onChange={(e) => onFilterChange(group.id, e.target.value)}
                            >
                                <option value="">All</option>
                                {group.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}

            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([groupId, value]) => {
                    if (!value) return null;
                    const group = filterGroups.find((g) => g.id === groupId);
                    const option = group?.options.find((o) => o.value === value);
                    if (!group || !option) return null;

                    return (
                        <div
                            key={groupId}
                            className="flex items-center gap-2 bg-success text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                        >
                            <span>{group.label}: {option.label}</span>
                            <button
                                onClick={() => onClearFilter(groupId)}
                                className="hover:bg-white/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
