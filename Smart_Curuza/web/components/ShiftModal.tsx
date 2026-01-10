import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { X, Play, Square, AlertCircle, History } from 'lucide-react';

interface Shift {
    id: string;
    start_time: string;
    end_time?: string;
    starting_cash: number;
    expected_cash: number;
    actual_cash?: number;
    difference?: number;
    status: 'OPEN' | 'CLOSED';
    notes?: string;
}

interface ShiftModalProps {
    onClose: () => void;
    onShiftChange: (shift: Shift | null) => void;
}

export default function ShiftModal({ onClose, onShiftChange }: ShiftModalProps) {
    const { showToast } = useToast();
    const [currentShift, setCurrentShift] = useState<Shift | null>(null);
    const [loading, setLoading] = useState(true);
    const [startingCash, setStartingCash] = useState<number>(0);
    const [actualCash, setActualCash] = useState<number>(0);
    const [notes, setNotes] = useState('');
    const [view, setView] = useState<'status' | 'open' | 'close' | 'history'>('status');
    const [history, setHistory] = useState<Shift[]>([]);

    useEffect(() => {
        fetchCurrentShift();
    }, []);

    const fetchCurrentShift = async () => {
        try {
            const shift = await api.get<Shift | null>('/merchants/shifts/current');
            setCurrentShift(shift);
            onShiftChange(shift);
            if (!shift) {
                setView('open');
            } else {
                setView('status');
            }
        } catch (error) {
            console.error('Failed to fetch current shift', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await api.get<Shift[]>('/merchants/shifts/history');
            setHistory(data);
            setView('history');
        } catch (error) {
            console.error('Failed to fetch shift history', error);
        }
    };

    const handleOpenShift = async () => {
        try {
            const shift = await api.post<Shift>('/merchants/shifts/open', { startingCash });
            setCurrentShift(shift);
            onShiftChange(shift);
            showToast('Shift opened successfully', 'success');
            setView('status');
        } catch (error) {
            showToast('Failed to open shift', 'error');
        }
    };

    const handleCloseShift = async () => {
        if (!currentShift) return;
        try {
            await api.patch(`/merchants/shifts/close/${currentShift.id}`, { actualCash, notes });
            setCurrentShift(null);
            onShiftChange(null);
            showToast('Shift closed successfully', 'success');
            onClose();
        } catch (error) {
            showToast('Failed to close shift', 'error');
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-platinum-600">
                    <h2 className="text-xl font-bold text-jet font-heading">Shift Management</h2>
                    <button onClick={onClose} className="text-jet-500 hover:text-jet transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {view === 'status' && currentShift && (
                        <div className="space-y-6">
                            <div className="bg-success/10 p-4 rounded-lg flex items-center gap-4">
                                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                                    <Play className="h-6 w-6 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-success-700 font-medium uppercase tracking-wider">Active Shift</p>
                                    <p className="text-jet font-bold">Started: {new Date(currentShift.start_time).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-platinum-800 p-3 rounded-lg">
                                    <p className="text-xs text-jet-500 uppercase">Starting Cash</p>
                                    <p className="text-lg font-bold text-jet">{Number(currentShift.starting_cash).toLocaleString()} RWF</p>
                                </div>
                                <div className="bg-platinum-800 p-3 rounded-lg">
                                    <p className="text-xs text-jet-500 uppercase">Expected Cash</p>
                                    <p className="text-lg font-bold text-jet">{Number(currentShift.expected_cash).toLocaleString()} RWF</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('close')}
                                    className="flex-1 py-3 bg-danger text-white rounded-lg font-bold hover:bg-danger/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Square className="h-5 w-5" />
                                    End Shift
                                </button>
                                <button
                                    onClick={fetchHistory}
                                    className="px-4 py-3 bg-platinum-200 text-jet rounded-lg font-medium hover:bg-platinum-300 transition-colors"
                                >
                                    <History className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'open' && (
                        <div className="space-y-6">
                            <div className="bg-gold/10 p-4 rounded-lg flex items-center gap-4">
                                <AlertCircle className="h-6 w-6 text-gold" />
                                <p className="text-sm text-jet-700">No active shift. Please open a shift to start selling.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-jet mb-2">Starting Cash (RWF)</label>
                                <input
                                    type="number"
                                    value={startingCash}
                                    onChange={(e) => setStartingCash(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-white border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none text-xl font-bold"
                                    placeholder="0"
                                />
                            </div>

                            <button
                                onClick={handleOpenShift}
                                className="w-full py-4 bg-gold text-onyx rounded-lg font-bold text-lg hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
                            >
                                Start Shift
                            </button>
                        </div>
                    )}

                    {view === 'close' && currentShift && (
                        <div className="space-y-6">
                            <div className="bg-platinum-800 p-4 rounded-lg">
                                <p className="text-sm text-jet-500 mb-1">Expected Cash in Drawer</p>
                                <p className="text-2xl font-bold text-jet">{Number(currentShift.expected_cash).toLocaleString()} RWF</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-jet mb-2">Actual Cash in Drawer (RWF)</label>
                                    <input
                                        type="number"
                                        value={actualCash}
                                        onChange={(e) => setActualCash(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none text-xl font-bold"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-jet mb-2">Notes (Optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-platinum-300 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none resize-none"
                                        rows={3}
                                        placeholder="Any discrepancies or observations..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setView('status')}
                                    className="flex-1 py-3 bg-platinum-200 text-jet rounded-lg font-medium hover:bg-platinum-300 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCloseShift}
                                    className="flex-[2] py-3 bg-danger text-white rounded-lg font-bold hover:bg-danger/90 transition-colors"
                                >
                                    Confirm & End Shift
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'history' && (
                        <div className="space-y-4">
                            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                                {history.map(s => (
                                    <div key={s.id} className="p-3 border border-platinum-600 rounded-lg text-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-jet">{new Date(s.start_time).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'OPEN' ? 'bg-success/10 text-success' : 'bg-platinum-200 text-jet-500'}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-jet-700">
                                            <p>Start: {new Date(s.start_time).toLocaleTimeString()}</p>
                                            {s.end_time && <p>End: {new Date(s.end_time).toLocaleTimeString()}</p>}
                                            <p>Expected: {Number(s.expected_cash).toLocaleString()}</p>
                                            {s.actual_cash !== undefined && <p>Actual: {Number(s.actual_cash).toLocaleString()}</p>}
                                        </div>
                                        {s.difference !== undefined && s.difference !== 0 && (
                                            <p className={`mt-1 font-bold ${Number(s.difference) < 0 ? 'text-danger' : 'text-success'}`}>
                                                Diff: {Number(s.difference).toLocaleString()} RWF
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setView('status')}
                                className="w-full py-2 bg-platinum-200 text-jet rounded-lg font-medium hover:bg-platinum-300 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
