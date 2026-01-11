import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, Save, Package, Barcode, Tag, Layers, Scale } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProductModal({ visible, onClose, onSuccess }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        barcode: '',
        price: '',
        stock: '',
        unit: 'pcs',
        buying_unit: 'box',
        conversion_factor: '1'
    });

    const handleSave = async () => {
        if (!product.name || !product.price || !product.stock) {
            Alert.alert('Error', 'Name, Price, and Stock are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...product,
                price: parseFloat(product.price),
                stock: parseInt(product.stock),
                conversion_factor: parseInt(product.conversion_factor)
            };
            await ApiClient.createProduct(payload);
            Alert.alert('Success', 'Product added successfully');
            setProduct({
                name: '',
                barcode: '',
                price: '',
                stock: '',
                unit: 'pcs',
                buying_unit: 'box',
                conversion_factor: '1'
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create product:', error);
            Alert.alert('Error', 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Add New Product</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Name *</Text>
                        <View style={styles.inputContainer}>
                            <Package size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={product.name}
                                onChangeText={(text) => setProduct(prev => ({ ...prev, name: text }))}
                                placeholder="e.g. Milk 1L"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Barcode (Optional)</Text>
                        <View style={styles.inputContainer}>
                            <Barcode size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={product.barcode}
                                onChangeText={(text) => setProduct(prev => ({ ...prev, barcode: text }))}
                                placeholder="Scan or type barcode"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Price (RWF) *</Text>
                            <View style={styles.inputContainer}>
                                <Tag size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={product.price}
                                    onChangeText={(text) => setProduct(prev => ({ ...prev, price: text }))}
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Stock *</Text>
                            <View style={styles.inputContainer}>
                                <Layers size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={product.stock}
                                    onChangeText={(text) => setProduct(prev => ({ ...prev, stock: text }))}
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Unit</Text>
                            <View style={styles.inputContainer}>
                                <Scale size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={product.unit}
                                    onChangeText={(text) => setProduct(prev => ({ ...prev, unit: text }))}
                                    placeholder="pcs"
                                    placeholderTextColor="#9CA3AF"
                                />
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
                                <Text style={styles.saveButtonText}>Save Product</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 24,
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#374151',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        color: '#111827',
    },
    footer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
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
