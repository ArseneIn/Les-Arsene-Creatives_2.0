import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { User, Phone, X, Save } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiClient } from '../lib/api_client';

interface CreateCustomerModalProps {
    visible: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateCustomerModal({ visible, onClose, onCreated }: CreateCustomerModalProps) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Required Field', 'Please enter the client name.');
            return;
        }

        if (!phone.trim()) {
            Alert.alert('Required Field', 'Please enter the phone number.');
            return;
        }

        // Basic phone validation (at least 8 digits)
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 8) {
            Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
            return;
        }

        setLoading(true);
        try {
            await ApiClient.createCustomer({
                name: name.trim(),
                phone: phone.trim(),
            });

            // Reset and Close
            setName('');
            setPhone('');
            onCreated();
        } catch (error: any) {
            console.error('CreateCustomerModal: Save failed', error);
            Alert.alert('Error', error?.message || 'Failed to register client. Please try again.');
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
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity 
                    style={styles.backdrop} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                
                <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <View style={styles.iconBox}>
                                <User size={20} color="#fbe134" />
                            </View>
                            <Text style={styles.title}>Add New Client</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Register a client to track their lifetime value and manage credit sales.
                    </Text>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Client Name</Text>
                            <View style={styles.inputWrapper}>
                                <User size={18} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                />
                            </View>
                        </View>

                        {/* Phone Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <Phone size={18} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 078XXXXXXX"
                                    placeholderTextColor="#9CA3AF"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Note */}
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                Clients registered here will appear in your CRM and can be selected during POS checkout.
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#2a2e34" />
                        ) : (
                            <>
                                <Save size={20} color="#2a2e34" />
                                <Text style={styles.saveButtonText}>Create Client Profile</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: '#1a1d21',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#2a2e34',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 225, 52, 0.2)',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#f3f4f6',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        color: '#9CA3AF',
        lineHeight: 18,
        marginBottom: 24,
    },
    form: {
        gap: 20,
        marginBottom: 32,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Montserrat_700Bold',
        color: '#9CA3AF',
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2e34',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#f3f4f6',
    },
    infoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderStyle: 'dashed',
    },
    infoText: {
        fontSize: 12,
        fontFamily: 'Montserrat_500Medium',
        color: '#6B7280',
        lineHeight: 18,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#fbe134',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        gap: 10,
        shadowColor: '#fbe134',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonDisabled: {
        opacity: 0.5,
        backgroundColor: 'rgba(251, 225, 52, 0.2)',
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1a1d21',
    },
});
