import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Switch } from 'react-native';
import { X, Save, Package, Barcode, Tag, Scale, Briefcase, FileText, ArrowRight, ArrowLeft, Layers, Percent } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProductModal({ visible, onClose, onSuccess }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    
    // Form State
    const [product, setProduct] = useState({
        name: '',
        barcode: '',
        unit: 'pcs',
        price: '', // Selling price per unit
        itemClsCd: '',
        taxTyCd: ''
    });

    // Bulk & Initial Stock State
    const [isBulk, setIsBulk] = useState(false);
    const [bulkUnit, setBulkUnit] = useState('box');
    const [conversionFactor, setConversionFactor] = useState('1');
    const [stockInput, setStockInput] = useState(''); // Number of buying units (boxes or pcs)
    const [costInput, setCostInput] = useState(''); // Total cost for the stockInput

    // Derived Calculations
    const derivedValues = useMemo(() => {
        const factor = parseFloat(conversionFactor) || 1;
        const totalItems = (parseFloat(stockInput) || 0) * (isBulk ? factor : 1);
        const totalCost = parseFloat(costInput) || 0;
        
        // Unit Cost: The price per single unit (e.g. per piece)
        const unitCost = totalItems > 0 ? totalCost / totalItems : 0;
        
        // Margin Calculation
        const sellingPrice = parseFloat(product.price) || 0;
        const margin = sellingPrice > 0 ? ((sellingPrice - unitCost) / sellingPrice) * 100 : 0;

        return {
            totalItems,
            unitCost,
            margin,
            factor
        };
    }, [isBulk, conversionFactor, stockInput, costInput, product.price]);

    const handleSave = async () => {
        if (!product.name || !product.price || !costInput) {
            Alert.alert('Error', 'Product Name, Selling Price, and Initial Cost are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...product,
                price: parseFloat(product.price),
                cost_price: derivedValues.unitCost, // Store the per-unit cost for accuracy
                stock: derivedValues.totalItems, // Initial stock from step 3
                conversion_factor: isBulk ? derivedValues.factor : 1,
                buying_unit: isBulk ? bulkUnit : product.unit,
            };
            
            await ApiClient.createProduct(payload);
            
            Alert.alert('Success', 'Product created with initial stock!');
            resetForm();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create product:', error);
            Alert.alert('Error', 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setProduct({ name: '', barcode: '', price: '', unit: 'pcs', itemClsCd: '', taxTyCd: '' });
        setIsBulk(false);
        setBulkUnit('box');
        setConversionFactor('1');
        setStockInput('');
        setCostInput('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
                    
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>New Product</Text>
                            <Text style={styles.subTitle}>Step {step} of 3</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        
                        {step === 1 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Identity & Compliance</Text>
                                
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Product Name *</Text>
                                    <View style={styles.inputContainer}>
                                        <Package size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={product.name}
                                            onChangeText={(text) => setProduct(prev => ({ ...prev, name: text }))}
                                            placeholder="e.g. Milk 1L"
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Barcode (Optional)</Text>
                                    <View style={styles.inputContainer}>
                                        <Barcode size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={product.barcode}
                                            onChangeText={(text) => setProduct(prev => ({ ...prev, barcode: text }))}
                                            placeholder="Scan barcode"
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.label}>Item Class (RRA)</Text>
                                        <View style={styles.inputContainer}>
                                            <FileText size={18} color="#9CA3AF" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={product.itemClsCd}
                                                onChangeText={(text) => setProduct(prev => ({ ...prev, itemClsCd: text }))}
                                                placeholder="Code"
                                                placeholderTextColor="#6B7280"
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.label}>Tax Type</Text>
                                        <View style={styles.inputContainer}>
                                            <FileText size={18} color="#9CA3AF" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={product.taxTyCd}
                                                onChangeText={(text) => setProduct(prev => ({ ...prev, taxTyCd: text }))}
                                                placeholder="e.g. B"
                                                placeholderTextColor="#6B7280"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Units & Conversions</Text>
                                
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Selling Unit (Base)</Text>
                                    <View style={styles.inputContainer}>
                                        <Scale size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={product.unit}
                                            onChangeText={(text) => setProduct(prev => ({ ...prev, unit: text }))}
                                            placeholder="pcs, kg, Liters..."
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                </View>

                                <View style={styles.bulkToggleContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.bulkToggleTitle}>Manage Bulk Buying?</Text>
                                        <Text style={styles.bulkToggleDesc}>Buy in boxes/sacks, sell in pieces</Text>
                                    </View>
                                    <Switch 
                                        value={isBulk} 
                                        onValueChange={setIsBulk}
                                        trackColor={{ false: '#3E3E3E', true: '#fbe134' }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>

                                {isBulk && (
                                    <View style={styles.bulkContent}>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Buying Unit (e.g. Box)</Text>
                                            <View style={styles.inputContainer}>
                                                <Layers size={18} color="#9CA3AF" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={bulkUnit}
                                                    onChangeText={setBulkUnit}
                                                    placeholder="Box"
                                                    placeholderTextColor="#6B7280"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Conversion Factor</Text>
                                            <View style={styles.inputContainer}>
                                                <Layers size={18} color="#9CA3AF" style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.input}
                                                    value={conversionFactor}
                                                    onChangeText={setConversionFactor}
                                                    keyboardType="numeric"
                                                    placeholder="Items per box"
                                                    placeholderTextColor="#6B7280"
                                                />
                                            </View>
                                            <Text style={styles.mathNote}>1 {bulkUnit} = {conversionFactor} {product.unit}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {step === 3 && (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Initial Stock & Pricing</Text>
                                
                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.label}>Qty ({isBulk ? bulkUnit : product.unit})</Text>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                value={stockInput}
                                                onChangeText={setStockInput}
                                                placeholder="0"
                                                keyboardType="numeric"
                                                placeholderTextColor="#6B7280"
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.label}>Total Buying Cost</Text>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                value={costInput}
                                                onChangeText={setCostInput}
                                                placeholder="0 RWF"
                                                keyboardType="numeric"
                                                placeholderTextColor="#6B7280"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Final Selling Price (per {product.unit}) *</Text>
                                    <View style={[styles.inputContainer, { borderColor: '#fbe134', height: 60 }]}>
                                        <Tag size={20} color="#fbe134" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, { fontSize: 18, fontFamily: 'Poppins_700Bold' }]}
                                            value={product.price}
                                            onChangeText={(text) => setProduct(prev => ({ ...prev, price: text }))}
                                            placeholder="0 RWF"
                                            keyboardType="numeric"
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                </View>

                                {/* ACCURACY: Margin Calculator Card */}
                                <View style={styles.marginCard}>
                                    <View style={styles.marginRow}>
                                        <View style={styles.marginItem}>
                                            <Text style={styles.marginLabel}>Unit Cost</Text>
                                            <Text style={styles.marginValue}>{Math.round(derivedValues.unitCost).toLocaleString()} RWF</Text>
                                        </View>
                                        <View style={styles.marginItem}>
                                            <Text style={styles.marginLabel}>Profit / Unit</Text>
                                            <Text style={styles.marginValue}>{(parseFloat(product.price) - derivedValues.unitCost).toLocaleString()} RWF</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.marginProgressContainer}>
                                        <View style={styles.marginHeader}>
                                            <Text style={styles.marginTitle}>Estimated Margin</Text>
                                            <Text style={[styles.marginPercent, { color: derivedValues.margin > 20 ? '#10B981' : derivedValues.margin > 0 ? '#fbe134' : '#EF4444' }]}>
                                                {derivedValues.margin.toFixed(1)}%
                                            </Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${Math.min(Math.max(derivedValues.margin, 0), 100)}%`, backgroundColor: derivedValues.margin > 20 ? '#10B981' : derivedValues.margin > 0 ? '#fbe134' : '#EF4444' }]} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        
                    </ScrollView>

                    <View style={styles.footer}>
                        {step > 1 && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => setStep(step - 1)}
                            >
                                <ArrowLeft size={20} color="#FFFFFF" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.disabledButton, { flex: step === 1 ? 1 : 2 }]}
                            onPress={step < 3 ? () => setStep(step + 1) : handleSave}
                            disabled={loading || (step === 1 && !product.name)}
                        >
                            {loading ? (
                                <ActivityIndicator color="#111827" />
                            ) : (
                                <>
                                    <Text style={styles.saveButtonText}>{step < 3 ? 'Next' : 'Initialize Product'}</Text>
                                    {step < 3 ? <ArrowRight size={20} color="#111827" /> : <Save size={20} color="#111827" />}
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1d21', 
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        maxHeight: '92%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    subTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#fbe134',
        marginTop: 2,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
    scrollContent: {
        padding: 24,
        gap: 20,
    },
    sectionContainer: {
        gap: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#D1D5DB',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    bulkToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 225, 52, 0.05)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(251, 225, 52, 0.15)',
    },
    bulkToggleTitle: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    bulkToggleDesc: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: 'rgba(251, 225, 52, 0.6)',
        marginTop: 2,
    },
    bulkContent: {
        gap: 20,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(251, 225, 52, 0.1)',
    },
    mathNote: {
        fontSize: 11,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    marginCard: {
        backgroundColor: '#2a2e34',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    marginRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    marginItem: {
        flex: 1,
    },
    marginLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    marginValue: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    marginProgressContainer: {
        gap: 10,
    },
    marginHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    marginTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FFFFFF',
    },
    marginPercent: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
        backgroundColor: '#2a2e34',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
    },
    backButtonText: {
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fbe134',
        paddingVertical: 16,
        borderRadius: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#111827',
    },
});
