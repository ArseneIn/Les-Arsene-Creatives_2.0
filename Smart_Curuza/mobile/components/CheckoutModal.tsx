import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Animated, Share } from 'react-native';
import { X, Banknote, Smartphone, FileText, CheckCircle2, ArrowRight, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem } from '../lib/types';
import { generateTextReceipt } from '../lib/receipt_generator';
import { ApiClient } from '../lib/api_client';
import * as Sharing from 'expo-sharing';

interface CheckoutModalProps {
    visible: boolean;
    totalAmount: number;
    items: CartItem[];
    isSuccess: boolean;
    onClose: () => void;
    onConfirm: (method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT', details?: { phone?: string, clientName?: string }) => void;
    onNewSale: () => void;
}

export default function CheckoutModal({ visible, totalAmount, items, isSuccess, onClose, onConfirm, onNewSale }: CheckoutModalProps) {
    const insets = useSafeAreaInsets();
    const [method, setMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CREDIT'>('CASH');
    const [phone, setPhone] = useState('');
    const [clientName, setClientName] = useState('');
    const [formHeight] = useState(new Animated.Value(0));
    const [shopName, setShopName] = useState('Smart Curuza Shop');

    // Reset state when modal opens
    useEffect(() => {
        if (visible && !isSuccess) {
            setMethod('CASH');
            setPhone('');
            setClientName('');
            Animated.timing(formHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false
            }).start();
            
            // Fetch shop name for receipt
            ApiClient.getMerchantProfile().then(profile => {
                if (profile.businessName) setShopName(profile.businessName);
            }).catch(() => {});
        }
    }, [visible, isSuccess]);

    const handleMethodSelect = (selected: 'CASH' | 'MOBILE_MONEY' | 'CREDIT') => {
        setMethod(selected);
        
        if (selected === 'CREDIT') {
            Animated.spring(formHeight, { toValue: 160, useNativeDriver: false, friction: 8 }).start();
        } else if (selected === 'MOBILE_MONEY') {
            Animated.spring(formHeight, { toValue: 80, useNativeDriver: false, friction: 8 }).start();
        } else {
            Animated.spring(formHeight, { toValue: 0, useNativeDriver: false, friction: 8 }).start();
        }
    };

    const isConfirmDisabled = () => {
        if (method === 'MOBILE_MONEY' && phone.length < 10) return true;
        if (method === 'CREDIT' && (clientName.trim() === '' || phone.length < 10)) return true;
        return false;
    };

    const handleProcess = () => {
        if (isConfirmDisabled()) return;
        
        const details: any = {};
        if (method === 'MOBILE_MONEY') details.phone = phone;
        if (method === 'CREDIT') {
            details.phone = phone;
            details.clientName = clientName;
        }

        onConfirm(method, details);
    };

    const handleShareReceipt = async () => {
        const receiptText = generateTextReceipt(
            items, 
            totalAmount, 
            shopName, 
            method === 'CREDIT' ? 'Debt (Ideni)' : method,
            clientName
        );

        try {
            await Share.share({
                message: receiptText,
                title: 'Digital Receipt',
            });
        } catch (error) {
            console.error('Sharing failed', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
                
                <View style={[styles.modalBody, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
                    <View style={styles.dragIndicator} />
                    
                    {!isSuccess ? (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Complete Sale</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                {/* Summary Header */}
                                <View style={styles.summaryContainer}>
                                    <Text style={styles.summaryLabel}>Total Due</Text>
                                    <Text style={styles.summaryAmount}>{totalAmount.toLocaleString()} <Text style={styles.currencyCode}>RWF</Text></Text>
                                </View>

                                {/* Payment Type Selection */}
                                <Text style={styles.sectionTitle}>Payment Method</Text>
                                
                                <View style={styles.methodGrid}>
                                    <TouchableOpacity 
                                        style={[styles.methodCard, method === 'CASH' && styles.methodCardActive]} 
                                        onPress={() => handleMethodSelect('CASH')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, method === 'CASH' && styles.iconActiveContainer]}>
                                            <Banknote size={24} color={method === 'CASH' ? "#fbe134" : "#6B7280"} />
                                        </View>
                                        <Text style={[styles.methodText, method === 'CASH' && styles.methodTextActive]}>Cash</Text>
                                        {method === 'CASH' && <CheckCircle2 size={20} color="#fbe134" />}
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[styles.methodCard, method === 'MOBILE_MONEY' && styles.methodCardActive]} 
                                        onPress={() => handleMethodSelect('MOBILE_MONEY')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, method === 'MOBILE_MONEY' && styles.iconActiveContainer]}>
                                            <Smartphone size={24} color={method === 'MOBILE_MONEY' ? "#fbe134" : "#6B7280"} />
                                        </View>
                                        <Text style={[styles.methodText, method === 'MOBILE_MONEY' && styles.methodTextActive]}>MoMo</Text>
                                        {method === 'MOBILE_MONEY' && <CheckCircle2 size={20} color="#fbe134" />}
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[styles.methodCard, method === 'CREDIT' && styles.methodCardActive]} 
                                        onPress={() => handleMethodSelect('CREDIT')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, method === 'CREDIT' && styles.iconActiveContainer]}>
                                            <FileText size={24} color={method === 'CREDIT' ? "#fbe134" : "#6B7280"} />
                                        </View>
                                        <Text style={[styles.methodText, method === 'CREDIT' && styles.methodTextActive]}>Ideni (Debt)</Text>
                                        {method === 'CREDIT' && <CheckCircle2 size={20} color="#fbe134" />}
                                    </TouchableOpacity>
                                </View>

                                {/* CRM Form */}
                                <Animated.View style={[styles.formArea, { height: formHeight, opacity: formHeight.interpolate({ inputRange: [0, 80], outputRange: [0, 1] }) }]}>
                                    {method === 'CREDIT' && (
                                        <View style={styles.inputWrapper}>
                                            <Text style={styles.inputLabel}>Client Name</Text>
                                            <View style={styles.inputGroup}>
                                                <User size={18} color="#9CA3AF" style={styles.inputIcon} />
                                                <TextInput 
                                                    style={styles.input}
                                                    placeholder="Enter full name"
                                                    placeholderTextColor="#4B5563"
                                                    value={clientName}
                                                    onChangeText={setClientName}
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {(method === 'MOBILE_MONEY' || method === 'CREDIT') && (
                                        <View style={[styles.inputWrapper, method === 'CREDIT' && { marginTop: 16 }]}>
                                            <Text style={styles.inputLabel}>Phone Number</Text>
                                            <View style={styles.inputGroup}>
                                                <Smartphone size={18} color="#9CA3AF" style={styles.inputIcon} />
                                                <TextInput 
                                                    style={styles.input}
                                                    placeholder="e.g. 078..."
                                                    placeholderTextColor="#4B5563"
                                                    keyboardType="phone-pad"
                                                    value={phone}
                                                    onChangeText={setPhone}
                                                    maxLength={10}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </Animated.View>
                                
                            </ScrollView>

                            <View style={styles.footer}>
                                <TouchableOpacity 
                                    style={[styles.confirmButton, isConfirmDisabled() && styles.confirmDisabled]} 
                                    onPress={handleProcess}
                                    disabled={isConfirmDisabled()}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.confirmText}>Proceed Checkout</Text>
                                    <View style={styles.confirmArrowBox}>
                                        <ArrowRight size={18} color="#0b0c0c" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={styles.successView}>
                            <View style={styles.successHeader}>
                                <View style={styles.successCircle}>
                                    <CheckCircle2 size={48} color="#10B981" />
                                </View>
                                <Text style={styles.successTitle}>Sale Completed!</Text>
                                <Text style={styles.successSub}>The transaction has been recorded.</Text>
                            </View>

                            <View style={styles.receiptSummary}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryText}>Total Amount</Text>
                                    <Text style={styles.summaryValue}>{totalAmount.toLocaleString()} RWF</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryText}>Method</Text>
                                    <Text style={styles.summaryValue}>{method === 'CREDIT' ? 'Debt (Ideni)' : method}</Text>
                                </View>
                                {clientName && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryText}>Client</Text>
                                        <Text style={styles.summaryValue}>{clientName}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.successFooter}>
                                <TouchableOpacity 
                                    style={styles.shareButton} 
                                    onPress={handleShareReceipt}
                                    activeOpacity={0.8}
                                >
                                    <Smartphone size={20} color="#fbe134" />
                                    <Text style={styles.shareButtonText}>Share Digital Receipt</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.newSaleButton} 
                                    onPress={onNewSale}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.newSaleButtonText}>New Sale</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns modal to the bottom
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    modalBody: {
        backgroundColor: '#1a1d21', // Dark UI background
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        width: '100%',
        maxHeight: '92%', // Prevents overflow on small screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 20,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    closeBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    summaryContainer: {
        alignItems: 'center',
        marginBottom: 32,
        paddingVertical: 16,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    summaryAmount: {
        fontSize: 40,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    currencyCode: {
        fontSize: 18,
        color: '#fbe134',
        fontFamily: 'Montserrat_600SemiBold',
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    methodGrid: {
        flexDirection: 'column',
        gap: 12,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#23262A',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    methodCardActive: {
        backgroundColor: 'rgba(251, 225, 52, 0.05)', // Faint gold tint
        borderColor: 'rgba(251, 225, 52, 0.4)', // Faint gold border
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconActiveContainer: {
        backgroundColor: 'rgba(251, 225, 52, 0.1)',
    },
    methodText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#D1D5DB',
    },
    methodTextActive: {
        color: '#FFFFFF',
        fontFamily: 'Poppins_700Bold',
    },
    formArea: {
        overflow: 'hidden',
        marginTop: 24,
    },
    inputWrapper: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#23262A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15,
        color: '#FFFFFF',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        backgroundColor: '#1a1d21',
    },
    confirmButton: {
        backgroundColor: '#fbe134',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    confirmDisabled: {
        opacity: 0.4,
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#0b0c0c',
        letterSpacing: 0.5,
    },
    confirmArrowBox: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 4,
    },
    // Success View Styles
    successView: {
        padding: 24,
        alignItems: 'center',
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    successSub: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
    },
    receiptSummary: {
        width: '100%',
        backgroundColor: '#23262A',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 32,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.02)',
    },
    summaryText: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#9CA3AF',
    },
    summaryValue: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    successFooter: {
        width: '100%',
        gap: 16,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(251, 225, 52, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(251, 225, 52, 0.2)',
        paddingVertical: 16,
        borderRadius: 20,
        gap: 12,
    },
    shareButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#fbe134',
    },
    newSaleButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    newSaleButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1a1d21',
    }
});
