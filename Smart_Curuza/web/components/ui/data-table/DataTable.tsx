import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    loading?: boolean;
    initialPageSize?: number;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    onRowClick,
    loading,
    initialPageSize = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(initialPageSize);

    // Reset to page 1 when data changes (e.g. search/filter)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-platinum-200 shadow-card p-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
                <p className="text-jet-500 animate-pulse font-medium">Loading records...</p>
            </div>
        );
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    return (
        <div className="bg-white rounded-xl border border-platinum-200 shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-platinum-50 border-b border-platinum-200">
                            <th className="p-5 w-10">
                                <input type="checkbox" className="rounded border-platinum-400 text-gold focus:ring-gold transition-colors duration-200" />
                            </th>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`p-5 text-xs font-bold text-jet-500 uppercase tracking-wider font-heading ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-platinum-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-12 text-center text-jet-500 font-body">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick && onRowClick(item)}
                                    className={`group hover:bg-platinum-50 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    <td className="p-5">
                                        <input type="checkbox" className="rounded border-platinum-300 text-gold focus:ring-gold group-hover:border-gold transition-colors duration-200" />
                                    </td>
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="p-5 text-sm text-jet-700 font-body">
                                            {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t-2 border-gold/30 flex flex-col sm:flex-row justify-between items-center bg-gold/5 gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <span className="text-sm text-onyx/70 font-body whitespace-nowrap">
                        Showing <span className="font-bold text-onyx">{totalItems > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-onyx">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="font-bold text-onyx">{totalItems}</span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-onyx/50 uppercase tracking-wider">Per page:</span>
                        <select 
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-xs border-gold/30 rounded-lg focus:ring-gold focus:border-gold bg-white py-1 px-3 font-bold text-onyx shadow-sm transition-all duration-200 cursor-pointer hover:border-gold"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none border-gold/10 pt-4 sm:pt-0">
                    <span className="text-xs text-onyx/60 font-bold uppercase tracking-widest">Page {currentPage} / {totalPages || 1}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handlePrevPage(); }}
                            className="p-2.5 rounded-xl hover:bg-gold hover:text-onyx border border-gold/20 bg-white shadow-sm transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-jet-600 group" 
                            disabled={currentPage === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4 text-onyx transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleNextPage(); }}
                            className="p-2.5 rounded-xl hover:bg-gold hover:text-onyx border border-gold/20 bg-white shadow-sm transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-jet-600 group" 
                            disabled={currentPage === totalPages || totalPages === 0 || loading}
                        >
                            <ChevronRight className="h-4 w-4 text-onyx transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
