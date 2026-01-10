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
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    onRowClick,
    loading,
}: DataTableProps<T>) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    }

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
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-12 text-center text-jet-500 font-body">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
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
            <div className="p-4 border-t border-platinum-200 flex justify-between items-center bg-platinum-50">
                <span className="text-sm text-jet-500 font-body">Showing <span className="font-semibold text-jet">{data.length}</span> results</span>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-platinum-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <ChevronLeft className="h-5 w-5 text-jet-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-platinum-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <ChevronRight className="h-5 w-5 text-jet-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
