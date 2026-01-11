import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { X, Banknote, Smartphone, CreditCard, Check, ArrowRight } from 'lucide-react-native';

interface CheckoutModalProps {
    visible: boolean;
    totalAmount: number;
    onClose: () => void;
    onConfirm: (method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT', phoneNumber?: string) => Promise<void>;
}

export default function CheckoutModal({ visible, totalAmount, onClose, onConfirm }: CheckoutModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CREDIT'>('CASH');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleConfirm = async () => {
        if (selectedMethod === 'MOBILE_MONEY' && !phoneNumber) {
            // Basic validation
            return;
        }

        setProcessing(true);
        try {
            await onConfirm(selectedMethod, phoneNumber);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Dark Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTop}>
                        <Text style={styles.title}>Checkout</Text>
                        <TouchableOpacity onPress={onClose} disabled={processing} style={styles.closeButton}>
                            <X size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total to Pay</Text>
                        <Text style={styles.totalAmount}>{totalAmount.toLocaleString()} RWF</Text>
                    </View>
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>

                    <View style={styles.methodsGrid}>
                        {/* Cash Option */}
                        <TouchableOpacity
                            style={[styles.methodCard, selectedMethod === 'CASH' && styles.selectedCard]}
                            onPress={() => setSelectedMethod('CASH')}
                            disabled={processing}
                        >
                            <View style={[styles.iconCircle, selectedMethod === 'CASH' ? styles.bgGold : styles.bgGray]}>
                                <Banknote size={24} color={selectedMethod === 'CASH' ? '#0b0c0c' : '#6B7280'} />
                            </View>
                            <Text style={[styles.methodLabel, selectedMethod === 'CASH' && styles.selectedText]}>Cash</Text>
                            {selectedMethod === 'CASH' && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>

                        {/* MoMo Option */}
                        <TouchableOpacity
                            style={[styles.methodCard, selectedMethod === 'MOBILE_MONEY' && styles.selectedCard]}
                            onPress={() => setSelectedMethod('MOBILE_MONEY')}
                            disabled={processing}
                        >
                            <View style={[styles.iconCircle, selectedMethod === 'MOBILE_MONEY' ? styles.bgGold : styles.bgGray]}>
                                <Smartphone size={24} color={selectedMethod === 'MOBILE_MONEY' ? '#0b0c0c' : '#6B7280'} />
                            </View>
                            <Text style={[styles.methodLabel, selectedMethod === 'MOBILE_MONEY' && styles.selectedText]}>MoMo</Text>
                            {selectedMethod === 'MOBILE_MONEY' && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>

                        {/* Credit Option */}
                        <TouchableOpacity
                            style={[styles.methodCard, selectedMethod === 'CREDIT' && styles.selectedCard]}
                            onPress={() => setSelectedMethod('CREDIT')}
                            disabled={processing}
                        >
                            <View style={[styles.iconCircle, selectedMethod === 'CREDIT' ? styles.bgGold : styles.bgGray]}>
                                <CreditCard size={24} color={selectedMethod === 'CREDIT' ? '#0b0c0c' : '#6B7280'} />
                            </View>
                            <Text style={[styles.methodLabel, selectedMethod === 'CREDIT' && styles.selectedText]}>Credit</Text>
                            {selectedMethod === 'CREDIT' && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    </View>

                    {/* Phone Number Input for MoMo */}
                    {selectedMethod === 'MOBILE_MONEY' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="078..."
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            (processing || (selectedMethod === 'MOBILE_MONEY' && !phoneNumber)) && styles.disabledButton
                        ]}
                        onPress={handleConfirm}
                        disabled={processing || (selectedMethod === 'MOBILE_MONEY' && !phoneNumber)}
                    >
                        {processing ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text style={styles.confirmText}>
                                    {selectedMethod === 'MOBILE_MONEY' ? 'Pay with MoMo' : 'Confirm Payment'}
                                </Text>
                                <ArrowRight size={20} color="#FFFFFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerSection: {
        backgroundColor: '#2a2e34', // Jet (Dark Theme)
        padding: 24,
        paddingTop: 48, // Status bar space
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    totalCard: {
        backgroundColor: '#fbe134', // Gold
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    totalLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#0b0c0c',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        opacity: 0.7,
    },
    totalAmount: {
        fontSize: 36,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    contentSection: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    methodsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    methodCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        height: 110,
    },
    selectedCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#fbe134',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    bgGray: { backgroundColor: '#E5E7EB' },
    bgGold: { backgroundColor: '#fbe134' },

    methodLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    selectedText: {
        color: '#0b0c0c',
    },
    activeIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fbe134',
    },
    confirmButton: {
        backgroundColor: '#0b0c0c', // Onyx
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    confirmText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#0b0c0c',
    },
});
