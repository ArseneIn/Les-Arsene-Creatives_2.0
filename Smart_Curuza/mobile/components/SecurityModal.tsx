import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { X, ShieldCheck, Lock, Save } from 'lucide-react-native';
import { ApiClient } from '../lib/api_client';
import { useAuth } from '../lib/auth/AuthContext';
import { useTheme } from '../lib/theme/ThemeContext';

interface SecurityModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SecurityModal({ visible, onClose }: SecurityModalProps) {
    const { logout } = useAuth();
    const { isDarkMode } = useTheme();
    const [saving, setSaving] = useState(false);
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleSave = async () => {
        if (!oldPin || !newPin || !confirmPin) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (newPin !== confirmPin) {
            Alert.alert('Error', 'New PIN and confirmation do not match');
            return;
        }

        if (newPin.length !== 4) {
            Alert.alert('Error', 'PIN must be exactly 4 digits');
            return;
        }

        setSaving(true);
        try {
            await ApiClient.changePin(oldPin, newPin);
            Alert.alert(
                'Success', 
                'PIN changed successfully. For security reasons, please log in again.',
                [{ text: 'OK', onPress: () => { onClose(); logout(); } }]
            );
        } catch (error: any) {
            console.error('Failed to change PIN:', error);
            Alert.alert('Error', error.message || 'Failed to change PIN. Make sure your current PIN is correct.');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#F3F4F6' }]}
            >
                <View style={[styles.header, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
                    <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>Security Settings</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <X size={24} color={isDarkMode ? '#F9FAFB' : '#111827'} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.iconContainer}>
                        <ShieldCheck size={48} color="#059669" />
                        <Text style={[styles.subtitle, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}>Update Your PIN</Text>
                        <Text style={[styles.description, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                            Your PIN is used to log into the POS terminal. Please keep it secure.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>Current PIN</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF', borderColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]}>
                            <Lock size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}
                                value={oldPin}
                                onChangeText={setOldPin}
                                placeholder="Enter current 4-digit PIN"
                                placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>New PIN</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF', borderColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]}>
                            <Lock size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}
                                value={newPin}
                                onChangeText={setNewPin}
                                placeholder="Enter new 4-digit PIN"
                                placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? '#D1D5DB' : '#374151' }]}>Confirm New PIN</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF', borderColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]}>
                            <Lock size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: isDarkMode ? '#F9FAFB' : '#111827' }]}
                                value={confirmPin}
                                onChangeText={setConfirmPin}
                                placeholder="Re-enter new PIN"
                                placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', borderTopColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#111827" />
                        ) : (
                            <>
                                <Save size={20} color="#111827" />
                                <Text style={styles.saveButtonText}>Update PIN</Text>
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
    iconContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: '#111827',
        marginTop: 12,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 16,
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
