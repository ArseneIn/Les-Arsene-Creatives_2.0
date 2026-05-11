import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ApiClient } from '../lib/api_client';
import { useTheme } from '../lib/theme/ThemeContext';
import { Banknote, LogOut } from 'lucide-react-native';

interface CloseShiftModalProps {
    visible: boolean;
    shiftId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CloseShiftModal({ visible, shiftId, onClose, onSuccess }: CloseShiftModalProps) {
    const { colors, isDarkMode } = useTheme();
    const [actualCash, setActualCash] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCloseShift = async () => {
        const amount = Number(actualCash.replace(/[^0-9]/g, ''));
        if (isNaN(amount) || amount < 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid actual cash amount.');
            return;
        }

        setLoading(true);
        try {
            await ApiClient.closeShift(shiftId, amount, notes);
            Alert.alert('Shift Closed', 'Your shift has been successfully closed.');
            onSuccess();
        } catch (error: any) {
            console.error('Failed to close shift:', error);
            Alert.alert('Error', error?.message || 'Could not close shift.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
                <View style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.iconContainer}>
                        <LogOut size={32} color={colors.danger} />
                    </View>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Close Shift</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Enter the final physical cash in your drawer to close this shift.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Actual Cash (RWF)</Text>
                        <View style={[styles.inputGroup, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <Banknote size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="e.g., 50000"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="number-pad"
                                value={actualCash}
                                onChangeText={setActualCash}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Notes (Optional)</Text>
                        <View style={[styles.inputGroup, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Any discrepancies or notes?"
                                placeholderTextColor={colors.textSecondary}
                                value={notes}
                                onChangeText={setNotes}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[styles.cancelButton, { borderColor: colors.border }]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.danger }]}
                            onPress={handleCloseShift}
                            disabled={loading || actualCash.trim() === ''}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Confirm Close</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 18,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    cancelText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
    },
    button: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins_700Bold',
        fontSize: 14,
    }
});
