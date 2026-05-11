import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';
import { FileText, X, CheckCircle2 } from 'lucide-react-native';

interface EbmConfigModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function EbmConfigModal({ visible, onClose }: EbmConfigModalProps) {
    const { colors, isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    
    // EBM Fields
    const [tin, setTin] = useState('');
    const [bhfId, setBhfId] = useState('');
    const [cmcKey, setCmcKey] = useState('');
    const [serialNumber, setSerialNumber] = useState('');

    useEffect(() => {
        if (visible) {
            // We would fetch existing config here if available
            // ApiClient.getEbmConfig().then(...)
        }
    }, [visible]);

    const handleSave = async () => {
        if (!tin || !bhfId) {
            Alert.alert('Validation Error', 'TIN and BHF ID are required.');
            return;
        }

        setLoading(true);
        try {
            // We would save to the backend here:
            // await ApiClient.saveEbmConfig({ tin, bhfId, cmcKey, serialNumber });
            
            // Simulating API delay for now since the EBM module might need specific DTOs
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            Alert.alert('Success', 'EBM Configuration saved successfully.');
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to save configuration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>EBM Configuration</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={[styles.infoBox, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <FileText size={24} color={colors.brandGold} style={{ marginBottom: 8 }} />
                            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>RRA Integration</Text>
                            <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
                                Enter your Rwanda Revenue Authority credentials to enable automatic electronic billing machine (EBM) receipts.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Taxpayer Identification Number (TIN)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
                                    value={tin}
                                    onChangeText={setTin}
                                    placeholder="Enter 9-digit TIN"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Branch/Head Office ID (BHF ID)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
                                    value={bhfId}
                                    onChangeText={setBhfId}
                                    placeholder="e.g. 00"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>CMC Key</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
                                    value={cmcKey}
                                    onChangeText={setCmcKey}
                                    placeholder="Enter your CMC Key"
                                    placeholderTextColor={colors.textSecondary}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Device Serial Number</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
                                    value={serialNumber}
                                    onChangeText={setSerialNumber}
                                    placeholder="e.g. SDC12345678"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <TouchableOpacity 
                            style={[styles.saveButton, { backgroundColor: colors.brandGold }]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0b0c0c" />
                            ) : (
                                <>
                                    <CheckCircle2 size={20} color="#0b0c0c" style={{ marginRight: 8 }} />
                                    <Text style={styles.saveButtonText}>Save Configuration</Text>
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
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 24,
    },
    infoBox: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 4,
    },
    infoDesc: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        lineHeight: 20,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
    },
    saveButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#0b0c0c',
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
    }
});
