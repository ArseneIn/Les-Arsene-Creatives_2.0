import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { X, Banknote, Smartphone, CreditCard, Check, ArrowRight, ChevronLeft } from 'lucide-react-native';

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
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                    enabled
                >
                    <View style={styles.modalContent}>
                        {/* Handlebar for Bottom Sheet feel */}
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        <ScrollView 
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Header */}
                            <View style={styles.headerSection}>
                                <View style={styles.headerTop}>
                                    <View>
                                        <Text style={styles.title}>Checkout</Text>
                                        <Text style={styles.subtitle}>Complete your purchase</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                        <X size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.totalCard}>
                                    <Text style={styles.totalLabel}>Grand Total</Text>
                                    <View style={styles.amountRow}>
                                        <Text style={styles.amountSymbol}>RWF</Text>
                                        <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Content */}
                            <View style={styles.contentSection}>
                                {step === 'SELECT' ? (
                                    <>
                                        <Text style={styles.sectionTitle}>Payment Method</Text>
                                        <View style={styles.methodsGrid}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.methodCard,
                                                    selectedMethod === 'CASH' && styles.selectedCard
                                                ]}
                                                onPress={() => setSelectedMethod('CASH')}
                                            >
                                                <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'CASH' && styles.bgGold]}>
                                                    <Banknote size={24} color={selectedMethod === 'CASH' ? "#0b0c0c" : "#6B7280"} />
                                                </View>
                                                <Text style={[styles.methodLabel, selectedMethod === 'CASH' && styles.selectedText]}>Cash</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.methodCard,
                                                    selectedMethod === 'MOBILE_MONEY' && styles.selectedCard
                                                ]}
                                                onPress={() => setSelectedMethod('MOBILE_MONEY')}
                                            >
                                                <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'MOBILE_MONEY' && styles.bgGold]}>
                                                    <Smartphone size={24} color={selectedMethod === 'MOBILE_MONEY' ? "#0b0c0c" : "#6B7280"} />
                                                </View>
                                                <Text style={[styles.methodLabel, selectedMethod === 'MOBILE_MONEY' && styles.selectedText]}>MoMo</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.methodCard,
                                                    selectedMethod === 'CREDIT' && styles.selectedCard
                                                ]}
                                                onPress={() => setSelectedMethod('CREDIT')}
                                            >
                                                <View style={[styles.iconCircle, styles.bgGray, selectedMethod === 'CREDIT' && styles.bgGold]}>
                                                    <CreditCard size={24} color={selectedMethod === 'CREDIT' ? "#0b0c0c" : "#6B7280"} />
                                                </View>
                                                <Text style={[styles.methodLabel, selectedMethod === 'CREDIT' && styles.selectedText]}>Credit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.phoneStepContainer}>
                                        <View style={styles.phoneHeader}>
                                            <TouchableOpacity onPress={() => setStep('SELECT')} style={styles.backLink}>
                                                <ChevronLeft size={16} color="#4B5563" />
                                                <Text style={styles.backText}>Change Method</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.sectionTitle}>MoMo Details</Text>
                                        </View>
                                        
                                        <View style={styles.inputCard}>
                                            <Text style={styles.inputLabel}>Recipient Phone Number</Text>
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
                                            <Text style={styles.helperText}>A payment prompt will be sent to this number.</Text>
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
                                        <ActivityIndicator color="#0b0c0c" />
                                    ) : (
                                        <>
                                            <Text style={styles.confirmText}>
                                                {step === 'SELECT' && selectedMethod === 'MOBILE_MONEY' ? 'Proceed to Phone' : 'Confirm & Pay'}
                                            </Text>
                                            {step === 'SELECT' && selectedMethod === 'MOBILE_MONEY' ? (
                                                <ArrowRight size={20} color="#0b0c0c" />
                                            ) : (
                                                <Check size={20} color="#0b0c0c" />
                                            )}
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '92%',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#E5E7EB',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#6B7280',
        marginTop: -4,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    totalCard: {
        backgroundColor: '#fbe134', // Gold
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    totalLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#0b0c0c',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        opacity: 0.6,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    amountSymbol: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: '#0b0c0c',
        marginRight: 6,
    },
    totalAmount: {
        fontSize: 40,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
    },
    contentSection: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    methodsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    methodCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        height: 100,
    },
    selectedCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#fbe134',
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    bgGray: { backgroundColor: '#F3F4F6' },
    bgGold: { backgroundColor: '#fbe134' },

    methodLabel: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
    },
    selectedText: {
        color: '#0b0c0c',
    },
    phoneStepContainer: {
        marginBottom: 24,
    },
    phoneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    backText: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#4B5563',
        textDecorationLine: 'underline',
    },
    inputCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#6B7280',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 16,
        overflow: 'hidden',
        height: 56,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        gap: 8,
        height: '100%',
    },
    flag: {
        fontSize: 20,
    },
    codeText: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#111827',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 18,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#0b0c0c',
    },
    helperText: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        color: '#9CA3AF',
        marginTop: 12,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#fbe134', // Primary Gold
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#E5E7EB',
    },
    confirmText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
