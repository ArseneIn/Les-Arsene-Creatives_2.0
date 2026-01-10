import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, ScanBarcode, Package, Ruler, DollarSign, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddProductModalProps {
    onClose: () => void;
    onSave: (product: any) => Promise<void>;
}

type UnitType = string;



export default function AddProductModal({ onClose, onSave }: AddProductModalProps) {
    const t = useTranslations('Inventory.AddProductModal');

    const UNITS = [
        { value: 'pcs', label: t('units.pcs') },
        { value: 'kg', label: t('units.kg') },
        { value: 'l', label: t('units.l') },
        { value: 'm', label: t('units.m') },
        { value: 'box', label: t('units.box') },
        { value: 'sack', label: t('units.sack') },
        { value: 'bottle', label: t('units.bottle') },
        { value: 'plate', label: t('units.plate') },
    ];
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Form State
    const [name, setName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [itemClsCd, setItemClsCd] = useState('');
    const [taxTyCd, setTaxTyCd] = useState('');

    const [sellingUnit, setSellingUnit] = useState<UnitType>('pcs');
    const [isBulk, setIsBulk] = useState(false);
    const [bulkUnit, setBulkUnit] = useState<UnitType>('box');
    const [conversionFactor, setConversionFactor] = useState(1);

    const [stockInput, setStockInput] = useState(''); // User input (could be bulk or single)
    const [costPriceInput, setCostPriceInput] = useState(''); // Cost per input unit
    const [sellingPrice, setSellingPrice] = useState(''); // Always per selling unit

    // Derived Values
    const calculatedStock = isBulk
        ? Number(stockInput) * conversionFactor
        : Number(stockInput);

    const calculatedCostPerItem = isBulk && conversionFactor > 0
        ? Number(costPriceInput) / conversionFactor
        : Number(costPriceInput);

    const estimatedMargin = sellingPrice && calculatedCostPerItem
        ? ((Number(sellingPrice) - calculatedCostPerItem) / Number(sellingPrice)) * 100
        : 0;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const productData = {
                name,
                barcode,
                unit: sellingUnit,
                stock: calculatedStock,
                cost_price: calculatedCostPerItem,
                price: Number(sellingPrice),
                conversion_factor: isBulk ? conversionFactor : 1,
                buying_unit: isBulk ? bulkUnit : null,
                itemClsCd,
                taxTyCd,
            };
            await onSave(productData);
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-surface p-8 rounded-full shadow-lg animate-in zoom-in duration-300 flex items-center justify-center">
                    <div className="rounded-full bg-success/20 p-4">
                        <div className="rounded-full bg-success text-white p-4 animate-bounce">
                            <Check className="h-12 w-12" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-surface p-8 rounded-xl shadow-lg animate-in zoom-in duration-300 flex flex-col items-center justify-center gap-4">
                    <div className="rounded-full bg-danger/20 p-4">
                        <div className="rounded-full bg-danger text-white p-4 animate-pulse">
                            <X className="h-12 w-12" />
                        </div>
                    </div>
                    <p className="text-danger font-bold text-lg">{t('failedToSave')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-platinum-600">
                    <div>
                        <h2 className="text-xl font-bold text-jet font-heading">{t('title')}</h2>
                        <p className="text-sm text-jet-700">{t('step', { step, total: 3 })}</p>
                    </div>
                    <button onClick={onClose} className="text-jet-700 hover:text-jet">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-200">
                            <div>
                                <label className="block text-sm font-medium text-jet-700 mb-1">{t('productName')}</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                        placeholder={t('productNamePlaceholder')}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-jet-700 mb-1">{t('barcode')}</label>
                                <div className="relative">
                                    <ScanBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={barcode}
                                        onChange={e => setBarcode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                        placeholder={t('barcodePlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* EBM Compliance Fields */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-platinum-600">
                                <div>
                                    <label className="block text-xs font-medium text-jet-700 mb-1">{t('itemClassCode')}</label>
                                    <input
                                        type="text"
                                        value={itemClsCd}
                                        onChange={e => setItemClsCd(e.target.value)}
                                        className="w-full p-2 border border-platinum-600 rounded focus:border-gold focus:outline-none text-sm"
                                        placeholder="e.g. 12345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-jet-700 mb-1">{t('taxTypeCode')}</label>
                                    <select
                                        value={taxTyCd}
                                        onChange={e => setTaxTyCd(e.target.value)}
                                        className="w-full p-2 border border-platinum-600 rounded focus:border-gold focus:outline-none text-sm bg-surface"
                                    >
                                        <option value="">{t('selectTaxType')}</option>
                                        <option value="A">A - Standard Rated (18%)</option>
                                        <option value="B">B - Exempt (0%)</option>
                                        <option value="C">C - Zero Rated (0%)</option>
                                        <option value="D">D - Special Rated</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-200">
                            <div>
                                <label className="block text-sm font-medium text-jet-700 mb-2">{t('sellingUnitQuestion')}</label>

                                {/* Custom Unit Input */}
                                <div className="mb-3">
                                    <label className="text-xs text-jet-700 mb-1 block">{t('unitNameLabel')}</label>
                                    <input
                                        type="text"
                                        value={sellingUnit}
                                        onChange={(e) => setSellingUnit(e.target.value)}
                                        className="w-full p-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none font-medium text-jet"
                                        placeholder={t('unitNamePlaceholder')}
                                    />
                                </div>

                                {/* Quick Select Presets */}
                                <p className="text-xs text-jet-700 mb-2">{t('commonUnitsLabel')}</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {UNITS.map(u => (
                                        <button
                                            key={u.value}
                                            onClick={() => setSellingUnit(u.value)}
                                            className={`p-2 rounded-lg border text-xs font-medium transition-all ${sellingUnit === u.value
                                                ? 'border-gold bg-gold/10 text-onyx'
                                                : 'border-platinum-600 hover:border-gold/50 text-jet-700'
                                                }`}
                                        >
                                            {u.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-platinum-800 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium text-jet">{t('bulkBuyQuestion')}</span>
                                    <div
                                        onClick={() => setIsBulk(!isBulk)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isBulk ? 'bg-gold' : 'bg-platinum-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isBulk ? 'translate-x-6' : ''}`} />
                                    </div>
                                </div>

                                {isBulk && (
                                    <div className="space-y-4 pt-2 border-t border-platinum-600">
                                        <div>
                                            <label className="block text-xs font-medium text-jet-700 mb-1">{t('bulkUnitLabel')}</label>
                                            {/* Custom Bulk Unit Input */}
                                            <input
                                                type="text"
                                                value={bulkUnit}
                                                onChange={e => setBulkUnit(e.target.value)}
                                                className="w-full p-2 rounded border border-platinum-600 bg-surface text-jet focus:border-gold focus:outline-none"
                                                placeholder={t('bulkUnitPlaceholder')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-jet-700 mb-1">
                                                {t('conversionQuestion', { sellingUnit, bulkUnit })}
                                            </label>
                                            <input
                                                type="number"
                                                value={conversionFactor}
                                                onChange={e => setConversionFactor(Number(e.target.value))}
                                                className="w-full p-2 rounded border border-platinum-600 focus:border-gold focus:outline-none"
                                            />
                                        </div>
                                        <div className="text-xs text-jet-700 bg-surface p-2 rounded border border-platinum-600">
                                            1 {bulkUnit} = {conversionFactor} {sellingUnit}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">
                                        {t('initialStock', { unit: isBulk ? bulkUnit : sellingUnit })}
                                    </label>
                                    <input
                                        type="number"
                                        value={stockInput}
                                        onChange={e => setStockInput(e.target.value)}
                                        className="w-full p-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-jet-700 mb-1">
                                        {t('buyingPrice', { unit: isBulk ? bulkUnit : sellingUnit })}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 text-sm">RWF</span>
                                        <input
                                            type="number"
                                            value={costPriceInput}
                                            onChange={e => setCostPriceInput(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-platinum-600 rounded-lg focus:border-gold focus:outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-platinum-600 pt-4">
                                <label className="block text-sm font-medium text-jet-700 mb-1">
                                    {t('sellingPrice', { unit: sellingUnit })}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-700 text-sm">RWF</span>
                                    <input
                                        type="number"
                                        value={sellingPrice}
                                        onChange={e => setSellingPrice(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gold rounded-lg focus:outline-none text-lg font-bold text-jet"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-platinum-800 p-4 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-jet-700">{t('totalStockBase')}:</span>
                                    <span className="font-medium text-jet">{calculatedStock} {sellingUnit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-jet-700">{t('costPerUnit', { unit: sellingUnit })}:</span>
                                    <span className="font-medium text-jet">{calculatedCostPerItem.toLocaleString()} RWF</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-platinum-600">
                                    <span className="text-jet-700">{t('estimatedMargin')}:</span>
                                    <span className={`font-bold ${estimatedMargin >= 20 ? 'text-success' : estimatedMargin > 0 ? 'text-warning' : 'text-danger'}`}>
                                        {estimatedMargin.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-platinum-600 flex justify-between">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 border border-platinum-600 text-jet rounded-lg hover:bg-platinum-500 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> {t('back')}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-platinum-600 text-jet rounded-lg hover:bg-platinum-500 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!name}
                            className="px-6 py-2 bg-jet text-white rounded-lg hover:bg-jet/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('next')} <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !sellingPrice}
                            className="px-6 py-2 bg-gradient-gold text-onyx rounded-lg shadow-gold hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {t('saveProduct')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
