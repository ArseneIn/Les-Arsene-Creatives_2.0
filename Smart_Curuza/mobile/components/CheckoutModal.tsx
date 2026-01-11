import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
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
    const [step, setStep] = useState<'SELECT' | 'PHONE'>('SELECT');

    const handleClose = () => {
        setStep('SELECT');
        setPhoneNumber('');
        onClose();
    };

    const handleNext = () => {
        if (selectedMethod === 'MOBILE_MONEY') {
            setStep('PHONE');
        } else {
            handleConfirm();
        }
    };

    const handleConfirm = async () => {
        if (selectedMethod === 'MOBILE_MONEY' && !phoneNumber) return;

        setProcessing(true);
        try {
            await onConfirm(selectedMethod, phoneNumber);
            // Reset after successful confirmation (if modal doesn't unmount)
            setTimeout(() => {
                setStep('SELECT');
                setPhoneNumber('');
            }, 500);
        } catch (error) {
            // Handle error if needed
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <View style={styles.headerTop}>
                            <Text style={styles.title}>Checkout</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <X size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.totalCard}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>{totalAmount.toLocaleString()} RWF</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        {step === 'SELECT' ? (
                            <>
                                <Text style={styles.sectionTitle}>Select Payment Method</Text>
                                <View style={styles.methodsGrid}>
                                    <TouchableOpacity
                                        style={[
                                            styles.methodCard,
                                            selectedMethod === 'CASH' && styles.selectedCard
                                        ]}
                                        onPress={() => setSelectedMethod('CASH')}
                                    >
                                        <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'CASH' && styles.bgGold]}>
                                            <Banknote size={24} color="#0b0c0c" />
                                        </View>
                                        <Text style={[styles.methodLabel, selectedMethod === 'CASH' && styles.selectedText]}>Cash</Text>
                                        {selectedMethod === 'CASH' && <View style={styles.activeIndicator} />}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.methodCard,
                                            selectedMethod === 'MOBILE_MONEY' && styles.selectedCard
                                        ]}
                                        onPress={() => setSelectedMethod('MOBILE_MONEY')}
                                    >
                                        <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'MOBILE_MONEY' && styles.bgGold]}>
                                            <Smartphone size={24} color="#0b0c0c" />
                                        </View>
                                        <Text style={[styles.methodLabel, selectedMethod === 'MOBILE_MONEY' && styles.selectedText]}>Mobile Money</Text>
                                        {selectedMethod === 'MOBILE_MONEY' && <View style={styles.activeIndicator} />}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.methodCard,
                                            selectedMethod === 'CREDIT' && styles.selectedCard
                                        ]}
                                        onPress={() => setSelectedMethod('CREDIT')}
                                    >
                                        <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'CREDIT' && styles.bgGold]}>
                                            <CreditCard size={24} color="#0b0c0c" />
                                        </View>
                                        <Text style={[styles.methodLabel, selectedMethod === 'CREDIT' && styles.selectedText]}>Credit</Text>
                                        {selectedMethod === 'CREDIT' && <View style={styles.activeIndicator} />}
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <View>
                                <Text style={styles.sectionTitle}>Enter Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Mobile Money Number</Text>
                                    <View style={styles.phoneInputWrapper}>
                                        <View style={styles.countryCode}>
                                            <Text style={styles.flag}>🇷🇼</Text>
                                            <Text style={styles.codeText}>+250</Text>
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="788 123 456"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="phone-pad"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            autoFocus
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (processing || (step === 'PHONE' && !phoneNumber)) && styles.disabledButton
                            ]}
                            onPress={handleNext}
                            disabled={processing || (step === 'PHONE' && !phoneNumber)}
                        >
                            {processing ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text style={styles.confirmText}>
                                        {step === 'SELECT' && selectedMethod === 'MOBILE_MONEY' ? 'Next' : 'Confirm Payment'}
                                    </Text>
                                    {step === 'SELECT' && selectedMethod === 'MOBILE_MONEY' ? (
                                        <ArrowRight size={20} color="#FFFFFF" />
                                    ) : (
                                        <Check size={20} color="#FFFFFF" />
                                    )}
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
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        maxHeight: '90%',
    },
    headerSection: {
        backgroundColor: '#2a2e34', // Jet (Dark Theme)
        padding: 24,
        paddingTop: 24,
        paddingBottom: 32,
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
        paddingBottom: 48, // Extra padding for bottom safe area
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
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        overflow: 'hidden',
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#F3F4F6',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        gap: 8,
    },
    flag: {
        fontSize: 20,
    },
    codeText: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#0b0c0c',
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium',
        color: '#0b0c0c',
    },
});
