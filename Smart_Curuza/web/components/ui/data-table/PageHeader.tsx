import React from 'react';
import { Download, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PageHeaderProps {
    title: string;
    onAdd?: () => void;
    onExport?: () => void;
    onImport?: () => void;
    actionLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    onAdd,
    onExport,
    onImport,
    actionLabel = 'Add New',
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-jet font-heading">{title}</h1>
            <div className="flex gap-3">
                {onExport && (
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                )}
                {onImport && (
                    <button
                        onClick={onImport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Upload className="h-4 w-4" />
                        Import
                    </button>
                )}
                {onAdd && (
                    <Button onClick={onAdd} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
