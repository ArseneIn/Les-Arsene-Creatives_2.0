import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { X, DollarSign, CreditCard } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DebtRepaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    customerName: string;
    currentDebt: number;
    isLoading?: boolean;
}

export default function DebtRepaymentModal({ visible, onClose, onConfirm, customerName, currentDebt, isLoading }: DebtRepaymentModalProps) {
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        const val = Number(amount);
        if (val > 0 && val <= currentDebt) {
            onConfirm(val);
            setAmount('');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Record Repayment</Text>
                            <Text style={styles.subtitle}>{customerName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#0b0c0c" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.debtSummary}>
                            <Text style={styles.summaryLabel}>Outstanding Debt</Text>
                            <Text style={styles.summaryValue}>{currentDebt.toLocaleString()} RWF</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>AMOUNT TO REPAY (RWF)</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.iconLeft}><CreditCard size={20} color="#9CA3AF" /></View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter amount paid"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text style={styles.helperText}>Maximum possible repayment is {currentDebt.toLocaleString()} RWF</Text>
                        </View>

                        <TouchableOpacity 
                            style={[
                                styles.submitButton, 
                                (isLoading || !amount || Number(amount) <= 0 || Number(amount) > currentDebt) && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > currentDebt}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#0b0c0c" />
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Confirm Payment</Text>
                                    <DollarSign size={20} color="#0b0c0c" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        width: '100%',
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    closeButton: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        padding: 24,
    },
    debtSummary: {
        backgroundColor: '#FDFBE7',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fbe134',
        marginBottom: 24,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        color: '#EF4444',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 11,
        fontFamily: 'Montserrat_700Bold',
        color: '#6B7280',
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 16,
        paddingLeft: 48,
        paddingRight: 16,
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    iconLeft: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    helperText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#fbe134',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
});
