import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, Save, DollarSign, Tag, AlignLeft, ChevronDown } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    'Rent',
    'Utilities',
    'Salaries',
    'Transport',
    'Tax',
    'Supplies',
    'Maintenance',
    'Others'
];

export default function AddExpenseModal({ visible, onClose, onSuccess }: AddExpenseModalProps) {
    const [loading, setLoading] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Others',
        description: '',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    });

    const handleSave = async () => {
        if (!formData.amount || !formData.description) {
            Alert.alert('Error', 'Amount and Description are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date
            };
            
            await ApiClient.createExpense(payload);
            
            Alert.alert('Success', 'Expense recorded successfully!');
            setFormData({
                amount: '',
                category: 'Others',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to log expense:', error);
            Alert.alert('Error', 'Failed to record expense. Please try again.');
        } finally {
            setLoading(false);
        }
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
                            <Text style={styles.title}>Log Expense</Text>
                            <Text style={styles.subTitle}>Record business overhead costs</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Amount (RWF) *</Text>
                            <View style={[styles.inputContainer, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                                <DollarSign size={18} color="#EF4444" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={formData.amount}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                                    placeholder="0"
                                    placeholderTextColor="#6B7280"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Category *</Text>
                            <TouchableOpacity 
                                style={styles.dropdownSelector}
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <View style={styles.dropdownRow}>
                                    <Tag size={18} color="#fbe134" style={styles.inputIcon} />
                                    <Text style={styles.dropdownText}>{formData.category}</Text>
                                </View>
                                <ChevronDown size={18} color="#9CA3AF" />
                            </TouchableOpacity>

                            {showCategoryDropdown && (
                                <View style={styles.dropdownMenu}>
                                    <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                                        {CATEGORIES.map(cat => (
                                            <TouchableOpacity 
                                                key={cat} 
                                                style={styles.dropdownMenuItem}
                                                onPress={() => {
                                                    setFormData(prev => ({ ...prev, category: cat }));
                                                    setShowCategoryDropdown(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownMenuItemText}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description *</Text>
                            <View style={styles.inputContainer}>
                                <AlignLeft size={18} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                    placeholder="What was this for?"
                                    placeholderTextColor="#6B7280"
                                    multiline={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date</Text>
                            <View style={[styles.inputContainer, { opacity: 0.6 }]}>
                                <TextInput
                                    style={styles.input}
                                    value={formData.date}
                                    editable={false}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#6B7280"
                                />
                            </View>
                            <Text style={styles.infoText}>Currently set to today's date</Text>
                        </View>
                        
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Save size={20} color="#FFFFFF" />
                                    <Text style={styles.saveButtonText}>Confirm & Log</Text>
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
        maxHeight: '80%',
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
        color: '#EF4444',
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
        gap: 20,
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
    dropdownSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2a2e34', 
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
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
        backgroundColor: '#2a2e34',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginTop: 4,
        overflow: 'hidden',
        zIndex: 1000,
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
    infoText: {
        fontSize: 10,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        marginTop: 2,
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
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#FFFFFF',
    },
});
