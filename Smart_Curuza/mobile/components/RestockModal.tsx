import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, Save, Layers, Briefcase, Calendar, ChevronDown, Package } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface RestockModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    availableProducts: { id: string; name: string; unit: string }[];
}

export default function RestockModal({ visible, onClose, onSuccess, availableProducts }: RestockModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const [batch, setBatch] = useState({
        quantity: '',
        buying_price_per_unit: '',
        selling_price: '',
        expiry_date: '', // Optional format YYYY-MM-DD
    });

    const handleSave = async () => {
        if (!selectedProductId || !batch.quantity || !batch.buying_price_per_unit) {
            Alert.alert('Error', 'Product, Quantity, and Buying Price are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                product_id: selectedProductId,
                original_quantity: parseFloat(batch.quantity),
                current_quantity: parseFloat(batch.quantity),
                buying_price_per_unit: parseFloat(batch.buying_price_per_unit),
                selling_price: batch.selling_price ? parseFloat(batch.selling_price) : undefined,
                expiry_date: batch.expiry_date || null,
            };
            
            await ApiClient.createBatch(payload);
            
            Alert.alert('Restock Successful', 'New inventory batch added successfully!');
            setBatch({ quantity: '', buying_price_per_unit: '', selling_price: '', expiry_date: '' });
            setSelectedProductId(null);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to restock product:', error);
            Alert.alert('Error', 'Failed to create inventory batch');
        } finally {
            setLoading(false);
        }
    };

    const selectedProduct = availableProducts.find(p => p.id === selectedProductId);

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
                            <Text style={styles.title}>Receive Stock</Text>
                            <Text style={styles.subTitle}>Add new batch to inventory</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Product Selection</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select Product *</Text>
                                <TouchableOpacity 
                                    style={styles.dropdownSelector}
                                    onPress={() => setShowDropdown(!showDropdown)}
                                >
                                    <View style={styles.dropdownRow}>
                                        <Package size={18} color={selectedProductId ? "#fbe134" : "#9CA3AF"} style={styles.inputIcon} />
                                        <Text style={[styles.dropdownText, !selectedProductId && { color: '#6B7280' }]}>
                                            {selectedProduct ? selectedProduct.name : 'Choose a product from catalog'}
                                        </Text>
                                    </View>
                                    <ChevronDown size={18} color="#9CA3AF" />
                                </TouchableOpacity>

                                {showDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        {availableProducts.map(prod => (
                                            <TouchableOpacity 
                                                key={prod.id} 
                                                style={styles.dropdownMenuItem}
                                                onPress={() => {
                                                    setSelectedProductId(prod.id);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownMenuItemText}>{prod.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Batch Details</Text>
                            
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Quantity Received *</Text>
                                    <View style={styles.inputContainer}>
                                        <Layers size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={batch.quantity}
                                            onChangeText={(text) => setBatch(prev => ({ ...prev, quantity: text }))}
                                            placeholder="0"
                                            placeholderTextColor="#6B7280"
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.unitSuffix}>{selectedProduct?.unit || 'units'}</Text>
                                    </View>
                                </View>

                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Expiry (Optional)</Text>
                                    <View style={styles.inputContainer}>
                                        <Calendar size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={batch.expiry_date}
                                            onChangeText={(text) => setBatch(prev => ({ ...prev, expiry_date: text }))}
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Buying Cost per Unit *</Text>
                                    <View style={styles.inputContainer}>
                                        <Briefcase size={18} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={batch.buying_price_per_unit}
                                            onChangeText={(text) => setBatch(prev => ({ ...prev, buying_price_per_unit: text }))}
                                            placeholder="0 RWF"
                                            placeholderTextColor="#6B7280"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Retail Selling Price *</Text>
                                    <View style={styles.inputContainer}>
                                        <Briefcase size={18} color="#fbe134" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            value={batch.selling_price}
                                            onChangeText={(text) => setBatch(prev => ({ ...prev, selling_price: text }))}
                                            placeholder="0 RWF"
                                            placeholderTextColor="#6B7280"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>

                        </View>
                        
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#111827" />
                            ) : (
                                <>
                                    <Save size={20} color="#111827" />
                                    <Text style={styles.saveButtonText}>Confirm Restock</Text>
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
        backgroundColor: '#1a1d21', // Dark Theme
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        maxHeight: '85%',
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
        color: '#fbe134', // Restock gets gold primary
    },
    subTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 2,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
    scrollContent: {
        padding: 24,
        gap: 24,
    },
    sectionContainer: {
        backgroundColor: '#2a2e34',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 20, 
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: -4,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
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
        backgroundColor: '#1a1d21', 
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    dropdownSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1d21', 
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 54,
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
    },
    dropdownMenu: {
        backgroundColor: '#1a1d21',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginTop: 4,
        maxHeight: 150,
        overflow: 'hidden',
    },
    dropdownMenuItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    dropdownMenuItemText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#FFFFFF',
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
    unitSuffix: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 8,
    },
    footer: {
        padding: 24,
        backgroundColor: '#2a2e34',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
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
